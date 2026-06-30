import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import { listGrammarNotes } from "../grammar/grammar.api";
import { listSentences } from "../sentences/sentence.api";
import { listVocabulary } from "../vocabulary/vocabulary.api";
import { createFlashcards, FLASHCARD_COUNT } from "./flashcards";
import { saveReviewResults } from "./reviewEvents.api";
import type { Flashcard, FlashcardReviewResult, ReviewGrade } from "./training.types";

const gradeOptions: Array<{ grade: ReviewGrade; label: string; className: string }> = [
  {
    grade: "correct",
    label: "Correct",
    className:
      "!bg-emerald-50 !text-emerald-800 ring-1 ring-inset ring-emerald-200 hover:!bg-emerald-100",
  },
  {
    grade: "almost_correct",
    label: "Almost Correct",
    className:
      "!bg-yellow-50 !text-yellow-800 ring-1 ring-inset ring-yellow-200 hover:!bg-yellow-100",
  },
  {
    grade: "wrong",
    label: "Wrong",
    className:
      "!bg-red-50 !text-red-800 ring-1 ring-inset ring-red-200 hover:!bg-red-100",
  },
];

type ExerciseStatus = "idle" | "active" | "finished";

async function loadFlashcardsForUser(userId: string) {
  const [vocabulary, sentences, grammarNotes] = await Promise.all([
    listVocabulary(userId),
    listSentences(userId),
    listGrammarNotes(userId),
  ]);

  return createFlashcards(vocabulary, sentences, grammarNotes);
}

export function FlashcardExercise() {
  const { session } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<FlashcardReviewResult[]>([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedResults, setHasSavedResults] = useState(false);
  const [status, setStatus] = useState<ExerciseStatus>("idle");
  const [error, setError] = useState("");

  const currentCard = cards[currentIndex];
  const isComplete = results.length === cards.length && cards.length > 0;

  const gradeSummary = useMemo(
    () => ({
      correct: results.filter((result) => result.grade === "correct").length,
      almostCorrect: results.filter(
        (result) => result.grade === "almost_correct",
      ).length,
      wrong: results.filter((result) => result.grade === "wrong").length,
    }),
    [results],
  );

  async function loadCards() {
    if (!session?.user.id) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextCards = await loadFlashcardsForUser(session.user.id);

      setCards(nextCards);
      setCurrentIndex(0);
      setResults([]);
      setIsAnswerVisible(false);
      setHasSavedResults(false);
      setStatus("idle");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not prepare flashcards.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const userId = session?.user.id;

    if (!userId) {
      return;
    }

    let isMounted = true;

    loadFlashcardsForUser(userId)
      .then((nextCards) => {
        if (!isMounted) {
          return;
        }

        setCards(nextCards);
        setCurrentIndex(0);
        setResults([]);
        setIsAnswerVisible(false);
        setHasSavedResults(false);
        setStatus("idle");
        setError("");
      })
      .catch((caughtError) => {
        if (!isMounted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not prepare flashcards.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [session?.user.id]);

  function startExercise() {
    setCurrentIndex(0);
    setResults([]);
    setIsAnswerVisible(false);
    setHasSavedResults(false);
    setStatus("active");
    setError("");
  }

  function cancelExercise() {
    setCurrentIndex(0);
    setResults([]);
    setIsAnswerVisible(false);
    setHasSavedResults(false);
    setStatus("idle");
    setError("");
  }

  function gradeCurrentCard(grade: ReviewGrade) {
    if (!currentCard) {
      return;
    }

    const nextResults = [
      ...results,
      {
        item_id: currentCard.item_id,
        item_type: currentCard.item_type,
        grade,
      },
    ];

    setResults(nextResults);
    setIsAnswerVisible(false);

    if (currentIndex + 1 >= cards.length) {
      setStatus("finished");
      void saveExerciseResults(nextResults);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  async function saveExerciseResults(nextResults = results) {
    if (!session?.user.id || nextResults.length !== cards.length) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await saveReviewResults(session.user.id, nextResults);
      setHasSavedResults(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not save review results.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Preparing flashcards...
      </p>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-950">
          No flashcards available
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add vocabulary, sentences, or grammar notes before starting a flashcard
          exercise.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {status === "idle" ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Flashcards
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Practice {cards.length} random cards from vocabulary, sentences,
                and grammar notes.
              </p>
              {cards.length < FLASHCARD_COUNT ? (
                <p className="mt-1 text-xs text-amber-700">
                  Add more study material to reach a full 10-card exercise.
                </p>
              ) : null}
            </div>

            <Button type="button" onClick={startExercise}>
              Start exercise
            </Button>
          </div>
        </div>
      ) : null}

      {status === "active" && currentCard ? (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600">
              {currentCard.title}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Prompt
              </p>
              <p className="mt-2 whitespace-pre-wrap text-2xl font-semibold leading-9 text-slate-950">
                {currentCard.prompt}
              </p>
            </div>

            {isAnswerVisible ? (
              <div className="rounded-lg bg-stone-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Answer
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {currentCard.answer}
                </p>
              </div>
            ) : null}

            {!isAnswerVisible ? (
              <Button type="button" onClick={() => setIsAnswerVisible(true)}>
                Show answer
              </Button>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3">
                {gradeOptions.map((option) => (
                  <Button
                    key={option.grade}
                    className={option.className}
                    type="button"
                    onClick={() => gradeCurrentCard(option.grade)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                className="!bg-white !text-slate-700 ring-1 ring-inset ring-slate-300 hover:!bg-stone-100"
                type="button"
                onClick={startExercise}
              >
                Restart
              </Button>
              <Button
                className="!bg-red-50 !text-red-800 ring-1 ring-inset ring-red-200 hover:!bg-red-100"
                type="button"
                onClick={cancelExercise}
              >
                Cancel
              </Button>
            </div>
          </div>
        </article>
      ) : null}

      {status === "finished" ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            Exercise complete
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">Correct</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900">
                {gradeSummary.correct}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-700">
                Almost Correct
              </p>
              <p className="mt-1 text-2xl font-semibold text-amber-900">
                {gradeSummary.almostCorrect}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">Wrong</p>
              <p className="mt-1 text-2xl font-semibold text-red-900">
                {gradeSummary.wrong}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              disabled={isSaving || !isComplete || hasSavedResults}
              type="button"
              onClick={() => saveExerciseResults()}
            >
              {isSaving
                ? "Saving..."
                : hasSavedResults
                  ? "Results saved"
                  : "Retry save"}
            </Button>
            <Button
              className="!bg-stone-100 !text-slate-800 ring-1 ring-inset ring-slate-300 hover:!bg-stone-200"
              type="button"
              onClick={loadCards}
            >
              New random set
            </Button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
