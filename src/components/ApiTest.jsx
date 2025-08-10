import React, { useState } from 'react';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5156';

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
      
      let responseData = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      setTestResult({
        success: response.ok,
        status: response.status,
        endpoint: endpoint,
        method: method,
        message: response.ok ? 
          `✅ ${method} ${endpoint} - Success!` : 
          `❌ ${method} ${endpoint} - Failed (${response.status})`,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error) {
      setTestResult({
        success: false,
        endpoint: endpoint,
        method: method,
        message: `❌ ${method} ${endpoint} - Connection failed: ${error.message}`,
        error: error.toString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSwagger = () => {
    window.open(`${apiBaseUrl}/swagger`, '_blank');
  };

  const commonEndpoints = [
    { path: '/api/timeline', method: 'GET', label: 'Timeline' },
    { path: '/api/messages', method: 'GET', label: 'Messages (GET)' },
    { path: '/Timeline', method: 'GET', label: 'Timeline (no api prefix)' },
    { path: '/Messages', method: 'GET', label: 'Messages (no api prefix)' },
    { path: '/api/Timeline', method: 'GET', label: 'Timeline (capital T)' },
    { path: '/api/Messages', method: 'GET', label: 'Messages (capital M)' },
    { path: '/', method: 'GET', label: 'Root endpoint' },
    { path: '/health', method: 'GET', label: 'Health check' },
    { path: '/api', method: 'GET', label: 'API root' }
  ];

  const testMessagePost = () => {
    const testMessage = {
      name: "Test User",
      email: "test@example.com",
      subject: "Connection Test",
      message: "This is a test message to verify the API connection.",
      createdAt: new Date().toISOString()
    };
    
    testEndpoint('/api/messages', 'POST', testMessage);
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      margin: '2rem',
      maxWidth: '800px'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#333' }}>API Connection Debugger</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>API URL:</strong> {apiBaseUrl}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={testSwagger}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '0.5rem'
          }}
        >
          Open Swagger Docs
        </button>
        
        <button 
          onClick={testMessagePost}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Testing...' : 'Test POST Message'}
        </button>
      </div>

      <h3 style={{ marginBottom: '1rem', color: '#333' }}>Test Common Endpoints:</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        {commonEndpoints.map((endpoint, index) => (
          <button
            key={index}
            onClick={() => testEndpoint(endpoint.path, endpoint.method)}
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '0.875rem'
            }}
          >
            {endpoint.label}
          </button>
        ))}
      </div>
      
      {testResult && (
        <div style={{
          padding: '1rem',
          borderRadius: '4px',
          backgroundColor: testResult.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`,
          color: testResult.success ? '#166534' : '#dc2626'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {testResult.message}
          </div>
          
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>Status:</strong> {testResult.status} | 
            <strong> Endpoint:</strong> {testResult.endpoint} | 
            <strong> Method:</strong> {testResult.method}
          </div>
          
          {testResult.error && (
            <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>
              <strong>Error:</strong> {testResult.error}
            </div>
          )}
          
          {testResult.data && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer' }}>View Response Data</summary>
              <pre style={{ 
                background: '#f8f9fa', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {typeof testResult.data === 'string' ? testResult.data : JSON.stringify(testResult.data, null, 2)}
              </pre>
            </details>
          )}
          
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer' }}>View Response Headers</summary>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '0.5rem', 
              borderRadius: '4px',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '150px'
            }}>
              {JSON.stringify(testResult.headers, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ApiTest;