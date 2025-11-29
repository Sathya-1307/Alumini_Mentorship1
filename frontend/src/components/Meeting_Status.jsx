import React, { useState } from 'react';

export default function MeetingStatusUpdateForm() {
  const [formData, setFormData] = useState({
    menteeName: '',
    mentorName: '',
    scheduledDate: '',
    meetingStatus: '',
    meetingMinutes: '',
    postponedReason: ''
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
    if (!formData.mentorName) newErrors.mentorName = 'Mentor name is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.meetingStatus) newErrors.meetingStatus = 'Meeting status is required';
    
    if (formData.meetingStatus === 'completed' && !formData.meetingMinutes) {
      newErrors.meetingMinutes = 'Meeting minutes are required for completed meetings';
    }
    
    if (formData.meetingStatus === 'postponed' && !formData.postponedReason) {
      newErrors.postponedReason = 'Postponed reason is required';
    }
    
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
          mentorName: '',
          scheduledDate: '',
          meetingStatus: '',
          meetingMinutes: '',
          postponedReason: ''
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
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h1 style={styles.formTitle}>Meeting Status Updation</h1>
          <p style={styles.formSubtitle}>Update your meeting status and details</p>
        </div>

        <div style={styles.formCard}>
          {submitted && (
            <div style={styles.successMessage}>
              ✓ Meeting status updated successfully!
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
                placeholder="Mentee Name"
                style={{...styles.input, ...(errors.menteeName ? styles.inputError : {})}}
              />
              {errors.menteeName && <span style={styles.errorText}>{errors.menteeName}</span>}
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
                placeholder="Mentor Name"
                style={{...styles.input, ...(errors.mentorName ? styles.inputError : {})}}
              />
              {errors.mentorName && <span style={styles.errorText}>{errors.mentorName}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Scheduled Date <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                style={{...styles.input, ...(errors.scheduledDate ? styles.inputError : {})}}
              />
              {errors.scheduledDate && <span style={styles.errorText}>{errors.scheduledDate}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                Meeting Status <span style={styles.required}>*</span>
              </label>
              <select
                name="meetingStatus"
                value={formData.meetingStatus}
                onChange={handleChange}
                style={{...styles.select, ...(errors.meetingStatus ? styles.inputError : {})}}
              >
                <option value="">-- Select Status --</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
                <option value="in-progress">In Progress</option>
              </select>
              {errors.meetingStatus && <span style={styles.errorText}>{errors.meetingStatus}</span>}
            </div>

            {formData.meetingStatus === 'completed' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Meeting Minutes <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="meetingMinutes"
                  value={formData.meetingMinutes}
                  onChange={handleChange}
                  placeholder="Enter meeting summary"
                  rows="4"
                  style={{...styles.textarea, ...(errors.meetingMinutes ? styles.inputError : {})}}
                />
                {errors.meetingMinutes && <span style={styles.errorText}>{errors.meetingMinutes}</span>}
              </div>
            )}

            {formData.meetingStatus === 'postponed' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Postponed Reason <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="postponedReason"
                  value={formData.postponedReason}
                  onChange={handleChange}
                  placeholder="Enter reason for postponement"
                  rows="4"
                  style={{...styles.textarea, ...(errors.postponedReason ? styles.inputError : {})}}
                />
                {errors.postponedReason && <span style={styles.errorText}>{errors.postponedReason}</span>}
              </div>
            )}

            <button onClick={handleSubmit} style={styles.submitBtn}>
              Submit
            </button>
          </div>
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