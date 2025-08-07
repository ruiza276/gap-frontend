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

  // Error display component
  const ErrorDisplay = ({ error, onRetry, type = "content" }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 text-xl mb-2">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading {type}</h3>
      <p className="text-red-700 mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Calendar and Timeline Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Journey Calendar</h2>
            
            {contentError ? (
              <ErrorDisplay error={contentError} onRetry={retryContent} type="calendar data" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CalendarView 
                  currentDate={currentDate}
                  navigateMonth={navigateMonth}
                  handleDateClick={handleDateClick}
                  selectedDate={selectedDate}
                  hasContentForDate={hasContentForDate}
                  loading={contentLoading}
                />
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <ContentDisplay 
                    dateLoading={dateLoading}
                    selectedDate={selectedDate}
                    selectedContent={selectedContent}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Contact Section */}
          {contactError ? (
            <ErrorDisplay error={contactError} onRetry={() => setContactError(null)} type="contact form" />
          ) : (
            <ContactSection 
              contactForm={contactForm}
              setContactForm={setContactForm}
              submitting={submitting}
              submitSuccess={submitSuccess}
              setSubmitSuccess={setSubmitSuccess}
              handleContactSubmit={handleContactSubmit}
            />
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default GapPortfolio;