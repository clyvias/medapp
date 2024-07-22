import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gt } from "drizzle-orm";
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
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          flashcards: {
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
  }); //TODO: populate units and lessons

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
