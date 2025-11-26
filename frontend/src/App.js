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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
         <Route path="/" element={<Dashboard />} />
          <Route path="/menteeregistration" element={<MenteeRegistration />} />
          <Route path="/mentorregistration" element={<MentorRegistration />} />
                    <Route path="/menteementor_assign" element={<MenteeMentorAssignment/>} />
                    <Route path="/mentor_scheduling" element={<MentorshipSchedulingForm/>} />
                    <Route path="/meeting_updatation" element={<MeetingStatusUpdateForm/>} />
                                        <Route path="/program_feedback" element={<ProgramFeedbackForm/>} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;