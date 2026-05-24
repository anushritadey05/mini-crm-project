import React, { useState } from 'react';
import './LeadForm.css';

const LeadForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'website',
      status: 'new',
      value: 0,
    }
  );

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Name and Email are required');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h3>{initialData ? '✏️ Edit Lead' : '➕ Add New Lead'}</h3>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Source</label>
          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="website">Website</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="referral">Referral</option>
            <option value="social-media">Social Media</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="negotiating">Negotiating</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deal Value ($)</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          {initialData ? 'Update Lead' : 'Create Lead'}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LeadForm;