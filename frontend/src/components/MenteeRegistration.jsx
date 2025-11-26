import React, { useState } from 'react';
import './MenteeRegistration.css';

export default function MenteeRegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    branch: '',
    batch: '',
    contactNumber: '',
    areaOfInterest: '',
    description: ''
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.batch) newErrors.batch = 'Batch is required';
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    if (!formData.areaOfInterest) newErrors.areaOfInterest = 'Area of interest is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
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
          branch: '',
          batch: '',
          contactNumber: '',
          areaOfInterest: '',
          description: ''
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
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 className="form-title">Mentee Registration</h1>
          <p className="form-subtitle">Fill out all the Experience form</p>
        </div>

        <div className="form-card">
          {submitted && (
            <div className="success-message">
              ✓ Registration submitted successfully!
            </div>
          )}

          <div className="form-content">
            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`input ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
                Personal Email ID <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">
                  <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Contact No <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`input ${errors.contactNumber ? 'input-error' : ''}`}
                />
                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
              </div>

              <div className="form-group">
                <label className="label">
                  <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  Batch <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  className={`input ${errors.batch ? 'input-error' : ''}`}
                />
                {errors.batch && <span className="error-text">{errors.batch}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Branch <span className="required">*</span>
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                className={`input ${errors.branch ? 'input-error' : ''}`}
              />
              {errors.branch && <span className="error-text">{errors.branch}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Area of Interest <span className="required">*</span>
              </label>
              <select
                name="areaOfInterest"
                value={formData.areaOfInterest}
                onChange={handleChange}
                className={`select ${errors.areaOfInterest ? 'input-error' : ''}`}
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
              {errors.areaOfInterest && <span className="error-text">{errors.areaOfInterest}</span>}
            </div>

            <div className="form-group">
              <label className="label">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Background, goals, or additional information"
                rows="4"
                className={`textarea ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          </div>
        </div>

        <div className="form-footer">
          Designed with for Mentorship Program
        </div>
      </div>
    </div>
  );
}