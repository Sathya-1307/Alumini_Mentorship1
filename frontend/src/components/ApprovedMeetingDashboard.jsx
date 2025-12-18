// src/pages/ApprovedMeetingDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovedMeetingDashboard.css";

export default function ApprovedMeetingDashboard() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchApproved = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/meeting-status/all");
      const approved = res.data.statuses.filter(s => s.statusApproval === "Approved");
      setStatuses(approved);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch approved statuses");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const toggleExpand = (statusId) => {
    setExpandedCard(expandedCard === statusId ? null : statusId);
  };

  if (loading) return <div className="loading-container"><p>Loading approved meetings...</p></div>;
  if (statuses.length === 0) return <div className="empty-container"><p>No approved meetings found.</p></div>;

  return (
    <div className="approved-dashboard-container">
      <h1>Approved Meetings</h1>
      <div className="approved-cards-grid">
        {statuses.map(status => (
          <div key={status._id} className="approved-card">
            <div className="approved-card-header">
              <span className={`meeting-status-badge ${status.status.toLowerCase()}`}>
                {status.status}
              </span>
            </div>
            
            <div className="approved-card-info">
              <div className="info-row">
                <span className="info-label">Mentor:</span>
                <span className="info-value">{status.mentor_user_id.basic?.email_id || status.mentor_user_id.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mentee:</span>
                <span className="info-value">{status.mentee_user_id.basic?.email_id || status.mentee_user_id.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Meeting Date:</span>
                <span className="info-value">{new Date(status.meeting_date).toLocaleDateString()}</span>
              </div>
            </div>

            {status.status === "Completed" && status.meeting_minutes && (
              <>
                <button 
                  className="meeting-minutes-btn"
                  onClick={() => toggleExpand(status._id)}
                >
                  Meeting Minutes
                  <span className={`arrow ${expandedCard === status._id ? 'up' : 'down'}`}>▼</span>
                </button>

                {expandedCard === status._id && (
                  <div className="minutes-card">
                    <h4>Meeting Minutes</h4>
                    <div className="minutes-content">
                      <p>{status.meeting_minutes}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {status.status === "Postponed" && status.postponed_reason && (
              <>
                <button 
                  className="meeting-minutes-btn postponed"
                  onClick={() => toggleExpand(status._id)}
                >
                  Postponed Reason
                  <span className={`arrow ${expandedCard === status._id ? 'up' : 'down'}`}>▼</span>
                </button>

                {expandedCard === status._id && (
                  <div className="minutes-card postponed">
                    <h4>Postponed Reason</h4>
                    <div className="minutes-content">
                      <p>{status.postponed_reason}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}