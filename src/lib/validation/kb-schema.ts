import { z } from 'zod';

// This schema is based on the "Contrato de دانش (JSON فصل‌ها)" section of the prompt.

const chunkSchema = z.object({
  id: z.string(),
  section: z.string(),
  tags: z.array(z.string()),
  quality_attributes: z.array(z.string()).optional(),
  claims: z.array(z.string()),
  decisions: z.array(z.string()),
  guardrails: z.array(z.string()),
  checklist: z.array(z.string()),
  numbers: z.array(z.record(z.any())), // Loosely typed as array of objects
  tools: z.array(z.string()),
  linkouts: z.array(z.string()),
  // Assuming a text field will be composed from the above for embedding
});

export const chapterSchema = z.object({
  chapter_id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  routing_topics: z.array(z.string()),
  quality_attributes: z.array(z.string()),
  glossary: z.array(z.record(z.any())),
  brief_input_keys: z.array(z.record(z.any())),
  chunks: z.array(chunkSchema),
  sources: z.array(z.record(z.any())),
  version: z.string(),
});

export type Chapter = z.infer<typeof chapterSchema>;
export type Chunk = z.infer<typeof chunkSchema>;
