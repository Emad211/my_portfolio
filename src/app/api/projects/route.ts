import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { z } from 'zod';

// For now, we'll assume a fixed organization ID.
// In a real multi-tenant app, this would come from the user's session.
const TEMP_ORG_ID = 1;

const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters long.'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
    }

    const { name } = validation.data;

    // Here you would typically get the orgId from the authenticated user's session
    // For example: const { orgId } = await getSession();

    const newProject = await db
      .insert(projects)
      .values({
        name,
        orgId: TEMP_ORG_ID, // Using a temporary org ID
      })
      .returning({
        id: projects.id,
        name: projects.name,
        createdAt: projects.createdAt,
      });

    if (newProject.length === 0) {
        return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
    }

    return NextResponse.json(newProject[0], { status: 201 });

  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
