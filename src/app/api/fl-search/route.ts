import { NextRequest, NextResponse } from 'next/server';
import { flSearchService } from '@/services/fl-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tagsParam = searchParams.get('tags');
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const tags = tagsParam ? tagsParam.split(',').map(tag => tag.trim()) : [];

    const results = flSearchService.search(query, tags, category);
    const limitedResults = results.slice(0, limit);

    return NextResponse.json({
      results: limitedResults,
      total: results.length,
      query,
      tags,
      category
    });

  } catch (error) {
    console.error('FL Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search FL documents' },
      { status: 500 }
    );
  }
}
