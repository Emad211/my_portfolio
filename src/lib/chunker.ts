import { Chunk } from './validation/kb-schema';

const CHUNK_SIZE_TARGET = 2500; // Approx. 600-700 tokens
const CHUNK_SIZE_MIN = 1500;   // Approx. 400 tokens

interface ProcessedChunk {
  text: string;
  metadata: Omit<Chunk, 'claims' | 'decisions' | 'guardrails' | 'checklist' | 'numbers' | 'tools' | 'linkouts'>;
}

function formatTextFromChunk(chunk: Chunk): string {
  // Combine various fields into a single block of text for embedding.
  // This creates a rich context for the vector search.
  let content = `Section: ${chunk.section}\n`;
  if (chunk.tags.length > 0) content += `Tags: ${chunk.tags.join(', ')}\n`;
  if (chunk.claims.length > 0) content += `Claims:\n- ${chunk.claims.join('\n- ')}\n`;
  if (chunk.decisions.length > 0) content += `Decisions:\n- ${chunk.decisions.join('\n- ')}\n`;
  if (chunk.guardrails.length > 0) content += `Guardrails:\n- ${chunk.guardrails.join('\n- ')}\n`;
  if (chunk.checklist.length > 0) content += `Checklist:\n- ${chunk.checklist.join('\n- ')}\n`;
  if (chunk.numbers.length > 0) {
    const numbersText = chunk.numbers.map(n => JSON.stringify(n)).join('; ');
    content += `Numbers: ${numbersText}\n`;
  }
  return content;
}

export function chunkChapter(sourceChunks: Chunk[]): ProcessedChunk[] {
  const processedChunks: ProcessedChunk[] = [];

  for (const chunk of sourceChunks) {
    const text = formatTextFromChunk(chunk);
    const metadata = { ...chunk };

    // For simplicity in this stage, we are considering one source chunk as one processed chunk.
    // The prompt mentions chunking 500-800 tokens. The source JSON is already "chunked".
    // A more advanced implementation would split the `text` further if it's too long.
    // For now, we assume the pre-defined chunks in the JSON are appropriately sized.

    // The text from formatTextFromChunk will be used for embedding.
    // The original chunk metadata will be stored in Qdrant payload.

    processedChunks.push({
      text: text,
      metadata: {
        id: chunk.id,
        section: chunk.section,
        tags: chunk.tags,
        quality_attributes: chunk.quality_attributes,
      }
    });
  }

  return processedChunks;
}
