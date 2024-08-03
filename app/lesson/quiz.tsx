"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { AnswerBubble } from "./answer-bubble";
import { Footer } from "./footer";
import { ResultCard } from "./result-card";
import { updateFlashcardProgress } from "@/actions/flashcard-progress";
import { reduceHearts } from "@/actions/user-progress";
import { updateUserStatistics } from "@/actions/update-statistics";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { FlashcardWithProgress } from "@/types";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
  questionImageUrl?: string;
  answerImageUrl?: string;
  nextReviewAt?: Date;
};

type Props = {
  initialLessonId: number;
  initialFlashcards: FlashcardWithProgress[];
  initialHearts: number;
  userSubscription: any;
};

export const Quiz = ({
  initialLessonId,
  initialFlashcards,
  initialHearts,
  userSubscription,
}: Props) => {
  const router = useRouter();
  const { open: openHeartsModal } = useHeartsModal();
  const { width, height } = useWindowSize();

  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [hearts, setHearts] = useState(initialHearts);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextReviewAt, setNextReviewAt] = useState<Date | null>(null);
  const [sessionStartTime] = useState(new Date());

  const currentFlashcard = flashcards[currentIndex];
  const isLastFlashcard = currentIndex === flashcards.length - 1;

  const onShowAnswer = () => {
    setShowAnswer(true);
  };

  const onRate = (rating: number) => {
    setSelectedRating(rating);
  };

  const onContinue = async () => {
    if (selectedRating === null) return;

    try {
      const updatedFlashcard = await updateFlashcardProgress(
        currentFlashcard.id,
        selectedRating
      );

      if (selectedRating >= 3) {
        setEarnedPoints((prev) => prev + 10);
      }

      if (selectedRating < 3) {
        const response = await reduceHearts(currentFlashcard.id);
        if (response?.error === "hearts") {
          openHeartsModal();
          return;
        }
        setHearts((prev) => Math.max(prev - 1, 0));
      }

      // Update the flashcard with the new nextReviewAt
      setFlashcards((prev) =>
        prev.map((fc) =>
          fc.id === currentFlashcard.id
            ? { ...fc, nextReviewAt: updatedFlashcard.nextReviewAt }
            : fc
        )
      );

      if (isLastFlashcard) {
        const earliestReview = flashcards.reduce((earliest, fc) => {
          if (!fc.nextReviewAt) return earliest;
          return fc.nextReviewAt < earliest ? fc.nextReviewAt : earliest;
        }, new Date(8640000000000000)); // Max date

        setNextReviewAt(earliestReview);
        setIsCompleted(true);
        // Update user statistics when the lesson is completed
        const endTime = new Date();
        const timeStudied = Math.round(
          (endTime.getTime() - sessionStartTime.getTime()) / 1000
        );
        try {
          await updateUserStatistics(flashcards.length, timeStudied);
        } catch (error) {
          console.error("Failed to update user statistics:", error);
          // Don't throw an error here, just log it to avoid disrupting the user experience
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
        setSelectedRating(null);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const formatNextReview = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
    }

    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    }

    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }

    const diffMonths = Math.round(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
    }

    const diffYears = Math.round(diffDays / 365);
    return `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
  };

  if (flashcards.length === 0) {
    return <div>No flashcards available.</div>;
  }

  if (isCompleted) {
    return (
      <>
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700">
            Lesson Complete!
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={earnedPoints} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
          {nextReviewAt && (
            <div className="text-lg font-semibold text-neutral-600">
              Next review in: {formatNextReview(nextReviewAt)}
            </div>
          )}
        </div>
        <Footer
          lessonId={initialLessonId}
          onCheck={() => router.push("/learn?refresh=true")}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        hearts={hearts}
        percentage={(currentIndex / flashcards.length) * 100}
        hasActiveSubscription={!!userSubscription?.isActive}
        currentFlashcard={currentIndex + 1}
        totalFlashcards={flashcards.length}
      />
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl lg:text-3xl text-center font-bold text-neutral-700 mb-8">
            {showAnswer ? "Respuesta" : "Pregunta"}
          </h1>
          <div className="space-y-8">
            <QuestionBubble question={currentFlashcard.question} />
            {showAnswer && <AnswerBubble answer={currentFlashcard.answer} />}
            {!showAnswer && (
              <div className="mt-6 w-full">
                <button
                  onClick={onShowAnswer}
                  className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-lg"
                >
                  Mostrar Respuesta
                </button>
              </div>
            )}
            {showAnswer && (
              <div className="mt-8 w-full">
                <p className="text-lg font-semibold text-neutral-600 mb-4 text-center">
                  Califica tu comprensión:
                </p>
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onRate(rating)}
                      className={`px-6 py-3 rounded-lg font-semibold text-lg ${
                        rating === selectedRating
                          ? "bg-blue-500 text-white"
                          : rating < 3
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-500"
                      } hover:opacity-80 transition`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer
        disabled={!showAnswer || selectedRating === null}
        onCheck={onContinue}
      />
    </div>
  );
};
