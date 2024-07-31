import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gt, desc } from "drizzle-orm";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
  flashcards,
  flashcardProgress,
  Lesson,
  Flashcard,
  FlashcardProgress,
  userStatistics,
} from "./schema";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          flashcards: {
            orderBy: (flashcards, { asc }) => [asc(flashcards.order)],
            with: {
              flashcardProgress: {
                where: eq(flashcardProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithProgress = unit.lessons.map((lesson) => {
      const allFlashcardsReviewed = lesson.flashcards.every(
        (flashcard) =>
          flashcard.flashcardProgress && flashcard.flashcardProgress.length > 0
      );

      const nextReviewAt = lesson.flashcards.reduce((earliest, flashcard) => {
        const progress = flashcard.flashcardProgress[0];
        if (progress && progress.nextReviewAt < earliest) {
          return progress.nextReviewAt;
        }
        return earliest;
      }, new Date(8640000000000000)); // Max date

      return {
        ...lesson,
        completed: allFlashcardsReviewed,
        nextReviewAt: allFlashcardsReviewed ? nextReviewAt : null,
      };
    });

    return { ...unit, lessons: lessonsWithProgress };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) return null;

  const lessonsWithDueFlashcards = await db.query.lessons.findMany({
    where: eq(lessons.unitId, userProgress.activeCourseId),
    with: {
      flashcards: {
        columns: {
          id: true,
          question: true,
          answer: true,
          questionImageUrl: true,
          answerImageUrl: true,
          order: true,
        },
        with: {
          flashcardProgress: {
            where: and(
              eq(flashcardProgress.userId, userId),
              gt(flashcardProgress.nextReviewAt, new Date())
            ),
          },
        },
      },
    },
  });

  const firstLessonWithDueFlashcards = lessonsWithDueFlashcards.find((lesson) =>
    lesson.flashcards.some(
      (flashcard) => flashcard.flashcardProgress.length > 0
    )
  );

  if (firstLessonWithDueFlashcards) {
    const nextReviewAt = firstLessonWithDueFlashcards.flashcards
      .flatMap((f) => f.flashcardProgress)
      .reduce(
        (earliest, fp) =>
          fp.nextReviewAt < earliest ? fp.nextReviewAt : earliest,
        new Date(8640000000000000)
      );

    return {
      activeLesson: {
        ...firstLessonWithDueFlashcards,
        nextReviewAt,
        completed: false, // You might want to calculate this based on flashcard progress
      },
      activeLessonId: firstLessonWithDueFlashcards.id,
    };
  }

  return { activeLesson: undefined, activeLessonId: undefined };
});

type FlashcardWithProgress = Flashcard & {
  flashcardProgress: FlashcardProgress[];
};

type LessonWithFlashcards = Lesson & {
  flashcards: FlashcardWithProgress[];
  flashcardsToReview: FlashcardWithProgress[];
};

export const getLesson = cache(
  async (id?: number): Promise<LessonWithFlashcards | null> => {
    const { userId } = auth();

    if (!userId) return null;

    const courseProgress = await getCourseProgress();
    const lessonId = id || courseProgress?.activeLessonId;

    if (!lessonId) return null;

    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: {
        flashcards: {
          with: {
            flashcardProgress: {
              where: eq(flashcardProgress.userId, userId),
            },
          },
        },
      },
    });

    if (!data) return null;

    const flashcardsToReview = data.flashcards.filter((flashcard) => {
      const progress = flashcard.flashcardProgress[0];
      return !progress || progress.nextReviewAt <= new Date();
    });

    return {
      ...data,
      flashcardsToReview,
    };
  }
);

export const getLessonPercentage = cache(async (lessonId: number) => {
  const { userId } = auth();

  if (!userId) return 0;

  const lesson = await getLesson(lessonId);

  if (!lesson) return 0;

  const totalFlashcards = lesson.flashcards.length;
  const reviewedFlashcards = lesson.flashcards.filter(
    (flashcard) =>
      flashcard.flashcardProgress && flashcard.flashcardProgress.length > 0
  ).length;

  const percentage = Math.round((reviewedFlashcards / totalFlashcards) * 100);

  return percentage;
});

export const getTopTenUsers = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    return [];
  }
  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });
  return data;
});

// Helper function to get today's date as a string in 'YYYY-MM-DD' format
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to get a date 7 days ago as a string in 'YYYY-MM-DD' format
const getSevenDaysAgoString = () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return sevenDaysAgo.toISOString().split("T")[0];
};

export const getUserStatistics = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const recentStats = await db.query.userStatistics.findMany({
    where: eq(userStatistics.userId, userId),
    orderBy: [desc(userStatistics.date)],
    limit: 30, // Get last 30 days to calculate streak
  });

  let currentStreak = 0;
  let i = 0;

  // Calculate current streak
  while (i < recentStats.length) {
    const stat = recentStats[i];
    const statDate = new Date(stat.date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (
      statDate.toISOString().split("T")[0] ===
      expectedDate.toISOString().split("T")[0]
    ) {
      currentStreak++;
      i++;
    } else {
      break;
    }
  }

  const todayStats = recentStats.find((stat) => stat.date === today);

  return todayStats
    ? {
        ...todayStats,
        streakDays: currentStreak,
      }
    : null;
});

export const updateUserStatistics = cache(
  async (cardsReviewed: number, timeStudied: number) => {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const existingStats = await db.query.userStatistics.findFirst({
      where: and(
        eq(userStatistics.userId, userId),
        eq(userStatistics.date, today)
      ),
    });

    if (existingStats) {
      const updatedStats = await db
        .update(userStatistics)
        .set({
          cardsReviewed: existingStats.cardsReviewed + cardsReviewed,
          timeStudied: existingStats.timeStudied + timeStudied,
          streakDays: existingStats.streakDays + 1,
        })
        .where(
          and(eq(userStatistics.userId, userId), eq(userStatistics.date, today))
        )
        .returning();

      return updatedStats[0];
    } else {
      const newStats = await db
        .insert(userStatistics)
        .values({
          userId,
          date: today,
          cardsReviewed,
          timeStudied,
          streakDays: 1,
        })
        .returning();

      return newStats[0];
    }
  }
);

export const getWeeklyStatistics = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const sevenDaysAgoString = getSevenDaysAgoString();

  return db.query.userStatistics.findMany({
    where: and(
      eq(userStatistics.userId, userId),
      gt(userStatistics.date, sevenDaysAgoString)
    ),
    orderBy: [desc(userStatistics.date)],
  });
});
