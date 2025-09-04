import { NextResponse } from 'next/server';
import { generateVibePromptPack } from '@/lib/rag';
import { db } from '@/lib/db';
import { promptPacks } from '@/lib/db/schema';
import { z } from 'zod';

export const runtime = 'nodejs';

const generateSchema = z.object({
  chapters: z.array(z.string().min(1)).min(1, 'At least one chapter is required.'),
  version: z.string().optional().default('1.0.0'),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID.' }, { status: 400 });
    }

    const body = await req.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.format() }, { status: 400 });
    }

    const { chapters, version } = validation.data;

    // For this implementation, we'll just process the first chapter.
    // A full implementation would loop through all chapters.
    const chapterId = chapters[0];

    const promptPackResult = await generateVibePromptPack(projectId, chapterId, version);

    // Save the generated pack to the database
    await db.insert(promptPacks).values({
      projectId,
      version,
      json: promptPackResult.json,
      md: promptPackResult.md,
      citations: promptPackResult.citations,
    });

    return NextResponse.json({ prompt_pack: promptPackResult }, { status: 201 });

  } catch (error: any) {
    console.error(`Failed to generate prompt pack for project ${params.id}:`, error);
    return NextResponse.json({ error: 'An internal error occurred during generation.', details: error.message }, { status: 500 });
  }
}
