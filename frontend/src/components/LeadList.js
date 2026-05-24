import React from 'react';
import './LeadList.css';

const LeadList = ({ leads, onSelectLead }) => {
  const getStatusBadge = (status) => {
    const badges = {
      new: '🆕',
      contacted: '📞',
      qualified: '✅',
      negotiating: '💼',
      converted: '🎉',
      lost: '❌',
    };
    return badges[status] || '📋';
  };

  return (
    <div className="lead-list">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Source</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="lead-row">
              <td className="lead-name">{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.company || '-'}</td>
              <td>
                <span className="status-badge" data-status={lead.status}>
                  {getStatusBadge(lead.status)} {lead.status}
                </span>
              </td>
              <td>{lead.source}</td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => onSelectLead(lead)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;