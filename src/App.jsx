import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalendarView from './components/CalendarView';
import ContentDisplay from './components/ContentDisplay';
import ContactForm from './components/ContactForm';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5156';

  // Fetch timeline items on component mount
  useEffect(() => {
    fetchTimelineItems();
  }, []);

  // Fetch content when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchContentForDate(selectedDate);
    } else {
      setSelectedContent(null);
    }
  }, [selectedDate]);

  const fetchTimelineItems = async () => {
    try {
      setError(null);
      const response = await fetch(`${apiBaseUrl}/api/timeline`);
      if (response.ok) {
        const items = await response.json();
        // Transform backend data to match frontend expectations
        const transformedItems = items.map(item => ({
          ...item,
          date: item.date.split('T')[0] // Convert "2025-08-10T00:00:00" to "2025-08-10"
        }));
        setTimelineItems(transformedItems);
      } else {
        console.error('Failed to fetch timeline items');
        setError('Failed to load timeline data');
      }
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      setError('Failed to connect to server');
    }
  };

  const fetchContentForDate = async (date) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/timeline/date/${date}`);
      if (response.ok) {
        const content = await response.json();
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
      } else if (response.status === 404) {
        setSelectedContent(null);
      } else {
        console.error('Failed to fetch content for date');
        setSelectedContent(null);
      }
    } catch (error) {
      console.error('Error fetching content for date:', error);
      setSelectedContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // This is the function that gets passed to CalendarView
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
  };

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
                <ContactForm apiBaseUrl={apiBaseUrl} />
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