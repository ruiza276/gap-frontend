// src/components/AITest.jsx
import React, { useState } from 'react';

const AITest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testAI = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user", 
              content: "Say hello and confirm the API is working!"
            }
          ],
          max_tokens: 50
        })
      });

      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>OpenAI API Test</h3>
      <button onClick={testAI} disabled={loading}>
        {loading ? 'Testing...' : 'Test AI Connection'}
      </button>
      {response && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
          <strong>AI Response:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default AITest;