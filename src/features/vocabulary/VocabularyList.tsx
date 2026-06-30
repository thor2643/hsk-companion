import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../../components/ui/Button";
import {
  listVocabulary,
  softDeleteVocabularyItem,
  updateVocabularyItem,
} from "./vocabulary.api";
import type { VocabularyItem, VocabularyItemUpdate } from "./vocabulary.types";

type VocabularyEditDraft = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  lesson: string;
};

export function VocabularyList() {
  const { session } = useAuth();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<VocabularyEditDraft | null>(null);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    let isMounted = true;

    listVocabulary(session.user.id)
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
              : "Could not load vocabulary.",
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

  async function handleSoftDelete(itemId: string) {
    if (!session?.user.id) {
      return;
    }

    try {
      await softDeleteVocabularyItem(session.user.id, itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete vocabulary item.",
      );
    }
  }

  function startEditing(item: VocabularyItem) {
    setEditingItemId(item.id);
    setEditDraft({
      hanzi: item.hanzi ?? "",
      pinyin: item.pinyin,
      meaning: item.meaning,
      lesson: item.lesson ?? "",
    });
  }

  function stopEditing() {
    setEditingItemId(null);
    setEditDraft(null);
  }

  async function handleQuickUpdate(item: VocabularyItem) {
    if (!session?.user.id) {
      return;
    }

    if (!editDraft) {
      return;
    }

    const updates: VocabularyItemUpdate = {
      hanzi: editDraft.hanzi,
      pinyin: editDraft.pinyin,
      meaning: editDraft.meaning,
      notes: item.notes ?? "",
      hsk_level: item.hsk_level,
      lesson: editDraft.lesson,
    };

    try {
      const updatedItem = await updateVocabularyItem(
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
          : "Could not update vocabulary item.",
      );
    }
  }

  function updateDraft(field: keyof VocabularyEditDraft, value: string) {
    setEditDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [field]: value } : currentDraft,
    );
  }

  if (isLoading) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Loading vocabulary...
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
            No vocabulary yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your first word from the Add page.
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
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("hanzi", event.target.value)
                          }
                          value={editDraft?.hanzi ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          onChange={(event) =>
                            updateDraft("pinyin", event.target.value)
                          }
                          value={editDraft?.pinyin ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                          onChange={(event) =>
                            updateDraft("meaning", event.target.value)
                          }
                          value={editDraft?.meaning ?? ""}
                        />
                        <input
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                          onChange={(event) =>
                            updateDraft("lesson", event.target.value)
                          }
                          placeholder="Lesson or type"
                          value={editDraft?.lesson ?? ""}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="text-2xl font-semibold text-slate-950">
                            {item.hanzi}
                          </h3>
                          <p className="text-sm font-medium text-rose-700">
                            {item.pinyin}
                          </p>
                        </div>
                        <p className="text-sm leading-6 text-slate-700">
                          {item.meaning}
                        </p>
                        {item.notes ? (
                          <p className="text-sm leading-6 text-slate-500">
                            {item.notes}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
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
                      Delete word
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
