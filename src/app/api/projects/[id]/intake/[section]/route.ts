import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projectIntake } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const intakePayloadSchema = z.record(z.any()); // Loosely validated for now

export async function PUT(
  req: Request,
  { params }: { params: { id: string; section: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    const section = params.section;

    if (isNaN(projectId)) {
        return NextResponse.json({ error: 'Invalid project ID.' }, { status: 400 });
    }

    const payload = await req.json();
    const validation = intakePayloadSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload', details: validation.error.format() }, { status: 400 });
    }

    // In a real app, we would also validate the payload against the chapter's brief_input_keys schema.
    // For now, we just check that it's a valid JSON object.
    const isValid = true; // Placeholder for actual validation logic

    const intakeData = {
        projectId,
        section,
        payload,
        isValid,
        updatedAt: new Date(),
    };

    // Upsert logic: Insert a new record, or update it if it already exists for this project/section.
    await db
      .insert(projectIntake)
      .values(intakeData)
      .onConflictDoUpdate({
        target: [projectIntake.projectId, projectIntake.section], // This requires a unique constraint on these columns
        set: {
          payload: intakeData.payload,
          isValid: intakeData.isValid,
          updatedAt: intakeData.updatedAt,
        },
      });

    return NextResponse.json({ message: 'Intake saved successfully.' }, { status: 200 });

  } catch (error) {
    console.error(`Failed to save intake for project ${params.id}, section ${params.section}:`, error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
