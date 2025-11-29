import React, { useState } from 'react';

export default function ProgramFeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    programOrganization: 0,
    matchingProcess: 0,
    supportProvided: 0,
    overallSatisfaction: 0,
    generalFeedback: '',
    suggestions: '',
    participateAgain: ''
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

  const handleRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }));
    if (errors[category]) {
      setErrors(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.programOrganization === 0) newErrors.programOrganization = 'Rating is required';
    if (formData.matchingProcess === 0) newErrors.matchingProcess = 'Rating is required';
    if (formData.supportProvided === 0) newErrors.supportProvided = 'Rating is required';
    if (formData.overallSatisfaction === 0) newErrors.overallSatisfaction = 'Rating is required';
    if (!formData.generalFeedback) newErrors.generalFeedback = 'General feedback is required';
    if (!formData.suggestions) newErrors.suggestions = 'Suggestions are required';
    if (!formData.participateAgain) newErrors.participateAgain = 'Please select an option';
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Form data:', formData);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          role: '',
          programOrganization: 0,
          matchingProcess: 0,
          supportProvided: 0,
          overallSatisfaction: 0,
          generalFeedback: '',
          suggestions: '',
          participateAgain: ''
        });
        setSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  const StarRating = ({ category, value, label, error }) => {
    return (
      <div style={styles.ratingGroup}>
        <label style={styles.label}>
          <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          {label} <span style={styles.required}>*</span>
        </label>
        <div style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(category, star)}
              style={styles.starButton}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  ...styles.star,
                  fill: star <= value ? '#fbbf24' : 'none',
                  stroke: star <= value ? '#fbbf24' : '#d1d5db'
                }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          ))}
        </div>
        {error && <span style={styles.errorText}>{error}</span>}
      </div>
    );
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
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h1 style={styles.formTitle}>Program Feedback</h1>
          <p style={styles.formSubtitle}>Share your experience with us</p>
        </div>

        <div style={styles.formCard}>
          {submitted && (
            <div style={styles.successMessage}>
              ✓ Feedback submitted successfully!
            </div>
          )}

          <div style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
                Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                You are a <span style={styles.required}>*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{...styles.select, ...(errors.role ? styles.inputError : {})}}
              >
                <option value="">Select Role</option>
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                
                <option value="coordinator">Coordinator</option>
              </select>
              {errors.role && <span style={styles.errorText}>{errors.role}</span>}
            </div>

            <StarRating
              category="programOrganization"
              value={formData.programOrganization}
              label="Program Organization"
              error={errors.programOrganization}
            />

            <StarRating
              category="matchingProcess"
              value={formData.matchingProcess}
              label="Matching Process"
              error={errors.matchingProcess}
            />

            <StarRating
              category="supportProvided"
              value={formData.supportProvided}
              label="Support Provided"
              error={errors.supportProvided}
            />

            <StarRating
              category="overallSatisfaction"
              value={formData.overallSatisfaction}
              label="Overall Satisfaction"
              error={errors.overallSatisfaction}
            />

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                General Feedback <span style={styles.required}>*</span>
              </label>
              <textarea
                name="generalFeedback"
                value={formData.generalFeedback}
                onChange={handleChange}
                placeholder="Share your overall experience with the program..."
                rows="4"
                style={{...styles.textarea, ...(errors.generalFeedback ? styles.inputError : {})}}
              />
              {errors.generalFeedback && <span style={styles.errorText}>{errors.generalFeedback}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Suggestions for Improvement <span style={styles.required}>*</span>
              </label>
              <textarea
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                placeholder="How can we improve the mentorship program?"
                rows="4"
                style={{...styles.textarea, ...(errors.suggestions ? styles.inputError : {})}}
              />
              {errors.suggestions && <span style={styles.errorText}>{errors.suggestions}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Would you participate in the program again? <span style={styles.required}>*</span>
              </label>
              <select
                name="participateAgain"
                value={formData.participateAgain}
                onChange={handleChange}
                style={{...styles.select, ...(errors.participateAgain ? styles.inputError : {})}}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes, definitely</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
              </select>
              {errors.participateAgain && <span style={styles.errorText}>{errors.participateAgain}</span>}
            </div>

            <button onClick={handleSubmit} style={styles.submitBtn}>
              Submit Feedback
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
  ratingGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
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
  starContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  starButton: {
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },
  star: {
    width: '32px',
    height: '32px',
    strokeWidth: '2',
    transition: 'all 0.2s ease'
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