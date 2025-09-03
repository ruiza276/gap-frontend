// netlify/functions/ai-search.js
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query, timelineItems } = JSON.parse(event.body);

    if (!query || !timelineItems) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing query or timeline data' })
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // No REACT_APP_ prefix!
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    // Filter actual timeline entries that match
    const matchingEntries = timelineItems.filter(item =>
      aiResponse.relevantEntries.includes(item.id)
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Configure this properly for production
      },
      body: JSON.stringify({
        query: query,
        summary: aiResponse.summary,
        entries: matchingEntries,
        skills: aiResponse.keySkills,
        confidence: aiResponse.confidence
      })
    };

  } catch (error) {
    console.error('AI Search Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Search temporarily unavailable' })
    };
  }
};