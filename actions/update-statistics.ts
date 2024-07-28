"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { userStatistics } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateUserStatistics = async (
  cardsReviewed: number,
  timeStudied: number
) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const today = new Date().toISOString().split("T")[0];

  const existingStats = await db.query.userStatistics.findFirst({
    where: and(
      eq(userStatistics.userId, userId),
      eq(userStatistics.date, today)
    ),
  });

  if (existingStats) {
    await db
      .update(userStatistics)
      .set({
        cardsReviewed: existingStats.cardsReviewed + cardsReviewed,
        timeStudied: existingStats.timeStudied + timeStudied,
        streakDays: existingStats.streakDays + 1,
      })
      .where(
        and(eq(userStatistics.userId, userId), eq(userStatistics.date, today))
      );
  } else {
    await db.insert(userStatistics).values({
      userId,
      date: today,
      cardsReviewed,
      timeStudied,
      streakDays: 1,
    });
  }

  revalidatePath("/quests");
  revalidatePath("/learn");
};
