"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { flashcardProgress, flashcards } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const getNextScore = (
  prevEasiness: number,
  prevConsecutiveCorrectAnswers: number,
  performanceRating: number
) => {
  const nextEasiness =
    Math.max(
      prevEasiness / 100 +
        -0.8 +
        0.28 * performanceRating +
        -0.02 * performanceRating ** 2,
      1.3
    ) * 100;

  const nextConsecutiveCorrectAnswers =
    performanceRating >= 3 ? prevConsecutiveCorrectAnswers + 1 : 0;

  const daysToNextReview = Math.min(
    performanceRating >= 3
      ? 0.2 +
          0.2 *
            ((nextEasiness / 100) ** 2.2 *
              (nextConsecutiveCorrectAnswers - 1) ** 2.2)
      : 0.2,
    300
  );

  return {
    easiness: Math.round(nextEasiness),
    consecutiveCorrectAnswers: nextConsecutiveCorrectAnswers,
    msToNextReview: daysToNextReview * 86400000,
  };
};

export const updateFlashcardProgress = async (
  flashcardId: number,
  performanceRating: number
): Promise<{ error?: string }> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const existingProgress = await db.query.flashcardProgress.findFirst({
      where: and(
        eq(flashcardProgress.userId, userId),
        eq(flashcardProgress.flashcardId, flashcardId)
      ),
    });

    const now = new Date();

    if (existingProgress) {
      const nextScore = getNextScore(
        existingProgress.easiness,
        existingProgress.consecutiveCorrectAnswers,
        performanceRating
      );

      await db
        .update(flashcardProgress)
        .set({
          easiness: nextScore.easiness,
          consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
          nextReviewAt: new Date(now.getTime() + nextScore.msToNextReview),
          lastReviewedAt: now,
        })
        .where(eq(flashcardProgress.id, existingProgress.id));
    } else {
      const flashcard = await db.query.flashcards.findFirst({
        where: eq(flashcards.id, flashcardId),
      });

      if (!flashcard) {
        return { error: "Flashcard not found" };
      }

      const initialScore = getNextScore(250, 0, performanceRating);

      await db.insert(flashcardProgress).values({
        userId,
        flashcardId,
        easiness: initialScore.easiness,
        consecutiveCorrectAnswers: initialScore.consecutiveCorrectAnswers,
        nextReviewAt: new Date(now.getTime() + initialScore.msToNextReview),
        lastReviewedAt: now,
      });
    }

    return {};
  } catch (error) {
    console.error("Error updating flashcard progress:", error);
    return { error: "Failed to update flashcard progress" };
  }
};