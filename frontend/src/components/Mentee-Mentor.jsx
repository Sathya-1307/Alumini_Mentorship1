import React, { useState } from 'react';
import './MenteeRegistration.css';

export default function MenteeMentorAssignment() {
  const [formData, setFormData] = useState({
    mentorName: '',
    phaseOfMentorship: '',
    commencementDate: '',
    endingDate: '',
    mentee1: '',
    mentee2: '',
    mentee3: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const mentors = [
    'Dr. Sarah Johnson',
    'Prof. Michael Chen',
    'Dr. Emily Rodriguez',
    'Prof. David Kim',
    'Dr. Amanda Williams'
  ];

  const phases = [
    'Phase 1 - Orientation',
    'Phase 2 - Skill Development',
    'Phase 3 - Project Work',
    'Phase 4 - Final Assessment'
  ];

  const mentees = [
    'Rahul Sharma',
    'Priya Patel',
    'Arjun Kumar',
    'Sneha Reddy',
    'Vikram Singh',
    'Anjali Gupta',
    'Rohan Mehta',
    'Kavya Iyer',
    'Aditya Joshi',
    'Meera Nair'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.mentorName) newErrors.mentorName = 'Mentor name is required';
    if (!formData.phaseOfMentorship) newErrors.phaseOfMentorship = 'Phase of mentorship is required';
    if (!formData.commencementDate) newErrors.commencementDate = 'Commencement date is required';
    if (!formData.endingDate) newErrors.endingDate = 'Ending date is required';
    if (!formData.mentee1) newErrors.mentee1 = 'At least 1 mentee is mandatory';
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Form data:', formData);
      setTimeout(() => {
        setFormData({
          mentorName: '',
          phaseOfMentorship: '',
          commencementDate: '',
          endingDate: '',
          mentee1: '',
          mentee2: '',
          mentee3: ''
        });
        setSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-wrapper">
      <button className="dashboard-btn" onClick={() => window.location.href = '/'}>
        <span className="dashboard-icon">←</span>
        <span className="dashboard-text">Go to Dashboard</span>
      </button>

      <div className="form-container">
        <div className="form-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h1 className="form-title">Mentee-Mentor Assignment</h1>
          <p className="form-subtitle">Assign mentees to mentors</p>
        </div>

        <div className="form-card">
          {submitted && (
            <div className="success-message">
              ✓ Assignment submitted successfully!
            </div>
          )}

          <div className="form-content">
            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mentor Name <span className="required">*</span>
              </label>
              <select
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                className={`select ${errors.mentorName ? 'input-error' : ''}`}
              >
                <option value="">-- Select Mentor --</option>
                {mentors.map((mentor, index) => (
                  <option key={index} value={mentor}>{mentor}</option>
                ))}
              </select>
              {errors.mentorName && <span className="error-text">{errors.mentorName}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                Phase of Mentorship <span className="required">*</span>
              </label>
              <select
                name="phaseOfMentorship"
                value={formData.phaseOfMentorship}
                onChange={handleChange}
                className={`select ${errors.phaseOfMentorship ? 'input-error' : ''}`}
              >
                <option value="">-- Select Phase --</option>
                {phases.map((phase, index) => (
                  <option key={index} value={phase}>{phase}</option>
                ))}
              </select>
              {errors.phaseOfMentorship && <span className="error-text">{errors.phaseOfMentorship}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Commencement Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="commencementDate"
                value={formData.commencementDate}
                onChange={handleChange}
                className={`input date-input ${errors.commencementDate ? 'input-error' : ''}`}
              />
              {errors.commencementDate && <span className="error-text">{errors.commencementDate}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Ending Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleChange}
                className={`input date-input ${errors.endingDate ? 'input-error' : ''}`}
              />
              {errors.endingDate && <span className="error-text">{errors.endingDate}</span>}
            </div>

            <div className="mentee-section">
              <div className="form-group">
                <label className="label mentee-label">
                  <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  Mentee 1 <span className="required">*</span>
                </label>
                <label className="sublabel">Select Mentee <span className="required">*</span></label>
                <select
                  name="mentee1"
                  value={formData.mentee1}
                  onChange={handleChange}
                  className={`select ${errors.mentee1 ? 'input-error' : ''}`}
                >
                  <option value="">-- Select Mentee --</option>
                  {mentees.map((mentee, index) => (
                    <option key={index} value={mentee}>{mentee}</option>
                  ))}
                </select>
                {errors.mentee1 && <span className="error-text">{errors.mentee1}</span>}
              </div>
            </div>

            <div className="mentee-section">
              <div className="form-group">
                <label className="label mentee-label">
                  <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  Mentee 2 <span className="optional-text">(Optional)</span>
                </label>
                <label className="sublabel">Select Mentee</label>
                <select
                  name="mentee2"
                  value={formData.mentee2}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">-- Select Mentee --</option>
                  {mentees.map((mentee, index) => (
                    <option key={index} value={mentee}>{mentee}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mentee-section">
              <div className="form-group">
                <label className="label mentee-label">
                  <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  Mentee 3 <span className="optional-text">(Optional)</span>
                </label>
                <label className="sublabel">Select Mentee</label>
                <select
                  name="mentee3"
                  value={formData.mentee3}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">-- Select Mentee --</option>
                  {mentees.map((mentee, index) => (
                    <option key={index} value={mentee}>{mentee}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="info-box">
              <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="info-text">
                At least 1 mentee is mandatory for each mentor. Maximum 3 mentees can be assigned.
              </span>
            </div>

            <button onClick={handleSubmit} className="submit-btn">
              Assign Mentor
            </button>
          </div>
        </div>

        <div className="form-footer">
          Designed with for Mentorship Program
        </div>
      </div>

      <style>{`
        .date-input {
          color: #6b7280;
          cursor: pointer;
        }

        .date-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: opacity(0.6);
        }

        .mentee-section {
          background: #f0f9ff;
          border-left: 3px solid #8b5cf6;
          padding: 18px 20px;
          border-radius: 10px;
          margin: 4px 0;
        }

        .mentee-section .form-group {
          gap: 8px;
        }

        .mentee-label {
          color: #7c3aed;
          font-weight: 700;
          font-size: 0.92em;
        }

        .mentee-label .label-icon {
          color: #8b5cf6;
        }

        .sublabel {
          font-size: 0.82em;
          font-weight: 500;
          color: #6b7280;
          letter-spacing: 0.2px;
          margin-top: -4px;
        }

        .optional-text {
          color: #6b7280;
          font-weight: 400;
          font-size: 0.85em;
          font-style: italic;
        }

        .info-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          padding: 14px 16px;
          border-radius: 10px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin: 4px 0;
        }

        .info-icon {
          width: 20px;
          height: 20px;
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-text {
          font-size: 0.84em;
          color: #78350f;
          line-height: 1.5;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .mentee-section {
            padding: 16px 18px;
          }

          .info-box {
            padding: 12px 14px;
          }

          .info-text {
            font-size: 0.82em;
          }
        }

        @media (max-width: 480px) {
          .mentee-section {
            padding: 14px 16px;
          }

          .mentee-label {
            font-size: 0.88em;
          }

          .sublabel {
            font-size: 0.8em;
          }

          .info-box {
            padding: 12px;
            gap: 10px;
          }

          .info-icon {
            width: 18px;
            height: 18px;
          }

          .info-text {
            font-size: 0.8em;
          }
        }
      `}</style>
    </div>
  );
}