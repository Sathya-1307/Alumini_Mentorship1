import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGo = () => {
    if (!email.trim()) {
      alert("Please enter an email");
      return;
    }
    navigate(`/scheduled_dashboard/${encodeURIComponent(email.trim())}`);
  };

  return (
    <div className="dashboard-home">
      <h1>Welcome to the Mentorship Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="email"
          placeholder="Enter mentee or mentor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <button
          onClick={handleGo}
          style={{ padding: "8px 12px", marginLeft: "10px" }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
