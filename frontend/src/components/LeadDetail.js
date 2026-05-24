import React, { useState } from 'react';
import LeadForm from './LeadForm';
import './LeadDetail.css';

const LeadDetail = ({ lead, onUpdate, onDelete, onAddNote, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleUpdate = (data) => {
    onUpdate(data);
    setIsEditing(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
    }
  };

  if (isEditing) {
    return (
      <div className="lead-detail">
        <button className="close-btn" onClick={() => setIsEditing(false)}>
          ← Back
        </button>
        <LeadForm
          initialData={lead}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="lead-detail">
      <div className="detail-header">
        <h2>{lead.name}</h2>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      <div className="detail-body">
        {/* Info Section */}
        <section className="detail-section">
          <h3>📋 Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{lead.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{lead.phone || '-'}</p>
            </div>
            <div className="info-item">
              <label>Company</label>
              <p>{lead.company || '-'}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p className={`status-label status-${lead.status}`}>
                {lead.status.toUpperCase()}
              </p>
            </div>
            <div className="info-item">
              <label>Source</label>
              <p>{lead.source}</p>
            </div>
            <div className="info-item">
              <label>Deal Value</label>
              <p>${lead.value || 0}</p>
            </div>
          </div>
        </section>

        {/* Dates Section */}
        <section className="detail-section">
          <h3>📅 Timeline</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Created</label>
              <p>{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
            <div className="info-item">
              <label>Updated</label>
              <p>{new Date(lead.updatedAt).toLocaleString()}</p>
            </div>
            {lead.followUpDate && (
              <div className="info-item">
                <label>Follow-up Date</label>
                <p>{new Date(lead.followUpDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </section>

        {/* Notes Section */}
        <section className="detail-section">
          <h3>📝 Notes</h3>
          <form className="note-form" onSubmit={handleAddNote}>
            <textarea
              placeholder="Add a follow-up note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button type="submit" className="add-note-btn">
              Add Note
            </button>
          </form>

          {lead.notes && lead.notes.length > 0 ? (
            <div className="notes-list">
              {lead.notes.map((note, index) => (
                <div key={index} className="note-item">
                  <div className="note-header">
                    <span className="note-time">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notes">No notes yet</p>
          )}
        </section>
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          ✏️ Edit Lead
        </button>
        <button className="delete-btn" onClick={onDelete}>
          🗑️ Delete Lead
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;