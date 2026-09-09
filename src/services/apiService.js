import { apiCache } from './apiCache';

class ApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5156';
    this.requestCount = 0;

    // AI search routes through a Netlify Function — no API key needed in the browser
  }

  // Optimized fetch with caching and debouncing
  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = apiCache.generateKey(url, options);

    // Check cache first (for GET requests)
    if (options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cached = apiCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Increment request counter for monitoring
    this.requestCount++;
    console.log(`API Request #${this.requestCount}: ${options.method || 'GET'} ${endpoint}`);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        // Different TTL for different endpoints
        const ttl = this.getTTL(endpoint);
        apiCache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Determine cache TTL based on endpoint
  getTTL(endpoint) {
    if (endpoint.includes('/timeline')) return 5; // 5 minutes for timeline data
    if (endpoint.includes('/messages')) return 2; // 2 minutes for messages
    return 3; // Default 3 minutes
  }

  // Timeline API methods
  async getTimeline() {
    return this.fetch('/api/timeline');
  }

  async getTimelineForDate(date) {
    return this.fetch(`/api/timeline/date/${date}`);
  }

  async createTimelineEntry(data) {
    return this.fetch('/api/timeline', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Messages API methods
  async getMessages() {
    return this.fetch('/api/messages');
  }

  async sendMessage(messageData) {
    // No caching for POST requests
    return this.fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        ...messageData,
        createdAt: new Date().toISOString()
      })
    });
  }

  // File upload with progress tracking
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      xhr.open('POST', `${this.baseUrl}/api/files`);
      xhr.send(formData);
    });
  }

  // Clear cache and reset counters
  reset() {
    apiCache.clear();
    this.requestCount = 0;
  }

  // Get usage statistics
  getStats() {
    return {
      requestCount: this.requestCount,
      cache: apiCache.getStats()
    };
  }

  // AI search via Netlify Function (server-side) — works in both local (netlify dev) and production
  async searchTimelineWithAI(query) {
    let timelineItems = []; // Declare outside try block so it's accessible in catch

    try {
      // Get all timeline items first
      timelineItems = await this.getTimeline();

      const response = await fetch('/.netlify/functions/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          timelineItems: timelineItems
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Function error: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('AI Search Error:', error);
      
      // Fallback: Basic text search (timelineItems is now accessible here)
      console.log('🔄 Using fallback text search');
      const basicMatches = timelineItems.filter(item => 
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.content?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        query: query,
        summary: `Found ${basicMatches.length} entries with basic text matching for "${query}". AI search temporarily unavailable.`,
        entries: basicMatches.slice(0, 5),
        skills: [],
        confidence: 0.5
      };
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Request debouncing helper
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};