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
    console.log('🔍 API key present:', !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not found in environment');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Gemini API key not configured' })
      };
    }

    const prompt = `You are searching through a developer's career gap timeline. Analyze the user's query and find relevant timeline entries.

Timeline Data:
${JSON.stringify(timelineItems, null, 2)}

User query: ${query}

Return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON:
{
  "summary": "Brief explanation of what you found",
  "relevantEntries": ["array of timeline entry IDs that match"],
  "keySkills": ["array of skills/technologies mentioned"],
  "confidence": 0.85
}`;

    console.log('🔍 Making Gemini request...');
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        })
      }
    );

    console.log('🔍 Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', errorText);

      const userMessages = {
        503: { error: 'gemini_unavailable', message: "Google's free AI tier is temporarily overloaded. This happens occasionally — please try again in 30–60 seconds." },
        429: { error: 'gemini_rate_limit', message: "Too many requests to Google's free AI tier. Please wait a minute before trying again." },
        400: { error: 'gemini_bad_request', message: 'The search request was invalid. Try rephrasing your query.' },
        401: { error: 'gemini_auth', message: 'AI search is misconfigured. Please contact the site owner.' },
      };

      const userError = userMessages[response.status] || { error: 'gemini_error', message: `AI search is temporarily unavailable (error ${response.status}). Please try again shortly.` };

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(userError)
      };
    }

    const data = await response.json();
    console.log('🔍 Gemini response received');

    const rawText = data.candidates[0].content.parts[0].text;
    const aiResponse = JSON.parse(rawText);

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
