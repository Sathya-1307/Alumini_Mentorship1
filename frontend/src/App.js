import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenteeRegistration from './components/MenteeRegistration';
import MentorRegistration from './components/MentorRegistration';
import './App.css';
import MenteeMentorAssignment from './components/Mentee-Mentor';
import MentorshipSchedulingForm from './components/Mentor_scheduling';
import MeetingStatusUpdateForm from './components/Meeting_Status';
import ProgramFeedbackForm from './components/Feedback';
import Dashboard from './components/Dashboard';
import ScheduledDashboard from './components/ScheduledDashboard';
import PendingMeetingDashboard from './components/PendingMeetingDashboard';
import ApprovedMeetingDashboard from './components/ApprovedMeetingDashboard';
import DashboardHome from './components/DashboardHome';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import MentorshipDashboard from './components/MentorshipDashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
         <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menteeregistration" element={<MenteeRegistration />} />
          <Route path="/mentorregistration" element={<MentorRegistration />} />
                    <Route path="/menteementor_assign" element={<MenteeMentorAssignment/>} />
                    <Route path="/mentor_scheduling" element={<MentorshipSchedulingForm/>} />
                    <Route path="/meeting_updatation" element={<MeetingStatusUpdateForm/>} />
                                        <Route path="/program_feedback" element={<ProgramFeedbackForm/>} />
                                        <Route path="/scheduled_dashboard" element={<DashboardHome/>} />
                    <Route path="/scheduled_dashboard/:email" element={<ScheduledDashboard/>} />
                    <Route path="/pending_meetings" element={<PendingMeetingDashboard/>} />
                    <Route path="/approved_meetings" element={<ApprovedMeetingDashboard/>} />
                    <Route path="/admin_dashboard" element={<AdminDashboard/>} />
                    <Route path="/co-ordinator" element={<MentorshipDashboard/>} />
            

        </Routes>
      </div>
    </Router>
  );
}

export default App;