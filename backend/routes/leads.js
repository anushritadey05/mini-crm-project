const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all leads
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single lead
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new lead
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company, source, value } = req.body;

    const newLead = new Lead({
      name,
      email,
      phone,
      company,
      source,
      value,
      createdBy: req.user.id,
    });

    await newLead.save();
    res.status(201).json({
      message: 'Lead created successfully',
      lead: newLead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lead
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company, source, status, value, followUpDate } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        company,
        source,
        status,
        value,
        followUpDate,
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add note to lead
router.post('/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.push({
      text,
      createdAt: new Date(),
    });

    await lead.save();

    res.json({
      message: 'Note added successfully',
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lead
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;