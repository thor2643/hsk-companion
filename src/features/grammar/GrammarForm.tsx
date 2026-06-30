import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { getDefaultHskLevel } from "../../settings/appSettings";
import { createGrammarNote } from "./grammar.api";
import type { GrammarNote } from "./grammar.types";

type GrammarFormProps = {
  onCreated?: (note: GrammarNote) => void;
};

export function GrammarForm({ onCreated }: GrammarFormProps) {
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [pattern, setPattern] = useState("");
  const [explanation, setExplanation] = useState("");
  const [examples, setExamples] = useState("");
  const [commonMistakes, setCommonMistakes] = useState("");
  const [hskLevel, setHskLevel] = useState(() => String(getDefaultHskLevel()));
  const [lesson, setLesson] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.user.id) {
      setError("You need to be signed in to add grammar notes.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const note = await createGrammarNote(session.user.id, {
        title,
        pattern,
        explanation,
        examples,
        common_mistakes: commonMistakes,
        hsk_level: hskLevel ? Number(hskLevel) : null,
        lesson,
      });

      setTitle("");
      setPattern("");
      setExplanation("");
      setExamples("");
      setCommonMistakes("");
      setHskLevel(String(getDefaultHskLevel()));
      setLesson("");
      setMessage("Grammar note added.");
      onCreated?.(note);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not add grammar note.",
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
        <span className="text-sm font-medium text-slate-700">Title</span>
        <Input
          onChange={(event) => setTitle(event.target.value)}
          required
          value={title}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Pattern</span>
        <Input
          onChange={(event) => setPattern(event.target.value)}
          required
          value={pattern}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Explanation</span>
        <Textarea
          onChange={(event) => setExplanation(event.target.value)}
          required
          value={explanation}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Examples</span>
        <Textarea
          onChange={(event) => setExamples(event.target.value)}
          required
          value={examples}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Common mistakes</span>
        <Textarea
          onChange={(event) => setCommonMistakes(event.target.value)}
          value={commonMistakes}
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
        {isSubmitting ? "Adding..." : "Add grammar note"}
      </Button>
    </form>
  );
}
