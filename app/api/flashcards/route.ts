import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { flashcards } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  // if (!isAdmin()) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const url = new URL(req.url);
  const filterParam = url.searchParams.get("filter");
  let filterObj = {};
  if (filterParam) {
    try {
      filterObj = JSON.parse(filterParam);
    } catch (error) {
      console.error("Error parsing filter:", error);
    }
  }

  const query = db.$with("filtered_flashcards").as(
    db
      .select()
      .from(flashcards)
      .where(
        filterObj && "lessonId" in filterObj
          ? eq(flashcards.lessonId, Number(filterObj.lessonId))
          : sql`TRUE`
      )
  );

  const result = await db.with(query).select().from(query);
  console.log("API Response:", result);

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  // if (!isAdmin()) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  try {
    const body = await req.json();
    console.log("Received flashcard data:", body);

    // Validate required fields
    const requiredFields = ["question", "answer", "lessonId"];
    for (const field of requiredFields) {
      if (!(field in body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Get the max order for the lesson
    const maxOrderResult = await db
      .select({ maxOrder: sql<number | null>`MAX(${flashcards.order})` })
      .from(flashcards)
      .where(eq(flashcards.lessonId, body.lessonId));

    const newOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const newFlashcard = await db
      .insert(flashcards)
      .values({ ...body, order: newOrder })
      .returning();
    console.log("Created flashcard:", newFlashcard);

    return NextResponse.json(newFlashcard[0], { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating flashcard:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
