import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context, memory } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: (context || 'You are a helpful AI assistant.') + (memory ? `\n\nPERSISTENT MEMORY:\n${memory}` : ''),
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    // Extract any memory updates from the AI response
    let updatedMemory = memory || '';
    if (aiResponse.includes('[MEMORY:') && aiResponse.includes(']')) {
      const memoryMatch = aiResponse.match(/\[MEMORY:(.*?)\]/s);
      if (memoryMatch) {
        updatedMemory = memoryMatch[1].trim();
      }
    }

    return NextResponse.json({ 
      response: aiResponse.replace(/\[MEMORY:.*?\]/s, '').trim(),
      memory: updatedMemory
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
