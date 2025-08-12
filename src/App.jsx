// =====================================
// src/App.jsx - Fixed useCallback warnings
// =====================================
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalendarView from './components/CalendarView';
import ContentDisplay from './components/ContentDisplay';
import ContactForm from './components/ContactForm';
import ErrorBoundary from './components/ErrorBoundary';
import { apiService, debounce } from './services/apiService';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  // Development monitoring and optimization tracking
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log API usage statistics every 30 seconds
      const logStats = () => {
        const stats = apiService.getStats();
        console.log('📊 API Usage Stats:', stats);
      };

      // Initial log
      logStats();
      
      // Set up interval
      const interval = setInterval(logStats, 30000);
      
      // Cleanup
      return () => clearInterval(interval);
    }
  }, []);

  // Fetch timeline items on component mount
  useEffect(() => {
    fetchTimelineItems();
  }, []); // Empty dependency array is intentional

  // Define fetchContentForDate first
  const fetchContentForDate = useCallback(async (date) => {
    setIsLoading(true);
    try {
      // Use optimized API service with caching
      const content = await apiService.getTimelineForDate(date);
      
      // Transform backend data to match ContentDisplay expectations
      const transformedContent = {
        ...content,
        date: content.date.split('T')[0],
        // Transform file data if it exists
        files: content.fileUrl ? [{
          url: content.fileUrl,
          fileName: content.fileName,
          contentType: content.fileType === 'image' ? 'image/jpeg' : 'text/plain'
        }] : []
      };
      setSelectedContent(transformedContent);
    } catch (error) {
      if (error.message.includes('404')) {
        // No content for this date
        setSelectedContent(null);
      } else {
        console.error('Error fetching content for date:', error);
        setSelectedContent(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed for this function

  // Debounced content fetching
  const debouncedFetchContent = useCallback(
    debounce((date) => {
      fetchContentForDate(date);
    }, 300),
    [fetchContentForDate] // Now fetchContentForDate is a known dependency
  );

  // Fetch content when selected date changes
  useEffect(() => {
    if (selectedDate) {
      debouncedFetchContent(selectedDate);
    } else {
      setSelectedContent(null);
    }
  }, [selectedDate, debouncedFetchContent]);

  const fetchTimelineItems = async () => {
    try {
      setError(null);
      // Use optimized API service with caching
      const items = await apiService.getTimeline();
      
      // Transform backend data to match frontend expectations
      const transformedItems = items.map(item => ({
        ...item,
        date: item.date.split('T')[0] // Convert "2025-08-10T00:00:00" to "2025-08-10"
      }));
      setTimelineItems(transformedItems);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      setError('Failed to connect to server');
      
      // Fallback to empty array to prevent UI breakage
      setTimelineItems([]);
    }
  };

  // This is the function that gets passed to CalendarView
  const handleDateSelect = useCallback((dateString) => {
    setSelectedDate(dateString);
  }, []); // No dependencies needed

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
