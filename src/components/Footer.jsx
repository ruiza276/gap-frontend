import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const techStack = [
    { name: 'React', icon: '⚛️' },
    { name: '.NET Core', icon: '🔷' },
    { name: 'Azure', icon: '☁️' },
    { name: 'Cosmos DB', icon: '🌐' }
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/alex-r-6205b113b/', 
      icon: '💼' 
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com/ruiza276', 
      icon: '🐙' 
    },
    { 
      name: 'Email', 
      url: 'ruizaa276@gmail.com', 
      icon: '✉️' 
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">GapInMyResume.dev</h3>
            <p className="footer-tagline">
              Bridging the gaps between experiences and opportunities
            </p>
            <div className="footer-status">
              <div className="status-indicator">
                <div className="status-dot online"></div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Built With</h4>
            <div className="tech-stack">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-item">
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

{/*           Quick Links Section
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <div className="footer-links">
              <a href="#timeline" className="footer-link">Timeline</a>
              <a href="#about" className="footer-link">About</a>
              <a href="#contact" className="footer-link">Contact</a>
              <a href="#projects" className="footer-link">Projects</a>
            </div>
          </div> */}

          {/* Social Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Connect</h4>
            <div className="footer-social">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={link.name}
                >
                  <span className="social-icon">{link.icon}</span>
                  <span className="social-name">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <span>© {currentYear} GapInMyResume.dev. All rights reserved.</span>
            </div>
            <div className="footer-meta">
              <span className="version">v2.0</span>
              <span className="divider">•</span>
              <span className="last-updated">Updated Aug 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;