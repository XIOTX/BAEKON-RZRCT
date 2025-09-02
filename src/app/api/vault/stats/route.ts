import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:8787/vault/stats');
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Vault stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to get vault stats' },
      { status: 500 }
    );
  }
}
