import React from 'react';

const Header = () => {
  return (
    <header className="enhanced-header">
      <div className="header-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="header-container">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="main-title">
              <span className="title-main">Gap</span>
              <span className="title-highlight">In</span>
              <span className="title-main">My</span>
              <span className="title-highlight">Resume</span>
              <span className="title-domain">.dev</span>
            </h1>
            <p className="tagline">
              Turning downtime into <span className="highlight-text">uptime</span> – 
              documenting the journey between opportunities
            </p>
          </div>

          <div className="status-section">
            <div className="availability-badge">
              <div className="pulse-dot"></div>
              <span>Available for opportunities</span>
            </div>
          </div>

          <div className="social-section">
            <div className="social-links">
              <a 
                href="https://github.com/ruiza276" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-btn github"
              >
                <span className="social-icon">⚡</span>
                <span className="social-text">GitHub</span>
                <div className="btn-glow"></div>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/alex-r-6205b113b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-btn linkedin"
              >
                <span className="social-icon">🚀</span>
                <span className="social-text">LinkedIn</span>
                <div className="btn-glow"></div>
              </a>
              
              <a 
                href="https://alexruiz.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-btn portfolio"
              >
                <span className="social-icon">🌟</span>
                <span className="social-text">Portfolio</span>
                <div className="btn-glow"></div>
              </a>
            </div>
          </div>

          <div className="subtitle">
            <p>What does one do with so much time? <em>Everything.</em></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;