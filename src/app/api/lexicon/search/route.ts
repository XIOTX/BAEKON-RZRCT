import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    // Proxy to the backend server
    const backendUrl = new URL('http://localhost:8787/lexicon/search');
    if (q) backendUrl.searchParams.set('q', q);

    const response = await fetch(backendUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Lexicon API error:', error);
    return NextResponse.json(
      { error: 'Failed to search lexicon' },
      { status: 500 }
    );
  }
}
