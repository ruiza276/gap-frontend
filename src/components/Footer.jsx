import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const techStack = [
    { 
      name: 'React 18', 
      category: 'Frontend',
      icon: '⚛️',
      color: '#61DAFB',
      description: 'Modern UI framework'
    },
    { 
      name: '.NET Core', 
      category: 'Backend',
      icon: '🔷',
      color: '#512BD4',
      description: 'Enterprise API platform'
    },
    { 
      name: 'Azure Cloud', 
      category: 'Infrastructure',
      icon: '☁️',
      color: '#0078D4',
      description: 'Scalable cloud services'
    },
    { 
      name: 'Cosmos DB', 
      category: 'Database',
      icon: '🌐',
      color: '#0078D4',
      description: 'NoSQL at scale'
    }
  ];

  const portfolioLinks = [
    { 
      name: 'Main Portfolio', 
      url: 'https://alexruiz.dev', 
      icon: '🎯',
      description: 'Original portfolio site',
      type: 'primary'
    },
    { 
      name: 'LinkedIn Profile', 
      url: 'https://www.linkedin.com/in/alex-r-6205b113b/', 
      icon: '💼',
      description: 'Professional social media profile',
      type: 'secondary'
    },
    { 
      name: 'GitHub Repositories', 
      url: 'https://github.com/ruiza276', 
      icon: '💻',
      description: 'Where my code lives',
      type: 'secondary'
    },
    { 
      name: 'Direct Contact', 
      url: 'mailto:ruizaa276@gmail.com', 
      icon: '📧',
      description: 'Send me an email!',
      type: 'secondary'
    }
  ];

  return (
    <footer className="tech-footer">
      <div className="tech-footer-background">
        <div className="footer-grid-pattern"></div>
        <div className="footer-accent-lines">
          <div className="footer-line footer-line-1"></div>
          <div className="footer-line footer-line-2"></div>
        </div>
      </div>
      
      <div className="tech-footer-container">
        <div className="tech-footer-content">
          
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-brand-logo">
              <h3 className="footer-logo-text">
                Gap<span className="footer-logo-accent">In</span>My<span className="footer-logo-accent">Resume</span>
                <span className="footer-logo-domain">.dev</span>
              </h3>
              <div className="footer-brand-line"></div>
            </div>
            
            <p className="footer-mission">
              Ocean Vuong once wrote,
              <br />
              <span className="footer-highlight">"loneliness is still time spent. with the world"</span>
              <br />
              And being being unemployed is still time spent with the world
            </p>
            
            <div className="footer-status-indicator">
              <div className="footer-status-badge">
                <div className="footer-status-dot"></div>
                <span className="footer-status-text">Actively developing • Last updated today</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <span className="section-icon">⚙️</span>
              Technology Stack
            </h4>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-stack-item">
                  <div className="tech-item-header">
                    <span 
                      className="tech-item-icon" 
                      style={{ '--tech-color': tech.color }}
                    >
                      {tech.icon}
                    </span>
                    <div className="tech-item-info">
                      <span className="tech-item-name">{tech.name}</span>
                      <span className="tech-item-category">{tech.category}</span>
                    </div>
                  </div>
                  <p className="tech-item-description">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <span className="section-icon">🔗</span>
              Professional Links
            </h4>
            <div className="portfolio-links-grid">
              {portfolioLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`portfolio-link-item ${link.type}`}
                >
                  <div className="portfolio-link-content">
                    <span className="portfolio-link-icon">{link.icon}</span>
                    <div className="portfolio-link-info">
                      <span className="portfolio-link-name">{link.name}</span>
                      <span className="portfolio-link-description">{link.description}</span>
                    </div>
                  </div>
                  <div className="portfolio-link-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="tech-footer-bottom">
          <div className="footer-divider-line"></div>
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <span>© {currentYear} GapInMyResume.dev</span>
              <span className="copyright-separator">•</span>
              <span className="footer-version">v2.1.0</span>
            </div>
            
            <div className="footer-metrics">
              <div className="metric-item">
                <span className="metric-icon">📊</span>
                <span className="metric-text">Real-time tracking</span>
              </div>
              <span className="metric-separator">•</span>
              <div className="metric-item">
                <span className="metric-icon">🚀</span>
                <span className="metric-text">Continuous deployment</span>
              </div>
              <span className="metric-separator">•</span>
              <div className="metric-item">
                <span className="metric-icon">🔒</span>
                <span className="metric-text">Enterprise security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;