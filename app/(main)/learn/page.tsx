import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getCourseProgress, getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { CompactUserStatistics } from "@/components/compact-user-statistics";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData = getUnits();
  const courseProgressData = getCourseProgress();

  const [userProgress, units, courseProgress] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const now = new Date();

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
        <CompactUserStatistics />
        <Quests points={userProgress.points} />
        <Promo />
      </StickyWrapper>

      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons.map((lesson) => {
                const totalFlashcards = lesson.flashcards.length;
                const dueFlashcards = lesson.flashcards.filter(
                  (flashcard) =>
                    flashcard.flashcardProgress.length === 0 ||
                    new Date(flashcard.flashcardProgress[0].nextReviewAt) <= now
                ).length;
                const progress =
                  ((totalFlashcards - dueFlashcards) / totalFlashcards) * 100;

                const nextReviewAt = lesson.flashcards
                  .flatMap((f) => f.flashcardProgress)
                  .reduce(
                    (earliest, fp) =>
                      fp && new Date(fp.nextReviewAt) < earliest
                        ? new Date(fp.nextReviewAt)
                        : earliest,
                    new Date(8640000000000000) // Max date
                  );

                return {
                  ...lesson,
                  progress: Math.max(0, Math.min(100, progress)),
                  started:
                    totalFlashcards > 0 && dueFlashcards < totalFlashcards,
                  completed: dueFlashcards === 0 && totalFlashcards > 0,
                  isReviewNeeded: dueFlashcards > 0,
                  nextReviewAt: nextReviewAt < now ? now : nextReviewAt,
                };
              })}
              activeLesson={courseProgress?.activeLesson}
              activeLessonId={courseProgress?.activeLessonId}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
