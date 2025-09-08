import { NextRequest, NextResponse } from 'next/server';
import { flSearchService } from '@/services/fl-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = flSearchService.getAllCategories();
      return NextResponse.json({ categories });
    }

    const tags = flSearchService.getAllTags();
    return NextResponse.json({ tags });

  } catch (error) {
    console.error('FL Tags API error:', error);
    return NextResponse.json(
      { error: 'Failed to get FL tags' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { documentId, tags } = await request.json();

    if (!documentId || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Invalid request: documentId and tags array required' },
        { status: 400 }
      );
    }

    const success = flSearchService.updateDocumentTags(documentId, tags);

    if (!success) {
      return NextResponse.json(
        { error: 'Document not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, documentId, tags });

  } catch (error) {
    console.error('FL Tags update error:', error);
    return NextResponse.json(
      { error: 'Failed to update document tags' },
      { status: 500 }
    );
  }
}
