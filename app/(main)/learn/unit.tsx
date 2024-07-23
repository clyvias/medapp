import { lessons, flashcards, flashcardProgress } from "@/db/schema";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type LessonWithProgress = typeof lessons.$inferSelect & {
  completed: boolean;
  nextReviewAt: Date | null;
  flashcards: (typeof flashcards.$inferSelect & {
    flashcardProgress: (typeof flashcardProgress.$inferSelect)[];
  })[];
};

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: LessonWithProgress[];
  activeLesson?: typeof lessons.$inferSelect;
  activeLessonId?: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonId,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLessonId;
          const totalFlashcards = lesson.flashcards.length;
          const reviewedFlashcards = lesson.flashcards.filter(
            (flashcard) => flashcard.flashcardProgress.length > 0
          ).length;
          const isStarted = reviewedFlashcards > 0;
          const isCompleted =
            reviewedFlashcards === totalFlashcards && totalFlashcards > 0;
          const percentage = isStarted
            ? Math.round((reviewedFlashcards / totalFlashcards) * 100)
            : 0;

          let nextReviewAt: Date | null = null;
          if (isStarted) {
            nextReviewAt = lesson.flashcards
              .flatMap((f) => f.flashcardProgress)
              .reduce(
                (earliest, fp) =>
                  fp.nextReviewAt && fp.nextReviewAt < earliest
                    ? fp.nextReviewAt
                    : earliest,
                new Date(8640000000000000) // Max date
              );
          }

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              percentage={percentage}
              completed={isCompleted}
              started={isStarted}
              nextReviewAt={nextReviewAt}
              lessonName={lesson.title}
            />
          );
        })}
      </div>
    </>
  );
};
