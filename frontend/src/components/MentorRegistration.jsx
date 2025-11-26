import React, { useState } from 'react';

export default function MentorRegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    designation: '',
    currentCompany: '',
    branch: '',
    passedOutYear: '',
    contactNumber: '',
    areaOfInterest: '',
    supportDescription: ''
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
    
    if (!formData.areaOfInterest) newErrors.areaOfInterest = 'Area of interest is required';
    if (!formData.supportDescription) newErrors.supportDescription = 'Support description is required';
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Form data:', formData);
      setTimeout(() => {
        setFormData({
          email: '',
          fullName: '',
          designation: '',
          currentCompany: '',
          branch: '',
          passedOutYear: '',
          contactNumber: '',
          areaOfInterest: '',
          supportDescription: ''
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 style={styles.formTitle}>Mentor Registration</h1>
          <p style={styles.formSubtitle}>Join our mentorship program</p>
        </div>

        <div style={styles.formCard}>
          {submitted && (
            <div style={styles.successMessage}>
              ✓ Registration submitted successfully!
            </div>
          )}

          <div style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
                Email <span style={styles.autoFetch}>(Auto-fetched)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Full Name <span style={styles.autoFetch}>(Auto-fetched)</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Designation <span style={styles.autoFetch}>(Auto-fetched)</span>
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Current Company <span style={styles.autoFetch}>(Auto-fetched)</span>
              </label>
              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft"
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Branch <span style={styles.autoFetch}>(Auto-fetched)</span>
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Passed Out Year <span style={styles.autoFetch}>(Auto-fetched)</span>
                </label>
                <input
                  type="text"
                  name="passedOutYear"
                  value={formData.passedOutYear}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact Number <span style={styles.autoFetch}>(Auto-fetched)</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Area of Interest <span style={styles.required}>*</span>
              </label>
              <select
                name="areaOfInterest"
                value={formData.areaOfInterest}
                onChange={handleChange}
                style={{...styles.select, ...(errors.areaOfInterest ? styles.inputError : {})}}
              >
                <option value="">-- Select an option --</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="devops">DevOps</option>
              </select>
              {errors.areaOfInterest && <span style={styles.errorText}>{errors.areaOfInterest}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                What kind of support can you provide to the students? <span style={styles.required}>*</span>
              </label>
              <textarea
                name="supportDescription"
                value={formData.supportDescription}
                onChange={handleChange}
                placeholder="Explain how you can assist mentees"
                rows="4"
                style={{...styles.textarea, ...(errors.supportDescription ? styles.inputError : {})}}
              />
              {errors.supportDescription && <span style={styles.errorText}>{errors.supportDescription}</span>}
            </div>

            <button onClick={handleSubmit} style={styles.submitBtn}>
              Submit
            </button>
          </div>
        </div>

        <div style={styles.formFooter}>
          Designed with ❤ for Mentorship Program
        </div>
      </div>
    </div>
  );
}

const isMobile = window.innerWidth <= 768;
const isSmallMobile = window.innerWidth <= 480;

const styles = {
  formWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #e9d5ff 0%, #f3e8ff 30%, #e0e7ff 60%, #dbeafe 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? (isSmallMobile ? '30px 16px' : '40px 20px') : '60px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
  },
  dashboardBtn: {
    position: 'absolute',
    top: isMobile ? (isSmallMobile ? '16px' : '20px') : '25px',
    left: isMobile ? (isSmallMobile ? '16px' : '20px') : '25px',
    display: 'flex',
    alignItems: 'center',
    gap: isSmallMobile ? '6px' : '8px',
    padding: isMobile ? (isSmallMobile ? '8px 16px' : '9px 18px') : '10px 20px',
    background: 'white',
    border: 'none',
    borderRadius: '20px',
    color: '#7c3aed',
    fontSize: isMobile ? (isSmallMobile ? '0.8em' : '0.85em') : '0.9em',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    transition: 'all 0.2s ease',
  },
  dashboardIcon: {
    fontSize: '1.2em',
    lineHeight: '1',
    color: '#7c3aed',
  },
  dashboardText: {
    letterSpacing: '0.2px',
    color: '#7c3aed',
  },
  formContainer: {
    width: '100%',
    maxWidth: '620px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: isMobile ? (isSmallMobile ? '28px' : '32px') : '32px',
  },
  logo: {
    width: isMobile ? (isSmallMobile ? '56px' : '64px') : '72px',
    height: isMobile ? (isSmallMobile ? '56px' : '64px') : '72px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: isMobile ? (isSmallMobile ? '0 auto 20px' : '0 auto 24px') : '0 auto 24px',
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
  },
  logoSvg: {
    width: isMobile ? (isSmallMobile ? '28px' : '32px') : '36px',
    height: isMobile ? (isSmallMobile ? '28px' : '32px') : '36px',
    color: 'white',
    strokeWidth: '2.5',
  },
  formTitle: {
    fontSize: isMobile ? (isSmallMobile ? '1.5em' : '1.7em') : '2em',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  },
  formSubtitle: {
    color: '#6b7280',
    fontSize: isMobile ? (isSmallMobile ? '0.85em' : '0.9em') : '0.95em',
    fontWeight: '400',
  },
  formCard: {
    background: 'white',
    borderRadius: isMobile && isSmallMobile ? '16px' : '20px',
    padding: isMobile ? (isSmallMobile ? '32px 24px' : '40px 32px') : '48px 56px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
  },
  successMessage: {
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    color: 'white',
    padding: isSmallMobile ? '12px' : '14px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
    fontSize: isSmallMobile ? '0.9em' : '1em',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? (isSmallMobile ? '18px' : '20px') : '24px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: isMobile ? (isSmallMobile ? '0.85em' : '0.9em') : '0.9em',
    fontWeight: '600',
    color: '#4b5563',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  labelIcon: {
    width: isMobile && isSmallMobile ? '16px' : '18px',
    height: isMobile && isSmallMobile ? '16px' : '18px',
    color: '#8b5cf6',
    flexShrink: '0',
  },
  autoFetch: {
    fontSize: '0.95em',
    color: '#9ca3af',
    fontWeight: '400',
  },
  required: {
    color: '#ef4444',
    fontSize: '1.1em',
  },
  input: {
    padding: isMobile ? (isSmallMobile ? '12px 14px' : '13px 16px') : '14px 18px',
    fontSize: isMobile && isSmallMobile ? '0.88em' : '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    outline: 'none',
    color: '#1f2937',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    transition: 'all 0.2s ease',
  },
  select: {
    padding: isMobile ? (isSmallMobile ? '12px 14px' : '13px 16px') : '14px 18px',
    fontSize: isMobile && isSmallMobile ? '0.88em' : '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    outline: 'none',
    color: '#6b7280',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '40px',
  },
  textarea: {
    padding: isMobile ? (isSmallMobile ? '12px 14px' : '13px 16px') : '14px 18px',
    fontSize: isMobile && isSmallMobile ? '0.88em' : '0.92em',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    outline: 'none',
    color: '#1f2937',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    resize: 'vertical',
    minHeight: isSmallMobile ? '100px' : '120px',
    lineHeight: '1.6',
    transition: 'all 0.2s ease',
  },
  inputError: {
    borderColor: '#ef4444',
    background: '#fef2f2',
  },
  errorText: {
    fontSize: '0.8em',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '-6px',
  },
  submitBtn: {
    marginTop: '8px',
    padding: isSmallMobile ? '14px' : '16px',
    background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontSize: isMobile && isSmallMobile ? '0.9em' : '0.95em',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.35)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: '100%',
    transition: 'all 0.2s ease',
  },
  formFooter: {
    textAlign: 'center',
    marginTop: isSmallMobile ? '20px' : '24px',
    fontSize: isMobile && isSmallMobile ? '0.8em' : '0.85em',
    color: '#6b7280',
    fontWeight: '500',
  },
};