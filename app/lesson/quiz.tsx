"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { useWindowSize } from "react-use";

import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Footer } from "./footer";
import { ResultCard } from "./result-card";
import { updateFlashcardProgress } from "@/actions/flashcard-progress";
import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  initialLessonId: number;
  initialFlashcards: Flashcard[];
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
  const { width, height } = useWindowSize();
  const { open: openHeartsModal } = useHeartsModal();

  const [pending, startTransition] = useTransition();
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [hearts, setHearts] = useState(initialHearts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const currentFlashcard = flashcards[currentIndex];
  const isLastFlashcard = currentIndex === flashcards.length - 1;

  const onShowAnswer = () => {
    setShowAnswer(true);
  };

  const onRate = (rating: number) => {
    if (pending) return;
    setSelectedRating(rating);
  };

  const onContinue = () => {
    if (pending || selectedRating === null) return;

    startTransition(() => {
      updateFlashcardProgress(currentFlashcard.id, selectedRating)
        .then(() => {
          if (selectedRating < 3) {
            setHearts((prev) => Math.max(prev - 1, 0));
            reduceHearts(currentFlashcard.id)
              .then((response) => {
                if (response?.error === "hearts") {
                  openHeartsModal();
                }
              })
              .catch(() =>
                toast.error("Something went wrong. Please try again.")
              );
          }

          if (isLastFlashcard) {
            router.push(`/lesson/${initialLessonId}/complete`);
          } else {
            setCurrentIndex((prev) => prev + 1);
            setShowAnswer(false);
            setSelectedRating(null);
          }
        })
        .catch(() => toast.error("Something went wrong. Please try again."));
    });
  };

  if (flashcards.length === 0) {
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
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            COmpletaste todos los flashcards de esa lección.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={initialFlashcards.length * 10}
            />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={initialLessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  return (
    <>
      <Header
        hearts={hearts}
        percentage={(currentIndex / flashcards.length) * 100}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {showAnswer ? "Answer" : "Question"}
            </h1>
            <div>
              <QuestionBubble question={currentFlashcard.question} />
              {showAnswer && (
                <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                  <p className="text-xl font-semibold">
                    {currentFlashcard.answer}
                  </p>
                </div>
              )}
              {!showAnswer && (
                <div className="mt-4">
                  <button
                    onClick={onShowAnswer}
                    className="w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    Show Answer
                  </button>
                </div>
              )}
              {showAnswer && (
                <div className="mt-4 flex justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onRate(rating)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
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
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={!showAnswer || selectedRating === null}
        status={
          selectedRating !== null
            ? selectedRating >= 3
              ? "correct"
              : "wrong"
            : "none"
        }
        onCheck={onContinue}
      />
    </>
  );
};
