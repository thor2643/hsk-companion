import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { getDefaultHskLevel } from "../../settings/appSettings";
import { createSentenceItem } from "./sentence.api";
import type { SentenceItem } from "./sentence.types";

type SentenceFormProps = {
  onCreated?: (item: SentenceItem) => void;
};

export function SentenceForm({ onCreated }: SentenceFormProps) {
  const { session } = useAuth();
  const [hanzi, setHanzi] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [translation, setTranslation] = useState("");
  const [hskLevel, setHskLevel] = useState(() => String(getDefaultHskLevel()));
  const [lesson, setLesson] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.user.id) {
      setError("You need to be signed in to add sentences.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const item = await createSentenceItem(session.user.id, {
        hanzi,
        pinyin,
        translation,
        hsk_level: hskLevel ? Number(hskLevel) : null,
        lesson,
        notes,
      });

      setHanzi("");
      setPinyin("");
      setTranslation("");
      setHskLevel(String(getDefaultHskLevel()));
      setLesson("");
      setNotes("");
      setMessage("Sentence added.");
      onCreated?.(item);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not add sentence.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Hanzi</span>
        <Textarea
          onChange={(event) => setHanzi(event.target.value)}
          value={hanzi}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Pinyin</span>
        <Textarea
          onChange={(event) => setPinyin(event.target.value)}
          required
          value={pinyin}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Translation</span>
        <Textarea
          onChange={(event) => setTranslation(event.target.value)}
          required
          value={translation}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">HSK level</span>
          <Input
            max={6}
            min={1}
            onChange={(event) => setHskLevel(event.target.value)}
            type="number"
            value={hskLevel}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Lesson or type</span>
          <Input
            onChange={(event) => setLesson(event.target.value)}
            placeholder="Lesson 3, textbook, exam prep..."
            value={lesson}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <Textarea onChange={(event) => setNotes(event.target.value)} value={notes} />
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Adding..." : "Add sentence"}
      </Button>
    </form>
  );
}
