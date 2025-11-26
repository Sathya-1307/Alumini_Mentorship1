import React from 'react';

export default function Dashboard() {
  const handleNavigate = (path) => {
    window.location.href = path;
  };

  const dashboardCards = [
    {
      title: 'Mentee Registration',
      description: 'Register as a mentee to find your ideal mentor',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      path: '/menteeregistration',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      title: 'Mentor Registration',
      description: 'Sign up as a mentor to guide students',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      ),
      path: '/mentorregistration',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
      title: 'Mentee-Mentor Assignment',
      description: 'Assign mentees to their mentors',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      path: '/menteementor_assign',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      title: 'Mentor Scheduling',
      description: 'Schedule mentorship sessions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      path: '/mentor_scheduling',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      title: 'Meeting Status Update',
      description: 'Update the status of mentorship meetings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      path: '/meeting_updatation',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    },
    {
      title: 'Program Feedback',
      description: 'Share your feedback about the program',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      path: '/program_feedback',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
    }
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '40px', height: '40px', color: 'white'}}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 style={styles.title}>Alumni Mentorship Program</h1>
          <p style={styles.subtitle}>Navigate through the mentorship journey</p>
        </div>

        {/* Dashboard Cards Grid */}
        <div style={styles.grid}>
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => handleNavigate(card.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{...styles.cardIcon, background: card.gradient}}>
                <div style={{width: '32px', height: '32px', color: 'white'}}>
                  {card.icon}
                </div>
              </div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <div style={styles.cardArrow}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '18px', height: '18px', color: '#8b5cf6'}}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          Designed with ❤️ for Mentorship Program
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #e9d5ff 0%, #f3e8ff 30%, #e0e7ff 60%, #dbeafe 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  container: {
    width: '100%',
    maxWidth: '1200px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  logo: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 28px',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
  },
  title: {
    fontSize: '2.5em',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1.1em',
    fontWeight: '400',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '28px',
    marginBottom: '40px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '36px 32px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  cardIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
  },
  cardTitle: {
    fontSize: '1.3em',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  cardDescription: {
    fontSize: '0.95em',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '16px',
    margin: '0 0 16px 0'
  },
  cardArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    transition: 'all 0.3s ease'
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#6b7280',
    fontWeight: '500'
  }
};