import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Security check - only allow reading from fl-knowledge-base
    if (!filePath.startsWith('fl-knowledge-base/')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    try {
      // Read the markdown file from the project root
      const fullPath = path.join(process.cwd(), filePath);
      const content = await readFile(fullPath, 'utf-8');

      return NextResponse.json({ 
        content,
        path: filePath 
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json({ 
        error: 'File not found',
        path: filePath 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
