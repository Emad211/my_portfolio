import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { kbDocuments, kbChunks } from '@/lib/db/schema';
import { chapterSchema } from '@/lib/validation/kb-schema';
import { chunkChapter } from '@/lib/chunker';
import { getEmbeddings } from '@/lib/embeddings';
import { upsertChunks, ChunkPayload } from '@/lib/qdrant';

// Use Node.js runtime for heavy tasks like embedding generation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // prevent caching

async function ingestChapterData(chapterData: any) {
  const chapter = chapterSchema.parse(chapterData);

  const processedChunks = chunkChapter(chapter.chunks);
  const textsToEmbed = processedChunks.map(c => c.text);
  const embeddings = await getEmbeddings(textsToEmbed);

  const qdrantPoints = [];
  const postgresChunks = [];

  for (let i = 0; i < processedChunks.length; i++) {
    const chunk = processedChunks[i];
    const embedding = embeddings[i];

    const chunkId = `${chapter.chapter_id}-${chunk.metadata.id}`;

    const payload: ChunkPayload = {
        chunk_id: chunkId,
        chapter_id: chapter.chapter_id,
        section_id: chunk.metadata.section,
        text_preview: chunk.text.substring(0, 200), // a short preview
        tags: chunk.metadata.tags,
        quality_attributes: chunk.metadata.quality_attributes,
        lang: 'fa',
    };

    qdrantPoints.push({
      id: chunkId,
      vector: embedding,
      payload: payload,
    });

    postgresChunks.push({
      id: chunkId, // Using the same ID for consistency
      chapterId: chapter.chapter_id,
      sectionId: chunk.metadata.section,
      tags: chunk.metadata.tags,
      qualityAttributes: chunk.metadata.quality_attributes,
      text: chunk.text,
      textPreview: payload.text_preview,
      lang: 'fa',
    });
  }

  // DB Transaction
  await db.transaction(async (tx) => {
    // 1. Insert the main document
    await tx.insert(kbDocuments).values({
      chapterId: chapter.chapter_id,
      title: chapter.title,
      json: chapter, // store the original json
      routingTopics: chapter.routing_topics,
      qualityAttributes: chapter.quality_attributes,
      lang: 'fa',
    }).onConflictDoUpdate({
        target: kbDocuments.chapterId,
        set: {
            title: chapter.title,
            json: chapter,
            routingTopics: chapter.routing_topics,
            qualityAttributes: chapter.quality_attributes,
        }
    });

    // 2. Insert the chunks if there are any
    if (postgresChunks.length > 0) {
      // Drizzle doesn't have a great "upsertMany" so we'll just insert for now
      // A real-world scenario might need a more robust way to handle conflicts on chunks
      await tx.insert(kbChunks).values(postgresChunks).onConflictDoNothing(); // Simple conflict handling
    }
  });

  // 3. Upsert to Qdrant after DB is successful
  await upsertChunks(qdrantPoints);

  return {
    chapter_id: chapter.chapter_id,
    chunks_count: processedChunks.length,
  };
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { json_payload, json_url } = body;

    let chapterData;

    if (json_payload) {
      chapterData = json_payload;
    } else if (json_url) {
      const response = await fetch(json_url);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch JSON from URL' }, { status: 400 });
      }
      chapterData = await response.json();
    } else {
      return NextResponse.json({ error: 'Either json_payload or json_url must be provided' }, { status: 400 });
    }

    const result = await ingestChapterData(chapterData);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid JSON schema', details: error.errors }, { status: 422 });
    }
    console.error('Ingestion Error:', error);
    return NextResponse.json({ error: 'An internal error occurred during ingestion.' }, { status: 500 });
  }
}
