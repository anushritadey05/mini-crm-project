import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as leadAPI from '../api';
import LeadList from './LeadList';
import LeadForm from './LeadForm';
import LeadDetail from './LeadDetail';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadAPI.getLeads();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads
  useEffect(() => {
    let filtered = leads;

    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLeads(filtered);
  }, [leads, statusFilter, searchTerm]);

  const handleAddLead = async (leadData) => {
    try {
      await leadAPI.createLead(leadData);
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleUpdateLead = async (id, leadData) => {
    try {
      await leadAPI.updateLead(id, leadData);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.deleteLead(id);
        setSelectedLead(null);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleAddNote = async (leadId, noteText) => {
    try {
      await leadAPI.addNote(leadId, { text: noteText });
      fetchLeads();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Statistics
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 Mini CRM Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
        <div className="header-buttons">
          <Link to="/analytics" className="analytics-link">
          📊 Analytics
          </Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
        
      </header>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>🆕 New</h3>
          <p className="stat-number">{stats.new}</p>
        </div>
        <div className="stat-card">
          <h3>📞 Contacted</h3>
          <p className="stat-number">{stats.contacted}</p>
        </div>
        <div className="stat-card">
          <h3>✅ Converted</h3>
          <p className="stat-number">{stats.converted}</p>
        </div>
      </section>

      <div className="dashboard-container">
        {/* Main Content */}
        <div className="main-content">
          {/* Controls */}
          <div className="controls">
            <input
              type="text"
              placeholder="🔍 Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="negotiating">Negotiating</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <button
              className="add-lead-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✖ Close' : '➕ Add New Lead'}
            </button>
          </div>

          {/* Add Lead Form */}
          {showForm && (
            <LeadForm
              onSubmit={handleAddLead}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Leads List */}
          {loading ? (
            <p className="loading">Loading leads...</p>
          ) : filteredLeads.length > 0 ? (
            <LeadList
              leads={filteredLeads}
              onSelectLead={setSelectedLead}
            />
          ) : (
            <p className="no-leads">No leads found</p>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            onUpdate={(data) => handleUpdateLead(selectedLead._id, data)}
            onDelete={() => handleDeleteLead(selectedLead._id)}
            onAddNote={(noteText) => handleAddNote(selectedLead._id, noteText)}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;