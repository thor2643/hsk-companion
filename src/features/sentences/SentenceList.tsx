import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import {
  listSentences,
  softDeleteSentenceItem,
  updateSentenceItem,
} from "./sentence.api";
import type { SentenceItem, SentenceItemUpdate } from "./sentence.types";

type SentenceEditDraft = {
  hanzi: string;
  pinyin: string;
  translation: string;
  lesson: string;
  notes: string;
};

export function SentenceList() {
  const { session } = useAuth();
  const [items, setItems] = useState<SentenceItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<SentenceEditDraft | null>(null);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    let isMounted = true;

    listSentences(session.user.id)
      .then((nextItems) => {
        if (isMounted) {
          setItems(nextItems);
          setError("");
        }
      })
      .catch((caughtError) => {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load sentences.",
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

  function startEditing(item: SentenceItem) {
    setEditingItemId(item.id);
    setEditDraft({
      hanzi: item.hanzi ?? "",
      pinyin: item.pinyin,
      translation: item.translation,
      lesson: item.lesson ?? "",
      notes: item.notes ?? "",
    });
  }

  function stopEditing() {
    setEditingItemId(null);
    setEditDraft(null);
  }

  function updateDraft(field: keyof SentenceEditDraft, value: string) {
    setEditDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [field]: value } : currentDraft,
    );
  }

  async function handleQuickUpdate(item: SentenceItem) {
    if (!session?.user.id || !editDraft) {
      return;
    }

    const updates: SentenceItemUpdate = {
      hanzi: editDraft.hanzi,
      pinyin: editDraft.pinyin,
      translation: editDraft.translation,
      hsk_level: item.hsk_level,
      lesson: editDraft.lesson,
      notes: editDraft.notes,
    };

    try {
      const updatedItem = await updateSentenceItem(
        session.user.id,
        item.id,
        updates,
      );

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id ? updatedItem : currentItem,
        ),
      );
      stopEditing();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not update sentence.",
      );
    }
  }

  async function handleSoftDelete(itemId: string) {
    if (!session?.user.id) {
      return;
    }

    try {
      await softDeleteSentenceItem(session.user.id, itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete sentence.",
      );
    }
  }

  if (isLoading) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Loading sentences...
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

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">
            No sentences yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your first sentence from the Add page.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const isEditing = editingItemId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    {isEditing ? (
                      <div className="grid gap-3">
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("hanzi", event.target.value)
                          }
                          value={editDraft?.hanzi ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("pinyin", event.target.value)
                          }
                          value={editDraft?.pinyin ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("translation", event.target.value)
                          }
                          value={editDraft?.translation ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("lesson", event.target.value)
                          }
                          placeholder="Lesson or type"
                          value={editDraft?.lesson ?? ""}
                        />
                        <textarea
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("notes", event.target.value)
                          }
                          placeholder="Notes"
                          value={editDraft?.notes ?? ""}
                        />
                      </div>
                    ) : (
                      <>
                        {item.hanzi ? (
                          <h3 className="text-xl font-semibold leading-8 text-slate-950">
                            {item.hanzi}
                          </h3>
                        ) : null}
                        <p className="text-sm font-medium leading-6 text-rose-700">
                          {item.pinyin}
                        </p>
                        <p className="text-sm leading-6 text-slate-700">
                          {item.translation}
                        </p>
                        {item.notes ? (
                          <p className="text-sm leading-6 text-slate-500">
                            {item.notes}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <Button
                        type="button"
                        onClick={() => handleQuickUpdate(item)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => startEditing(item)}
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
                      onClick={() => handleSoftDelete(item.id)}
                    >
                      Delete sentence
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
