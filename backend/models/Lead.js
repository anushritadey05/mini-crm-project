const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['website', 'email', 'phone', 'referral', 'social-media', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'],
      default: 'new',
    },
    notes: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followUpDate: Date,
    value: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);