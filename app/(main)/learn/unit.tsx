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
          const completedFlashcards = lesson.flashcards.filter(
            (flashcard) =>
              flashcard.flashcardProgress.length > 0 &&
              new Date(flashcard.flashcardProgress[0].nextReviewAt) > new Date()
          ).length;
          const percentage = Math.round(
            (completedFlashcards / totalFlashcards) * 100
          );

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              percentage={percentage}
              completed={lesson.completed}
              nextReviewAt={lesson.nextReviewAt}
              lessonName={lesson.title}
            />
          );
        })}
      </div>
    </>
  );
};
