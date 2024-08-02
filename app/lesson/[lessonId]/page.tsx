import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
import { Flashcard, FlashcardProgress } from "@/db/schema";
import { FlashcardWithProgress } from "@/types";

type Props = {
  params: {
    lessonId: string;
  };
};

const LessonPage = async ({ params }: Props) => {
  const lessonId = parseInt(params.lessonId, 10);
  const lessonData = getLesson(lessonId);
  const userProgressData = getUserProgress();

  const [lesson, userProgress] = await Promise.all([
    lessonData,
    userProgressData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const flashcardsToReview = lesson.flashcards.filter(
    (flashcard: FlashcardWithProgress) =>
      !flashcard.flashcardProgress[0] ||
      new Date(flashcard.flashcardProgress[0].nextReviewAt) <= new Date()
  );

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialFlashcards={flashcardsToReview}
      initialHearts={userProgress.hearts}
      userSubscription={null}
    />
  );
};

export default LessonPage;
