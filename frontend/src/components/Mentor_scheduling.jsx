import React, { useState } from 'react';

export default function MentorshipSchedulingForm() {
  const [formData, setFormData] = useState({
    menteeName: '',
    menteeEmail: '',
    mentorName: '',
    mentorEmail: '',
    meetingDate: '',
    meetingTime: '',
    duration: '',
    platform: '',
    meetingLink: '',
    agenda: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
    
    if (!formData.menteeName) newErrors.menteeName = 'Mentee name is required';
    
    if (!formData.menteeEmail) {
      newErrors.menteeEmail = 'Mentee email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.menteeEmail)) {
      newErrors.menteeEmail = 'Email is invalid';
    }
    
    if (!formData.mentorName) newErrors.mentorName = 'Mentor name is required';
    
    if (!formData.mentorEmail) {
      newErrors.mentorEmail = 'Mentor email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.mentorEmail)) {
      newErrors.mentorEmail = 'Email is invalid';
    }
    
    if (!formData.meetingDate) newErrors.meetingDate = 'Meeting date is required';
    if (!formData.meetingTime) newErrors.meetingTime = 'Meeting time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.meetingLink) newErrors.meetingLink = 'Meeting link is required';
    if (!formData.agenda) newErrors.agenda = 'Agenda is required';
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Form data:', formData);
      setTimeout(() => {
        setFormData({
          menteeName: '',
          menteeEmail: '',
          mentorName: '',
          mentorEmail: '',
          meetingDate: '',
          meetingTime: '',
          duration: '',
          platform: '',
          meetingLink: '',
          agenda: ''
        });
        setSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={styles.formWrapper}>
      <button style={styles.dashboardBtn} onClick={() => window.location.href = '/'}>
        <span style={styles.dashboardIcon}>←</span>
        <span style={styles.dashboardText}>Go to Dashboard</span>
      </button>

      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.logoSvg}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h1 style={styles.formTitle}>Mentorship Scheduling Form</h1>
          <p style={styles.formSubtitle}>Schedule your mentorship session</p>
        </div>

        <div style={styles.formCard}>
          {submitted && (
            <div style={styles.successMessage}>
              ✓ Meeting scheduled successfully!
            </div>
          )}

          <div style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mentee Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="menteeName"
                value={formData.menteeName}
                onChange={handleChange}
                placeholder="Auto fetched from profile"
                style={{...styles.input, ...(errors.menteeName ? styles.inputError : {})}}
              />
              {errors.menteeName && <span style={styles.errorText}>{errors.menteeName}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
                Mentee Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="menteeEmail"
                value={formData.menteeEmail}
                onChange={handleChange}
                placeholder="Auto fetched from profile"
                style={{...styles.input, ...(errors.menteeEmail ? styles.inputError : {})}}
              />
              {errors.menteeEmail && <span style={styles.errorText}>{errors.menteeEmail}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mentor Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                placeholder="Auto fetched from profile"
                style={{...styles.input, ...(errors.mentorName ? styles.inputError : {})}}
              />
              {errors.mentorName && <span style={styles.errorText}>{errors.mentorName}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
                Mentor Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="mentorEmail"
                value={formData.mentorEmail}
                onChange={handleChange}
                placeholder="Auto fetched from profile"
                style={{...styles.input, ...(errors.mentorEmail ? styles.inputError : {})}}
              />
              {errors.mentorEmail && <span style={styles.errorText}>{errors.mentorEmail}</span>}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Meeting Date <span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="meetingDate"
                  value={formData.meetingDate}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.meetingDate ? styles.inputError : {})}}
                />
                {errors.meetingDate && <span style={styles.errorText}>{errors.meetingDate}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Meeting Time <span style={styles.required}>*</span>
                </label>
                <input
                  type="time"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.meetingTime ? styles.inputError : {})}}
                />
                {errors.meetingTime && <span style={styles.errorText}>{errors.meetingTime}</span>}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Duration (minutes) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration in minutes"
                style={{...styles.input, ...(errors.duration ? styles.inputError : {})}}
              />
              {errors.duration && <span style={styles.errorText}>{errors.duration}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Platform <span style={styles.required}>*</span>
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                style={{...styles.select, ...(errors.platform ? styles.inputError : {})}}
              >
                <option value="">-- Select Platform --</option>
                <option value="zoom">Zoom</option>
                <option value="google-meet">Google Meet</option>
                <option value="microsoft-teams">Microsoft Teams</option>
                <option value="skype">Skype</option>
                <option value="discord">Discord</option>
                <option value="other">Other</option>
              </select>
              {errors.platform && <span style={styles.errorText}>{errors.platform}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Meeting Link <span style={styles.required}>*</span>
              </label>
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="Paste meeting link here"
                style={{...styles.input, ...(errors.meetingLink ? styles.inputError : {})}}
              />
              {errors.meetingLink && <span style={styles.errorText}>{errors.meetingLink}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Agenda / Notes <span style={styles.required}>*</span>
              </label>
              <textarea
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                placeholder="Write agenda or discussion points"
                rows="4"
                style={{...styles.textarea, ...(errors.agenda ? styles.inputError : {})}}
              />
              {errors.agenda && <span style={styles.errorText}>{errors.agenda}</span>}
            </div>

            <button onClick={handleSubmit} style={styles.submitBtn}>
              Schedule Meeting
            </button>
          </div>
        </div>

        <div style={styles.formFooter}>
          Designed with for Mentorship Program
        </div>
      </div>
    </div>
  );
}

const styles = {
  formWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #e9d5ff 0%, #f3e8ff 30%, #e0e7ff 60%, #dbeafe 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative'
  },
  dashboardBtn: {
    position: 'absolute',
    top: '25px',
    left: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    border: 'none',
    borderRadius: '20px',
    color: '#7c3aed',
    fontSize: '0.9em',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  dashboardIcon: {
    fontSize: '1.2em',
    lineHeight: '1',
    color: '#7c3aed'
  },
  dashboardText: {
    letterSpacing: '0.2px',
    color: '#7c3aed'
  },
  formContainer: {
    width: '100%',
    maxWidth: '620px'
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logo: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)'
  },
  logoSvg: {
    width: '36px',
    height: '36px',
    color: 'white',
    strokeWidth: '2.5'
  },
  formTitle: {
    fontSize: '2em',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px'
  },
  formSubtitle: {
    color: '#6b7280',
    fontSize: '0.95em',
    fontWeight: '400'
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '48px 56px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)'
  },
  successMessage: {
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    color: 'white',
    padding: '14px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
    animation: 'slideDown 0.4s ease'
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#4b5563',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  labelIcon: {
    width: '18px',
    height: '18px',
    color: '#8b5cf6',
    flexShrink: '0'
  },
  required: {
    color: '#ef4444',
    fontSize: '1.1em'
  },
  input: {
    padding: '14px 18px',
    fontSize: '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    transition: 'all 0.2s ease',
    outline: 'none',
    color: '#1f2937',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%'
  },
  select: {
    padding: '14px 18px',
    fontSize: '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    transition: 'all 0.2s ease',
    outline: 'none',
    color: '#6b7280',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '40px'
  },
  textarea: {
    padding: '14px 18px',
    fontSize: '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    transition: 'all 0.2s ease',
    outline: 'none',
    color: '#1f2937',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    resize: 'vertical',
    minHeight: '120px',
    lineHeight: '1.6'
  },
  inputError: {
    borderColor: '#ef4444',
    background: '#fef2f2'
  },
  errorText: {
    fontSize: '0.8em',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '-6px'
  },
  submitBtn: {
    marginTop: '8px',
    padding: '16px',
    background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontSize: '0.95em',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.35)',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%'
  },
  formFooter: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.85em',
    color: '#6b7280',
    fontWeight: '500'
  }
};