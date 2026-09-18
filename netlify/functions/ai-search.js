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

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { query, timelineItems } = JSON.parse(event.body);

    if (!query || !timelineItems) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing query or timeline data' }) };
    }

    console.log('🔍 Query:', query);
    console.log('🔍 Timeline items count:', timelineItems.length);
    console.log('🔍 API key present:', !!process.env.ANTHROPIC_API_KEY);

    if (!process.env.ANTHROPIC_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    // Trim to only what Claude needs — keeps the request fast and within limits
    const trimmedItems = timelineItems.map(({ id, title, date, description }) => ({
      id,
      title,
      date,
      description: description ? description.substring(0, 200) : ''
    }));

    console.log('🔍 Making Claude request...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: 'You are searching through a developer\'s career gap timeline. Analyze the query and find relevant entries using the search_results tool.',
        tools: [
          {
            name: 'search_results',
            description: 'Return the results of searching the timeline',
            input_schema: {
              type: 'object',
              properties: {
                summary: {
                  type: 'string',
                  description: 'Brief explanation of what was found'
                },
                relevantEntries: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Array of timeline entry IDs that match the query'
                },
                keySkills: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Skills or topics mentioned in the matching entries'
                },
                confidence: {
                  type: 'number',
                  description: 'Confidence score between 0 and 1'
                }
              },
              required: ['summary', 'relevantEntries', 'keySkills', 'confidence']
            }
          }
        ],
        tool_choice: { type: 'tool', name: 'search_results' },
        messages: [
          {
            role: 'user',
            content: `Timeline Data:
${JSON.stringify(trimmedItems, null, 2)}

Search query: ${query}`
          }
        ]
      })
    });

    console.log('🔍 Claude response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error:', errorText);

      const userMessages = {
        529: { error: 'claude_overloaded', message: 'AI search is temporarily overloaded. Please try again in 30 seconds.' },
        429: { error: 'claude_rate_limit', message: 'Too many requests. Please wait a moment and try again.' },
        401: { error: 'claude_auth', message: 'AI search is misconfigured. Please contact the site owner.' },
      };

      const userError = userMessages[response.status] || { error: 'claude_error', message: `AI search is temporarily unavailable (error ${response.status}). Please try again shortly.` };

      return { statusCode: response.status, headers, body: JSON.stringify(userError) };
    }

    const data = await response.json();
    console.log('🔍 Claude response received');

    const aiResponse = data.content[0].input;

    const matchingEntries = timelineItems.filter(item =>
      aiResponse.relevantEntries && aiResponse.relevantEntries.includes(item.id)
    );

    console.log('✅ Function completed successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query,
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
