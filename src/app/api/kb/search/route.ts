import { NextResponse } from 'next/server';
import { qdrantClient, QDRANT_COLLECTION_NAME } from '@/lib/qdrant';
import { getEmbedding } from '@/lib/embeddings';
import type { Schemas as QdrantSchemas } from '@qdrant/js-client-rest';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const topics = searchParams.getAll('topics'); // can be multiple
    const qualities = searchParams.getAll('qualities'); // can be multiple
    const k = searchParams.get('k') ? parseInt(searchParams.get('k')!, 10) : 8;

    if (!q) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // 1. Get embedding for the query
    const queryEmbedding = await getEmbedding(q);

    // 2. Build Qdrant filter
    const filter: QdrantSchemas['Filter'] = {
      must: [],
    };

    if (topics.length > 0) {
      filter.must?.push({
        key: 'routing_topics',
        match: {
          any: topics,
        },
      });
    }

    if (qualities.length > 0) {
      filter.must?.push({
        key: 'quality_attributes',
        match: {
          any: qualities,
        },
      });
    }

    // 3. Perform search
    const searchResult = await qdrantClient.searchPoints({
      collection_name: QDRANT_COLLECTION_NAME,
      vector: queryEmbedding,
      limit: k,
      score_threshold: 0.7, // As a starting point, can be tuned
      with_payload: true,
      filter: (filter.must?.length ?? 0) > 0 ? filter : undefined,
    });

    // 4. Format the response
    const hits = searchResult.map(hit => {
        const payload = hit.payload as QdrantSchemas['Payload'] | null;
        return {
            chunk_id: hit.id,
            score: hit.score,
            chapter_id: payload?.chapter_id || '',
            section: payload?.section_id || '',
            text_preview: payload?.text_preview || '',
            // Citations can be constructed from the payload if more data is stored
            citations: [{ chunk_id: hit.id, section: payload?.section_id }],
        }
    });

    return NextResponse.json({ hits });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'An internal error occurred during search.' }, { status: 500 });
  }
}
