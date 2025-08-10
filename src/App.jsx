import React, { useState } from 'react';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import ContentDisplay from './components/ContentDisplay';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { useContentData } from './hooks/useContentData';
import { useContactForm } from './hooks/useContactForm';

const GapPortfolio = () => {
  // Content data hook
  const {
    loading: contentLoading,
    error: contentError,
    hasContentForDate,
    fetchContentForDate,
    retry: retryContent
  } = useContentData();

  // Contact form hook
  const {
    contactForm,
    setContactForm,
    setContactError,
    submitting,
    submitSuccess,
    setSubmitSuccess,
    handleContactSubmit,
    error: contactError
  } = useContactForm();

  // Local state
  const [selectedContent, setSelectedContent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateLoading, setDateLoading] = useState(false);

  // Event handlers
  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setDateLoading(true);
    
    try {
      const content = await fetchContentForDate(date);
      setSelectedContent(content);
    } catch (error) {
      console.error('Error loading content for date:', error);
      setSelectedContent(null);
    } finally {
      setDateLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Enhanced Error display component with new styling
  const ErrorDisplay = ({ error, onRetry, type = "content" }) => (
    <div className="card-enhanced">
      <div className="error-message">
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#dc2626' }}>
          Error Loading {type}
        </h3>
        <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>{error}</p>
        <button 
          onClick={onRetry}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Header with enhanced styling */}
        <div className="header-gradient">
          <Header />
        </div>

        {/* Main content area with enhanced styling */}
        <main className="main-content">
          {/* Calendar and Timeline Section */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="text-center mb-8">
              <h2 className="section-title">
                <span className="text-gradient">My Journey Calendar</span>
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: 'var(--gray-600)', 
                maxWidth: '600px', 
                margin: '0 auto',
                marginBottom: '2rem'
              }}>
                Track my daily progress, learning milestones, and project developments during this career transition period
              </p>
            </div>
            
            {contentError ? (
              <ErrorDisplay error={contentError} onRetry={retryContent} type="calendar data" />
            ) : (
              <div className="grid-2">
                <div className="card-enhanced calendar-container">
                  <CalendarView 
                    currentDate={currentDate}
                    navigateMonth={navigateMonth}
                    handleDateClick={handleDateClick}
                    selectedDate={selectedDate}
                    hasContentForDate={hasContentForDate}
                    loading={contentLoading}
                  />
                </div>
                
                <div className="card-enhanced">
                  <ContentDisplay 
                    dateLoading={dateLoading}
                    selectedDate={selectedDate}
                    selectedContent={selectedContent}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Contact Section with enhanced styling */}
          {contactError ? (
            <ErrorDisplay error={contactError} onRetry={() => setContactError(null)} type="contact form" />
          ) : (
            <div className="card-enhanced">
              <ContactSection 
                contactForm={contactForm}
                setContactForm={setContactForm}
                submitting={submitting}
                submitSuccess={submitSuccess}
                setSubmitSuccess={setSubmitSuccess}
                handleContactSubmit={handleContactSubmit}
              />
            </div>
          )}

          {/* Stats section */}
          <div className="grid-3" style={{ marginTop: '4rem' }}>
            <div className="card-enhanced text-center p-6">
              <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                ∞
              </div>
              <div style={{ color: 'var(--gray-600)', fontWeight: '500', marginBottom: '0.25rem' }}>
                Learning Continues
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                Every day brings new knowledge
              </p>
            </div>
            
            <div className="card-enhanced text-center p-6">
              <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {Math.ceil((new Date() - new Date(2024, 0, 1)) / (1000 * 60 * 60 * 24))}
              </div>
              <div style={{ color: 'var(--gray-600)', fontWeight: '500', marginBottom: '0.25rem' }}>
                Days of Growth
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                Since starting this journey
              </p>
            </div>
            
            <div className="card-enhanced text-center p-6">
              <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                100%
              </div>
              <div style={{ color: 'var(--gray-600)', fontWeight: '500', marginBottom: '0.25rem' }}>
                Commitment
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                To continuous improvement
              </p>
            </div>
          </div>
        </main>

        {/* Footer with enhanced styling */}
        <div className="footer-enhanced">
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GapPortfolio;