import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    // Proxy to the backend server
    const backendUrl = new URL('http://localhost:8787/vault/search');
    if (q) backendUrl.searchParams.set('q', q);
    if (category) backendUrl.searchParams.set('category', category);

    const response = await fetch(backendUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Vault API error:', error);
    return NextResponse.json(
      { error: 'Failed to search vault' },
      { status: 500 }
    );
  }
}
