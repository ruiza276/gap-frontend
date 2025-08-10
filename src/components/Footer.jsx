import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const techStack = [
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: '.NET Core', icon: '🔷', color: '#512BD4' },
    { name: 'Azure', icon: '☁️', color: '#0078D4' },
    { name: 'Cosmos DB', icon: '🌐', color: '#0078D4' }
  ];

  const portfolioLinks = [
    { 
      name: 'Main Portfolio', 
      url: 'https://alexruiz.dev', 
      icon: '🌟',
      description: 'Complete portfolio & projects'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/alex-r-6205b113b/', 
      icon: '💼',
      description: 'Professional background'
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com/ruiza276', 
      icon: '⚡',
      description: 'Code repositories'
    },
    { 
      name: 'Email', 
      url: 'mailto:ruizaa276@gmail.com', 
      icon: '✉️',
      description: 'Get in touch directly'
    }
  ];

  return (
    <footer className="enhanced-footer">
      <div className="footer-background">
        <div className="grid-pattern"></div>
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section with Animation */}
          <div className="footer-brand">
            <div className="brand-logo">
              <h3 className="footer-logo">Gap<span className="logo-highlight">In</span>My<span className="logo-highlight">Resume</span>.dev</h3>
              <div className="logo-underline"></div>
            </div>
            <p className="footer-tagline">
              Bridging the gaps between experiences and opportunities, 
              one documented day at a time.
            </p>
            <div className="footer-status">
              <div className="status-indicator">
                <div className="status-pulse">
                  <div className="pulse-ring"></div>
                  <div className="status-dot online"></div>
                </div>
                <span>Available for opportunities</span>
              </div>
            </div>
          </div>

          {/* Tech Stack with Hover Effects */}
          <div className="footer-section">
            <h4 className="section-title">
              <span className="title-icon">🛠️</span>
              Built With
            </h4>
            <div className="tech-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-card">
                  <span className="tech-icon" style={{ '--tech-color': tech.color }}>
                    {tech.icon}
                  </span>
                  <span className="tech-name">{tech.name}</span>
                  <div className="tech-glow" style={{ '--glow-color': tech.color }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="footer-section">
            <h4 className="section-title">
              <span className="title-icon">🔗</span>
              Connect & Explore
            </h4>
            <div className="portfolio-grid">
              {portfolioLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <div className="link-content">
                    <span className="link-icon">{link.icon}</span>
                    <div className="link-text">
                      <span className="link-name">{link.name}</span>
                      <span className="link-description">{link.description}</span>
                    </div>
                  </div>
                  <div className="link-arrow">→</div>
                  <div className="link-glow"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <div className="copyright">
              <span>© {currentYear} GapInMyResume.dev</span>
              <div className="copyright-accent"></div>
            </div>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-text">Daily Updates</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-text">v2.0 Aug 2025</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <span className="stat-text">Always Growing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;