import { useState, useEffect, useCallback } from 'react';
import { mockContent } from '../data/mockContent';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-api.azurewebsites.net/api';

export const useContentData = () => {
  const [contentCache, setContentCache] = useState({});
  const [availableDates, setAvailableDates] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize available dates from cache or API
  useEffect(() => {
    loadAvailableDates();
  }, []);

  /**
   * Load all available dates that have content
   */
  const loadAvailableDates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/content/dates`);
      // if (!response.ok) throw new Error('Failed to fetch available dates');
      // const dates = await response.json();
      
      // For now, use mock data
      const dates = Object.keys(mockContent);
      setAvailableDates(new Set(dates));
    } catch (err) {
      console.error('Error loading available dates:', err);
      setError(err.message);
      // Fallback to mock data on error
      setAvailableDates(new Set(Object.keys(mockContent)));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if a specific date has content available
   */
  const hasContentForDate = useCallback((date) => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return availableDates.has(dateString);
  }, [availableDates]);

  /**
   * Fetch content for a specific date
   */
  const fetchContentForDate = useCallback(async (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Return cached content if available
    if (contentCache[dateString]) {
      return contentCache[dateString];
    }

    try {
      setLoading(true);
      setError(null);

      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/content/${dateString}`);
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     return null; // No content for this date
      //   }
      //   throw new Error(`Failed to fetch content: ${response.statusText}`);
      // }
      // const content = await response.json();

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const content = mockContent[dateString] || null;

      // Cache the result
      setContentCache(prev => ({
        ...prev,
        [dateString]: content
      }));

      return content;
    } catch (err) {
      console.error('Error fetching content for date:', dateString, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contentCache]);

  /**
   * Get all content for a date range (useful for timeline views)
   */
  const fetchContentRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const start = new Date(startDate).toISOString().split('T')[0];
      const end = new Date(endDate).toISOString().split('T')[0];

      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/content/range?start=${start}&end=${end}`);
      // if (!response.ok) throw new Error('Failed to fetch content range');
      // const content = await response.json();

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      const content = Object.entries(mockContent)
        .filter(([date]) => date >= start && date <= end)
        .reduce((acc, [date, item]) => {
          acc[date] = item;
          return acc;
        }, {});

      // Update cache with fetched content
      setContentCache(prev => ({
        ...prev,
        ...content
      }));

      return content;
    } catch (err) {
      console.error('Error fetching content range:', err);
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload new content for a specific date
   */
  const uploadContent = useCallback(async (date, contentData) => {
    const dateString = date.toISOString().split('T')[0];
    
    try {
      setLoading(true);
      setError(null);

      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append('date', dateString);
      formData.append('title', contentData.title);
      formData.append('content', contentData.content);
      formData.append('type', contentData.type);
      formData.append('tags', JSON.stringify(contentData.tags));
      
      if (contentData.file) {
        formData.append('file', contentData.file);
      }

      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/content`, {
      //   method: 'POST',
      //   body: formData
      // });
      // if (!response.ok) throw new Error('Failed to upload content');
      // const savedContent = await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const savedContent = {
        id: Date.now(),
        date: dateString,
        ...contentData,
        imageUrl: contentData.file ? URL.createObjectURL(contentData.file) : undefined
      };

      // Update cache and available dates
      setContentCache(prev => ({
        ...prev,
        [dateString]: savedContent
      }));
      setAvailableDates(prev => new Set([...prev, dateString]));

      return savedContent;
    } catch (err) {
      console.error('Error uploading content:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete content for a specific date
   */
  const deleteContent = useCallback(async (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    try {
      setLoading(true);
      setError(null);

      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/content/${dateString}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete content');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update cache and available dates
      setContentCache(prev => {
        const updated = { ...prev };
        delete updated[dateString];
        return updated;
      });
      setAvailableDates(prev => {
        const updated = new Set(prev);
        updated.delete(dateString);
        return updated;
      });

      return true;
    } catch (err) {
      console.error('Error deleting content:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all cached data (useful for logout or refresh)
   */
  const clearCache = useCallback(() => {
    setContentCache({});
    setAvailableDates(new Set());
    setError(null);
  }, []);

  /**
   * Retry failed operations
   */
  const retry = useCallback(() => {
    setError(null);
    loadAvailableDates();
  }, [loadAvailableDates]);

  return {
    // State
    loading,
    error,
    availableDates: Array.from(availableDates),
    contentCache,

    // Methods
    hasContentForDate,
    fetchContentForDate,
    fetchContentRange,
    uploadContent,
    deleteContent,
    clearCache,
    retry,
    
    // Utility
    refreshAvailableDates: loadAvailableDates
  };
};