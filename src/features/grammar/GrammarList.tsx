import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import {
  listGrammarNotes,
  softDeleteGrammarNote,
  updateGrammarNote,
} from "./grammar.api";
import type { GrammarNote, GrammarNoteUpdate } from "./grammar.types";

type GrammarEditDraft = {
  title: string;
  pattern: string;
  explanation: string;
  examples: string;
  common_mistakes: string;
  lesson: string;
};

export function GrammarList() {
  const { session } = useAuth();
  const [notes, setNotes] = useState<GrammarNote[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<GrammarEditDraft | null>(null);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    let isMounted = true;

    listGrammarNotes(session.user.id)
      .then((nextNotes) => {
        if (isMounted) {
          setNotes(nextNotes);
          setError("");
        }
      })
      .catch((caughtError) => {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load grammar notes.",
          );
        }
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

  function startEditing(note: GrammarNote) {
    setEditingNoteId(note.id);
    setEditDraft({
      title: note.title,
      pattern: note.pattern,
      explanation: note.explanation,
      examples: note.examples,
      common_mistakes: note.common_mistakes ?? "",
      lesson: note.lesson ?? "",
    });
  }

  function stopEditing() {
    setEditingNoteId(null);
    setEditDraft(null);
  }

  function updateDraft(field: keyof GrammarEditDraft, value: string) {
    setEditDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [field]: value } : currentDraft,
    );
  }

  async function handleQuickUpdate(note: GrammarNote) {
    if (!session?.user.id || !editDraft) {
      return;
    }

    const updates: GrammarNoteUpdate = {
      title: editDraft.title,
      pattern: editDraft.pattern,
      explanation: editDraft.explanation,
      examples: editDraft.examples,
      common_mistakes: editDraft.common_mistakes,
      hsk_level: note.hsk_level,
      lesson: editDraft.lesson,
    };

    try {
      const updatedNote = await updateGrammarNote(
        session.user.id,
        note.id,
        updates,
      );

      setNotes((currentNotes) =>
        currentNotes.map((currentNote) =>
          currentNote.id === note.id ? updatedNote : currentNote,
        ),
      );
      stopEditing();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not update grammar note.",
      );
    }
  }

  async function handleSoftDelete(noteId: string) {
    if (!session?.user.id) {
      return;
    }

    try {
      await softDeleteGrammarNote(session.user.id, noteId);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete grammar note.",
      );
    }
  }

  if (isLoading) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Loading grammar notes...
      </p>
    );
  }

  return (
    <section className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">
            No grammar notes yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your first grammar note from the Add page.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {notes.map((note) => {
            const isEditing = editingNoteId === note.id;

            return (
              <article
                key={note.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    {isEditing ? (
                      <div className="grid gap-3">
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("title", event.target.value)
                          }
                          value={editDraft?.title ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("pattern", event.target.value)
                          }
                          value={editDraft?.pattern ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("explanation", event.target.value)
                          }
                          value={editDraft?.explanation ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("examples", event.target.value)
                          }
                          value={editDraft?.examples ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("common_mistakes", event.target.value)
                          }
                          placeholder="Common mistakes"
                          value={editDraft?.common_mistakes ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("lesson", event.target.value)
                          }
                          placeholder="Lesson or type"
                          value={editDraft?.lesson ?? ""}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">
                            {note.title}
                          </h3>
                          <p className="mt-1 font-mono text-sm text-rose-700">
                            {note.pattern}
                          </p>
                        </div>
                        <p className="text-sm leading-6 text-slate-700">
                          {note.explanation}
                        </p>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Examples
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {note.examples}
                          </p>
                        </div>
                        {note.common_mistakes ? (
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-500">
                              Common mistakes
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                              {note.common_mistakes}
                            </p>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <Button
                        type="button"
                        onClick={() => handleQuickUpdate(note)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => startEditing(note)}
                      >
                        Edit
                      </Button>
                    )}
                    {isEditing ? (
                      <Button
                        className="bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-stone-100"
                        type="button"
                        onClick={stopEditing}
                      >
                        Cancel
                      </Button>
                    ) : null}
                    <Button
                      className="bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                      type="button"
                      onClick={() => handleSoftDelete(note.id)}
                    >
                      Delete note
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
