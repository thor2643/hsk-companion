import type { GrammarNote } from "../grammar/grammar.types";
import type { SentenceItem } from "../sentences/sentence.types";
import type { VocabularyItem } from "../vocabulary/vocabulary.types";
import type { Flashcard } from "./training.types";

const FLASHCARD_COUNT = 10;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function compactLines(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean).join("\n\n");
}

function uniqueFlashcards(cards: Flashcard[]) {
  const seenCardIds = new Set<string>();

  return cards.filter((card) => {
    if (seenCardIds.has(card.id)) {
      return false;
    }

    seenCardIds.add(card.id);
    return true;
  });
}

export function createFlashcards(
  vocabulary: VocabularyItem[],
  sentences: SentenceItem[],
  grammarNotes: GrammarNote[],
) {
  const vocabularyCards: Flashcard[] = vocabulary.map((item) => ({
    id: `vocabulary:${item.id}`,
    item_id: item.id,
    item_type: "vocabulary",
    title: "Vocabulary",
    prompt: compactLines([item.hanzi, item.pinyin]),
    answer: compactLines([
      item.meaning,
      item.notes,
    ]),
  }));

  const sentenceCards: Flashcard[] = sentences.map((item) => ({
    id: `sentence:${item.id}`,
    item_id: item.id,
    item_type: "sentence",
    title: "Sentence",
    prompt: compactLines([item.hanzi, item.pinyin]),
    answer: compactLines([
      item.translation,
      item.notes,
    ]),
  }));

  const grammarCards: Flashcard[] = grammarNotes.map((note) => ({
    id: `grammar:${note.id}`,
    item_id: note.id,
    item_type: "grammar",
    title: "Grammar",
    prompt: compactLines([note.title, note.pattern]),
    answer: compactLines([
      note.explanation,
      `Examples:\n${note.examples}`,
      note.common_mistakes ? `Common mistakes:\n${note.common_mistakes}` : null,
    ]),
  }));

  return shuffle(
    uniqueFlashcards([...vocabularyCards, ...sentenceCards, ...grammarCards]),
  ).slice(0, FLASHCARD_COUNT);
}

export { FLASHCARD_COUNT };
