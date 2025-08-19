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

  // Helper function to transform timeline item to content format
  const transformTimelineItemToContent = useCallback((timelineItem) => {
    return {
      id: timelineItem.id,
      date: timelineItem.date,
      title: timelineItem.title || 'Timeline Entry',
      description: timelineItem.description || timelineItem.content || 'No description available',
      category: timelineItem.category || 'timeline',
      files: timelineItem.files || [],
      tags: timelineItem.tags || [],
      source: 'timeline-item'
    };
  }, []);

  // Fetch content for a specific date - wrapped in useCallback for stable reference
  const fetchContentForDate = useCallback(async (date) => {
    console.log('🔍 Fetching content for date:', date);
    setIsLoading(true);
    
    try {
      const content = await apiService.getTimelineForDate(date);
      console.log('📄 Raw content received:', content);
      
      if (content) {
        const transformedContent = {
          ...content,
          date: content.date.split('T')[0],
          files: content.fileUrl ? [{
            url: content.fileUrl,
            fileName: content.fileName,
            contentType: content.fileType === 'image' ? 'image/jpeg' : 'text/plain'
          }] : []
        };
        console.log('✅ Transformed content:', transformedContent);
        setSelectedContent(transformedContent);
      } else {
        console.log('❌ No content found for date, checking timeline items...');
        // Try to find matching timeline item as fallback
        const timelineItem = timelineItems.find(item => item.date === date);
        if (timelineItem) {
          console.log('🔄 Using timeline item as content:', timelineItem);
          setSelectedContent(transformTimelineItemToContent(timelineItem));
        } else {
          console.log('❌ No timeline item found either');
          setSelectedContent(null);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching content for date:', date, error);
      
      // Fallback to timeline item if API fails
      const timelineItem = timelineItems.find(item => item.date === date);
      if (timelineItem) {
        console.log('🔄 Using timeline item as fallback:', timelineItem);
        setSelectedContent(transformTimelineItemToContent(timelineItem));
      } else {
        setSelectedContent(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [timelineItems, transformTimelineItemToContent]);

  // Fetch timeline items on component mount
  const fetchTimelineItems = useCallback(async () => {
    try {
      setError(null);
      const items = await apiService.getTimeline();
      const transformedItems = items.map(item => ({
        ...item,
        date: item.date.split('T')[0]
      }));
      setTimelineItems(transformedItems);
      console.log('📅 Timeline items loaded:', transformedItems);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      setError('Failed to connect to server');
      setTimelineItems([]);
    }
  }, []);

  useEffect(() => {
    fetchTimelineItems();
  }, [fetchTimelineItems]);

  useEffect(() => {
    if (selectedDate) {
      console.log('📅 Selected date changed to:', selectedDate);
      const timeoutId = setTimeout(() => {
        fetchContentForDate(selectedDate);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      console.log('📅 No date selected, clearing content');
      setSelectedContent(null);
    }
  }, [selectedDate, fetchContentForDate]);

  const handleDateSelect = useCallback((dateString) => {
    console.log('🎯 Date selected via calendar:', dateString);
    setSelectedDate(dateString);
    
    // Add visual feedback on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const calendarDay = document.querySelector('.calendar-day.selected');
        if (calendarDay) {
          calendarDay.style.animation = 'pulse 0.5s ease-in-out';
        }
      }, 100);
    }
  }, []);

  // Handle AI search result clicks - this will make content show in ContentDisplay
  const handleAISearchResultClick = useCallback((searchResultEntry) => {
    console.log('🤖 AI Search result clicked:', searchResultEntry);
    
    if (!searchResultEntry || !searchResultEntry.date) {
      console.error('❌ Invalid search result entry:', searchResultEntry);
      return;
    }

    const dateString = searchResultEntry.date.split('T')[0];
    console.log('📅 Extracted date:', dateString);

    // Transform search result to content format and display immediately
    const searchContent = {
      id: searchResultEntry.id,
      date: dateString,
      title: searchResultEntry.title || 'AI Search Result',
      description: searchResultEntry.description || searchResultEntry.content || 'Content from AI search',
      category: searchResultEntry.category || 'search-result',
      files: searchResultEntry.files || [],
      tags: searchResultEntry.tags || [],
      source: 'ai-search'
    };

    console.log('📄 Setting search content directly:', searchContent);
    
    // Set the content immediately
    setSelectedContent(searchContent);
    setSelectedDate(dateString);
    
    // Scroll to content area on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const contentSection = document.querySelector('.content-section');
        if (contentSection) {
          contentSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, []);

  // Handle AI search results
  const handleAISearchResults = useCallback((results) => {
    console.log('🔍 AI Search completed with results:', results);
    
    if (results.entries && results.entries.length > 0) {
      const matchingDates = results.entries.map(entry => {
        const dateString = entry.date.split('T')[0];
        console.log('📅 Found matching entry:', {
          id: entry.id,
          date: dateString,
          title: entry.title,
          hasTimelineMatch: timelineItems.some(item => item.date === dateString)
        });
        return dateString;
      });
      console.log('📊 All matching dates:', matchingDates);
    }
  }, [timelineItems]);

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
              {/* Debug info in development */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{
                  position: 'fixed',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '12px',
                  zIndex: 9999,
                  maxWidth: '300px'
                }}>
                  <div>Selected Date: {selectedDate || 'None'}</div>
                  <div>Timeline Items: {timelineItems.length}</div>
                  <div>Content Loading: {isLoading ? 'Yes' : 'No'}</div>
                  <div>Has Content: {selectedContent ? 'Yes' : 'No'}</div>
                  <div>Content Source: {selectedContent?.source || 'None'}</div>
                </div>
              )}

              {/* AI Search Section */}
              <div className="ai-search-section" style={{ 
                marginBottom: 'var(--tech-space-8)',
                maxWidth: '1200px',
                margin: '0 auto var(--tech-space-8) auto'
              }}>
                <AITimelineSearch 
                  onResultsFound={handleAISearchResults}
                  onDateSelect={handleAISearchResultClick}
                />
              </div>

              {/* Main Content Grid */}
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
                  
                  {/* Enhanced feedback for different content sources */}
                  {selectedContent && (
                    <div style={{
                      marginTop: 'var(--tech-space-4)',
                      padding: 'var(--tech-space-3)',
                      background: selectedContent.source === 'ai-search' 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))'
                        : 'var(--tech-bg-tertiary)',
                      borderRadius: 'var(--tech-radius-md)',
                      border: '1px solid var(--tech-border)',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--tech-text-secondary)'
                    }}>
                      {selectedContent.source === 'ai-search' ? (
                        <>
                          🤖 <strong>Found via AI search!</strong> Use the calendar to explore more dates.
                        </>
                      ) : (
                        <>
                          ✅ Timeline content for {selectedDate}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Debug content info in development */}
                  {process.env.NODE_ENV === 'development' && selectedContent && (
                    <details style={{
                      marginTop: 'var(--tech-space-4)',
                      padding: 'var(--tech-space-3)',
                      background: 'var(--tech-bg-secondary)',
                      borderRadius: 'var(--tech-radius-md)',
                      fontSize: '0.75rem'
                    }}>
                      <summary>Debug: Content Data</summary>
                      <pre style={{ 
                        marginTop: '10px',
                        background: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}>
                        {JSON.stringify(selectedContent, null, 2)}
                      </pre>
                    </details>
                  )}
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