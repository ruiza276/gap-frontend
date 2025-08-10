import React from 'react';

const Header = () => {
  return (
    <header>
      <div className="text-center mb-8">
        <div className="header-content">
          <h1>
            <span className="logo-text">GapinMyResume</span>
            <span style={{ color: 'var(--primary-blue)' }}>.dev</span>
          </h1>
          <p>
            What does one do with so much time?
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <a 
              href="https://github.com/ruiza276" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              🔗 GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/alex-r-6205b113b/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              💼 LinkedIn
            </a>
          </div>
          
          <div style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            color: 'var(--success-green)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'var(--success-green)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            Available for opportunities
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;