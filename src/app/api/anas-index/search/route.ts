import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const fields = searchParams.get('fields') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    // Proxy to the backend server
    const backendUrl = new URL('http://localhost:8787/anas-index/search');
    if (q) backendUrl.searchParams.set('q', q);
    if (fields) backendUrl.searchParams.set('fields', fields);
    if (from) backendUrl.searchParams.set('from', from);
    if (to) backendUrl.searchParams.set('to', to);

    const response = await fetch(backendUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Ana\'s Index API error:', error);
    return NextResponse.json(
      { error: 'Failed to search Ana\'s Index' },
      { status: 500 }
    );
  }
}
