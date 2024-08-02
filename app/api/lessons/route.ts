import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { lessons } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const GET = async (req: Request) => {
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

  console.log("API Filter:", filterObj);

  const query = db.$with("filtered_lessons").as(
    db
      .select()
      .from(lessons)
      .where(
        filterObj && "unitId" in filterObj
          ? eq(lessons.unitId, Number(filterObj.unitId))
          : sql`TRUE`
      )
  );

  const result = await db.with(query).select().from(query);
  console.log("API Response:", result);

  return NextResponse.json(result);
};

export const POST = async (req: Request) => {
  // if (!isAdmin()) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const body = await req.json();
  const data = await db.insert(lessons).values(body).returning();

  return NextResponse.json(data[0]);
};
