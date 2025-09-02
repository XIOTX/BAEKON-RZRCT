import { NextRequest, NextResponse } from 'next/server';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message, memory, context } = await request.json();

    // Call actual Claude API with full FL research context
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `${context}

Previous memory: ${memory || 'None'}

User message: ${message}

Please respond as the FL research assistant with full knowledge of the Giselians intelligence, Nodespaces framework, and all FL research methodologies. Maintain the conversational tone and include source citations when relevant.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.content[0].text;

    // Extract any memory updates from the response
    const memoryMatch = assistantResponse.match(/\[MEMORY: ([^\]]+)\]/);
    const updatedMemory = memoryMatch ? `${memory || ''}\n${memoryMatch[1]}`.trim() : memory;

    return NextResponse.json({
      response: assistantResponse.replace(/\[MEMORY: [^\]]+\]/g, '').trim(),
      memory: updatedMemory
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        response: 'Sorry, having trouble connecting to the FL research database right now. The system might be processing other queries. Try again in a moment?',
        memory: memory
      },
      { status: 200 } // Return 200 so the frontend doesn't show an error
    );
  }
}