export type TrainingItemType = "vocabulary" | "sentence" | "grammar";

export type ReviewGrade = "correct" | "almost_correct" | "wrong";

export type Flashcard = {
  id: string;
  item_id: string;
  item_type: TrainingItemType;
  title: string;
  prompt: string;
  answer: string;
};

export type FlashcardReviewResult = {
  item_id: string;
  item_type: TrainingItemType;
  grade: ReviewGrade;
};
