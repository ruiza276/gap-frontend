// API response caching service for Azure free tier optimization
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  // Generate cache key from URL and params
  generateKey(url, options = {}) {
    const { method = 'GET', body } = options;
    const bodyHash = body ? btoa(JSON.stringify(body)) : '';
    return `${method}:${url}:${bodyHash}`;
  }

  // Set cache with TTL (time to live)
  set(key, data, ttlMinutes = 5) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + (ttlMinutes * 60 * 1000));
    
    // Log cache set for monitoring
    console.log(`Cache SET: ${key} (TTL: ${ttlMinutes}min)`);
  }

  // Get from cache if not expired
  get(key) {
    const timestamp = this.timestamps.get(key);
    
    if (!timestamp || Date.now() > timestamp) {
      // Expired, remove from cache
      this.cache.delete(key);
      this.timestamps.delete(key);
      console.log(`Cache MISS: ${key} (expired)`);
      return null;
    }

    const data = this.cache.get(key);
    console.log(`Cache HIT: ${key}`);
    return data;
  }

  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    console.log('Cache cleared');
  }

  // Get cache stats
  getStats() {
    this.cleanup();
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const apiCache = new ApiCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);