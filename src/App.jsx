import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalendarView from './components/CalendarView';
import ContentDisplay from './components/ContentDisplay';
import ContactForm from './components/ContactForm';
import ErrorBoundary from './components/ErrorBoundary';
import { apiService } from './services/apiService';
import AITimelineSearch from './components/AITimelineSearch';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Development monitoring and optimization tracking
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const logStats = () => {
        const stats = apiService.getStats();
        console.log('📊 API Usage Stats:', stats);
      };
      logStats();
      const interval = setInterval(logStats, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Fetch timeline items on component mount
  useEffect(() => {
    fetchTimelineItems();
  }, []);

  const fetchTimelineItems = async () => {
    try {
      setError(null);
      const items = await apiService.getTimeline();
      const transformedItems = items.map(item => ({
        ...item,
        date: item.date.split('T')[0]
      }));
      setTimelineItems(transformedItems);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      setError('Failed to connect to server');
      setTimelineItems([]);
    }
  };

  const fetchContentForDate = async (date) => {
    setIsLoading(true);
    try {
      const content = await apiService.getTimelineForDate(date);
      const transformedContent = {
        ...content,
        date: content.date.split('T')[0],
        files: content.fileUrl ? [{
          url: content.fileUrl,
          fileName: content.fileName,
          contentType: content.fileType === 'image' ? 'image/jpeg' : 'text/plain'
        }] : []
      };
      setSelectedContent(transformedContent);
    } catch (error) {
      if (error.message.includes('404')) {
        setSelectedContent(null);
      } else {
        console.error('Error fetching content for date:', error);
        setSelectedContent(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const timeoutId = setTimeout(() => {
        fetchContentForDate(selectedDate);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSelectedContent(null);
    }
  }, [selectedDate]);

  const handleDateSelect = useCallback((dateString) => {
    setSelectedDate(dateString);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Header />
        
        <main className="app-main">
          {error ? (
            <div className="alert alert-error" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
              <div className="alert-icon">⚠</div>
              <div>
                <strong>Connection Error</strong>
                <p>{error}</p>
                <button
                  onClick={fetchTimelineItems}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* AI Search Section - Full Width Above Everything */}
              <div className="ai-search-section" style={{ 
                marginBottom: 'var(--tech-space-8)',
                maxWidth: '1200px',
                margin: '0 auto var(--tech-space-8) auto'
              }}>
                <AITimelineSearch />
              </div>

              {/* Main Content Grid - Calendar + Content */}
              <div className="app-content">
                <div className="calendar-section">
                  <CalendarView
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                    timelineItems={timelineItems}
                  />
                </div>

                <div className="content-section">
                  <ContentDisplay
                    content={selectedContent}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-section-wrapper" style={{ marginTop: '4rem' }}>
                <ContactForm />
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;