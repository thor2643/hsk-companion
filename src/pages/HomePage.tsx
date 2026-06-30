import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { PageShell } from "../components/ui/PageShell";
import { listSentences } from "../features/sentences/sentence.api";
import type { SentenceItem } from "../features/sentences/sentence.types";
import {
  listReviewEvents,
  type ReviewEventRow,
} from "../features/training/reviewEvents.api";
import { listVocabulary } from "../features/vocabulary/vocabulary.api";
import type { VocabularyItem } from "../features/vocabulary/vocabulary.types";

type DashboardItem = {
  id: string;
  type: "vocabulary" | "sentence";
  label: string;
  detail: string;
  correct: number;
  almostCorrect: number;
  wrong: number;
  total: number;
  strengthScore: number;
  focusScore: number;
};

const typeLabels: Record<DashboardItem["type"], string> = {
  vocabulary: "Word",
  sentence: "Sentence",
};

function count(value: number | null) {
  return value ?? 0;
}

function vocabularyLabel(item: VocabularyItem) {
  return item.hanzi || item.pinyin;
}

function sentenceLabel(item: SentenceItem) {
  return item.hanzi || item.pinyin;
}

function buildDashboardItems(
  vocabulary: VocabularyItem[],
  sentences: SentenceItem[],
  reviews: ReviewEventRow[],
) {
  const vocabularyById = new Map(vocabulary.map((item) => [item.id, item]));
  const sentenceById = new Map(sentences.map((item) => [item.id, item]));

  return reviews.flatMap<DashboardItem>((review) => {
    const correct = count(review.correct_count);
    const almostCorrect = count(review.almost_correct_count);
    const wrong = count(review.wrong_count);
    const total = correct + almostCorrect + wrong;

    if (total === 0) {
      return [];
    }

    if (review.item_type === "vocabulary") {
      const item = vocabularyById.get(review.item_id);

      if (!item) {
        return [];
      }

      return [
        {
          id: item.id,
          type: "vocabulary",
          label: vocabularyLabel(item),
          detail: item.meaning,
          correct,
          almostCorrect,
          wrong,
          total,
          strengthScore: (correct + almostCorrect * 0.5) / total,
          focusScore: (wrong + almostCorrect * 0.5) / total,
        },
      ];
    }

    if (review.item_type === "sentence") {
      const item = sentenceById.get(review.item_id);

      if (!item) {
        return [];
      }

      return [
        {
          id: item.id,
          type: "sentence",
          label: sentenceLabel(item),
          detail: item.translation,
          correct,
          almostCorrect,
          wrong,
          total,
          strengthScore: (correct + almostCorrect * 0.5) / total,
          focusScore: (wrong + almostCorrect * 0.5) / total,
        },
      ];
    }

    return [];
  });
}

export function HomePage() {
  const { session } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [reviews, setReviews] = useState<ReviewEventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = session?.user.id;

    if (!userId) {
      return;
    }

    let isMounted = true;

    Promise.all([
      listVocabulary(userId),
      listSentences(userId),
      listReviewEvents(userId),
    ])
      .then(([nextVocabulary, nextSentences, nextReviews]) => {
        if (!isMounted) {
          return;
        }

        setVocabulary(nextVocabulary);
        setSentences(nextSentences);
        setReviews(nextReviews);
        setError("");
      })
      .catch((caughtError) => {
        if (!isMounted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not load home stats.",
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

  const dashboardItems = useMemo(
    () => buildDashboardItems(vocabulary, sentences, reviews),
    [reviews, sentences, vocabulary],
  );

  const bestWords = useMemo(
    () =>
      dashboardItems
        .filter((item) => item.type === "vocabulary")
        .sort((a, b) => b.strengthScore - a.strengthScore || b.total - a.total)
        .slice(0, 4),
    [dashboardItems],
  );

  const focusItems = useMemo(
    () =>
      dashboardItems
        .sort((a, b) => b.focusScore - a.focusScore || b.total - a.total)
        .slice(0, 5),
    [dashboardItems],
  );

  const totalReviews = reviews.reduce(
    (sum, review) =>
      sum +
      count(review.correct_count) +
      count(review.almost_correct_count) +
      count(review.wrong_count),
    0,
  );

  return (
    <PageShell
      title="Nǐ hǎo, Thor"
      description="A quick look at your Chinese study library and recent review patterns."
    >
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Words</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {vocabulary.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Sentences</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {sentences.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Reviews</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {totalReviews}
          </p>
        </div>
      </section>

      {isLoading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Loading your study stats...
        </p>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          <DashboardPanel
            emptyText="Complete a flashcard exercise to see your strongest words."
            items={bestWords}
            title="Words you know best"
          />
          <DashboardPanel
            emptyText="Your focus list will appear after a few reviewed cards."
            items={focusItems}
            title="Needs more focus"
          />
        </section>
      )}
    </PageShell>
  );
}

type DashboardPanelProps = {
  title: string;
  emptyText: string;
  items: DashboardItem[];
};

function DashboardPanel({ title, emptyText, items }: DashboardPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <article
              className="rounded-lg border border-slate-100 bg-stone-50 p-4"
              key={`${item.type}:${item.id}`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <p className="text-base font-semibold text-slate-950">
                    {item.label}
                  </p>
                  <span className="inline-flex min-w-20 shrink-0 justify-center whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                    {typeLabels[item.type]}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {item.correct} correct
                </span>
                <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-yellow-700">
                  {item.almostCorrect} almost
                </span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                  {item.wrong} wrong
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
