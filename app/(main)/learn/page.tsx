import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getCourseProgress, getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";

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

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
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
              lessons={unit.lessons.map((lesson) => ({
                ...lesson,
                completed: lesson.flashcards.every(
                  (flashcard) =>
                    flashcard.flashcardProgress.length > 0 &&
                    new Date(flashcard.flashcardProgress[0].nextReviewAt) >
                      new Date()
                ),
                nextReviewAt: lesson.flashcards
                  .flatMap((f) => f.flashcardProgress)
                  .reduce(
                    (earliest, fp) =>
                      fp && fp.nextReviewAt < earliest
                        ? fp.nextReviewAt
                        : earliest,
                    new Date(8640000000000000) // Max date
                  ),
              }))}
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
