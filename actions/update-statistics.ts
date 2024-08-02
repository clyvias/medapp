"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
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
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];

  const existingStats = await db.query.userStatistics.findFirst({
    where: and(
      eq(userStatistics.userId, userId),
      eq(userStatistics.date, today)
    ),
  });

  const yesterdayStats = await db.query.userStatistics.findFirst({
    where: and(
      eq(userStatistics.userId, userId),
      eq(userStatistics.date, yesterday)
    ),
  });

  let newStreakDays = 1; // Default to 1 if this is the first day or streak was broken

  if (yesterdayStats) {
    // If there's a record for yesterday, continue the streak
    newStreakDays = yesterdayStats.streakDays + 1;
  }

  if (existingStats) {
    await db
      .update(userStatistics)
      .set({
        cardsReviewed: existingStats.cardsReviewed + cardsReviewed,
        timeStudied: existingStats.timeStudied + timeStudied,
        streakDays: newStreakDays,
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
      streakDays: newStreakDays,
    });
  }

  revalidatePath("/quests");
  revalidatePath("/learn");
};
