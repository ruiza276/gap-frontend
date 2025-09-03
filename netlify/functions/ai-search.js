// netlify/functions/ai-search.js
exports.handler = async (event, context) => {
  console.log('🔍 Function called with method:', event.httpMethod);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🔍 Parsing request body...');
    const { query, timelineItems } = JSON.parse(event.body);

    if (!query || !timelineItems) {
      console.error('❌ Missing query or timeline data');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing query or timeline data' })
      };
    }

    console.log('🔍 Query:', query);
    console.log('🔍 Timeline items count:', timelineItems.length);
    console.log('🔍 API key present:', !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found in environment');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' })
      };
    }

    console.log('🔍 Making OpenAI request...');
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
            role: "system",
            content: `You are searching through a developer's career gap timeline. Analyze the user's query and find relevant timeline entries.

Timeline Data:
${JSON.stringify(timelineItems, null, 2)}

Return a JSON response with:
{
  "summary": "Brief explanation of what you found",
  "relevantEntries": [array of timeline entry IDs that match],
  "keySkills": [array of skills/technologies mentioned],
  "confidence": 0.85
}`
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    console.log('🔍 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `OpenAI API error: ${response.status}` })
      };
    }

    const data = await response.json();
    console.log('🔍 OpenAI response received');
    
    const aiResponse = JSON.parse(data.choices[0].message.content);

    // Filter actual timeline entries that match
    const matchingEntries = timelineItems.filter(item =>
      aiResponse.relevantEntries && aiResponse.relevantEntries.includes(item.id)
    );

    console.log('✅ Function completed successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query: query,
        summary: aiResponse.summary,
        entries: matchingEntries,
        skills: aiResponse.keySkills || [],
        confidence: aiResponse.confidence || 0.5
      })
    };

  } catch (error) {
    console.error('❌ Function error:', error);
    console.error('❌ Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Search temporarily unavailable',
        details: error.message 
      })
    };
  }
};