import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pending_Dashboard.css";

export default function PendingStatusDashboard() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchPendingStatuses();
  }, []);

  const fetchPendingStatuses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/meeting-status/all");
      const pending = res.data.statuses.filter(s => s.statusApproval === "Pending");
      setStatuses(pending);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pending statuses:", err);
      setLoading(false);
      alert("Failed to fetch pending statuses.");
    }
  };

  const handleAction = async (statusId, action) => {
    try {
      setActionLoading(statusId);
      await axios.post("http://localhost:5000/api/meeting-status/approve-reject", {
        statusId,
        action
      });
      setStatuses(prev => prev.filter(s => s._id !== statusId));
      setActionLoading(null);
    } catch (err) {
      console.error(`${action} failed:`, err);
      alert(err.response?.data?.message || `${action} failed`);
      setActionLoading(null);
    }
  };

  const toggleExpand = (statusId) => {
    setExpandedCard(expandedCard === statusId ? null : statusId);
  };

  if (loading) return <div className="loading-container"><p>Loading pending statuses...</p></div>;
  if (statuses.length === 0) return <div className="empty-container"><p>No pending statuses.</p></div>;

  return (
    <div className="dashboard-container">
        <button className="dashboard-nav-btn" onClick={() => window.location.href = '/'}>
        <span className="nav-arrow">←</span>
        <span>Go to Dashboard</span>
      </button>
      <h1>Pending Meeting Statuses</h1>
      <div className="status-cards">
        {statuses.map(status => (
          <div key={status._id} className="status-card">
            <div className="card-header">
              <span className="status-badge">Pending</span>
            </div>
            
            <div className="card-info">
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
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`meeting-status ${status.status.toLowerCase()}`}>{status.status}</span>
              </div>
            </div>

            {(status.status === "Completed" || status.status === "Postponed") && (
              <button 
                className="view-details-btn"
                onClick={() => toggleExpand(status._id)}
              >
                {expandedCard === status._id ? "Hide Details" : "View Details"}
                <span className={`arrow ${expandedCard === status._id ? 'up' : 'down'}`}>▼</span>
              </button>
            )}

            {expandedCard === status._id && (
              <div className="details-card">
                {status.status === "Completed" && (
                  <>
                    <h4>Meeting Minutes</h4>
                    <div className="details-content">
                      <p>{status.meeting_minutes || "No minutes provided"}</p>
                    </div>
                  </>
                )}
                {status.status === "Postponed" && (
                  <>
                    <h4>Postponed Reason</h4>
                    <div className="details-content">
                      <p>{status.postponed_reason || "No reason provided"}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="action-buttons">
              <button
                onClick={() => handleAction(status._id, "Approved")}
                disabled={actionLoading === status._id}
                className="approve-btn"
              >
                {actionLoading === status._id ? "Processing..." : "✓ Approve"}
              </button>
              <button
                onClick={() => handleAction(status._id, "Rejected")}
                disabled={actionLoading === status._id}
                className="reject-btn"
              >
                {actionLoading === status._id ? "Processing..." : "✗ Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}