import { db } from './db';
import { projectIntake } from './db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { getEmbedding } from './embeddings';
import { qdrantClient, QDRANT_COLLECTION_NAME } from './qdrant';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the structure of the Vibe Prompt Pack (VPP)
const vppSchema = z.object({
  header: z.object({
    topic: z.string(),
    goal: z.string(),
    required_inputs: z.array(z.string()),
    constraints: z.array(z.string()),
    quality_targets: z.record(z.any()),
  }),
  evidence: z.object({
    citations: z.array(z.object({
        chunk_id: z.string(),
        section: z.string(),
        claim_id: z.string().optional(),
    })),
    snippets: z.array(z.string()),
  }),
  prompt_core: z.object({
    instruction: z.string(),
    inputs: z.record(z.any()),
    evidence: z.string(),
    guardrails: z.array(z.string()),
    output_format: z.string(),
  }),
  acceptance_criteria: z.array(z.string()),
  meta: z.object({
    version: z.string(),
    chapter_id: z.string(),
    sections: z.array(z.string()),
    trace_id: z.string(),
  }),
});


const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function retrieveContext(projectId: number, chapterId: string) {
  // 1. Librarian: Fetch user's intake data for the relevant sections
  const intakeData = await db.query.projectIntake.findFirst({
    where: and(
      eq(projectIntake.projectId, projectId),
      eq(projectIntake.section, chapterId)
    ),
  });

  if (!intakeData) {
    throw new Error(`No intake data found for project ${projectId} and chapter ${chapterId}`);
  }

  // 2. Librarian: Create a query from the intake data to find relevant chunks
  const searchQuery = `API design for: ${JSON.stringify(intakeData.payload)}`;
  const queryEmbedding = await getEmbedding(searchQuery);

  // 3. Librarian: Search Qdrant for the most relevant knowledge chunks
  const searchResult = await qdrantClient.searchPoints({
    collection_name: QDRANT_COLLECTION_NAME,
    vector: queryEmbedding,
    limit: 8,
    with_payload: true,
  });

  const retrievedChunks = searchResult.map(hit => ({
    id: hit.id,
    text: hit.payload?.text_preview || '',
    ...hit.payload
  }));

  return { intakeData, retrievedChunks };
}

export async function generateVibePromptPack(projectId: number, chapterId: string, version: string) {
  const { intakeData, retrievedChunks } = await retrieveContext(projectId, chapterId);

  // 4. Prompt-Composer: Use the LLM to generate the VPP
  const systemPrompt = `You are a world-class software architect specializing in API design. Your task is to generate a "Vibe Prompt Pack (VPP)" based on user requirements and expert knowledge.

  - The user's specific inputs are provided in the 'User Intake' section.
  - The 'Knowledge Base' provides expert claims, decisions, and guardrails.
  - You MUST adhere to all constraints, guardrails, and checklists from the knowledge base.
  - The output MUST be a valid JSON object that conforms to the provided schema.
  - All text must be in Persian (fa).
  - Citations must be included for every piece of evidence used from the knowledge base.
  `;

  const { object: vpp } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: vppSchema,
    system: systemPrompt,
    prompt: `
      User Intake:
      ${JSON.stringify(intakeData.payload, null, 2)}

      Knowledge Base Chunks:
      ${retrievedChunks.map(c => `Chunk ID: ${c.id}\nContent: ${c.text}\n\n`).join('')}

      Generate the Vibe Prompt Pack (VPP) based on the information above.
    `,
  });

  // 5. Add final metadata
  vpp.meta.version = version;
  vpp.meta.trace_id = crypto.randomUUID();
  vpp.meta.chapter_id = chapterId;

  // Generate a markdown version (simplified for now)
  const markdown = `# Vibe Prompt Pack: ${vpp.header.topic}\n\n${vpp.prompt_core.instruction}`;

  return {
    json: vpp,
    md: markdown,
    citations: vpp.evidence.citations,
  };
}
