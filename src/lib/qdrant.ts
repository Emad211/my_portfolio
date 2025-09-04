import { QdrantClient } from '@qdrant/js-client-rest';
import type { Schemas as QdrantSchemas } from '@qdrant/js-client-rest';

if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
  throw new Error('QDRANT_URL or QDRANT_API_KEY environment variables are not set.');
}

export const QDRANT_COLLECTION_NAME = 'vibe_chunks';

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export async function ensureCollection() {
  try {
    const collectionInfo = await client.getCollection(QDRANT_COLLECTION_NAME);
    if (collectionInfo) {
      // Collection already exists
      return;
    }
  } catch (error) {
    // Collection does not exist, create it
    await client.createCollection(QDRANT_COLLECTION_NAME, {
      vectors: {
        size: 1536, // As specified for text-embedding-3-small
        distance: 'Cosine',
      },
    });
    console.log(`Created Qdrant collection: ${QDRANT_COLLECTION_NAME}`);
  }
}

// The payload will contain metadata we want to store alongside the vector.
// This metadata is retrieved during a search and is crucial for citations.
export type ChunkPayload = QdrantSchemas['Payload'] & {
    chunk_id: string;
    chapter_id: string;
    section_id?: string;
    text_preview: string;
    // other fields from the prompt's payload spec
    tags?: string[];
    routing_topics?: string[];
    quality_attributes?: string[];
    numbers?: any;
    lang?: string;
};

export async function upsertChunks(points: Array<{ id: string, vector: number[], payload: ChunkPayload }>) {
  await ensureCollection();

  await client.upsertPoints(QDRANT_COLLECTION_NAME, {
    wait: true, // Wait for the operation to complete
    points: points,
  });
}

export const qdrantClient = client;
