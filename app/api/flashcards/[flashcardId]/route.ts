import db from "@/db/drizzle";
import { flashcards } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { flashcardId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.flashcards.findFirst({
    where: eq(flashcards.id, params.flashcardId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { flashcardId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = await db
    .update(flashcards)
    .set({ ...body })
    .where(eq(flashcards.id, params.flashcardId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { flashcardId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db
    .delete(flashcards)
    .where(eq(flashcards.id, params.flashcardId))
    .returning();

  return NextResponse.json(data[0]);
};
