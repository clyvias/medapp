import { Flashcard, FlashcardProgress } from "@/db/schema";

export type FlashcardWithProgress = Flashcard & {
  flashcardProgress: FlashcardProgress[];
  nextReviewAt?: Date; // Add this line
};
