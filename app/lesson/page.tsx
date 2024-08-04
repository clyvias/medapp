import { getLesson, getUserProgress, getCourseProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";

const LessonPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();

  const [userProgress, courseProgress] = await Promise.all([
    userProgressData,
    courseProgressData,
  ]);

  if (!userProgress || !courseProgress?.activeLessonId) {
    redirect("/learn");
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    redirect("/learn");
  }

  const flashcardsToReview = lesson.flashcards.filter(
    (flashcard) =>
      !flashcard.flashcardProgress[0] ||
      new Date(flashcard.flashcardProgress[0].nextReviewAt) <= new Date()
  );

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialFlashcards={flashcardsToReview}
      initialHearts={userProgress.hearts}
      userSubscription={null} // Replace with actual user subscription data if available
    />
  );
};

export default LessonPage;
