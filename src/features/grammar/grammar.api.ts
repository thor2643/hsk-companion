import { supabase } from "../../lib/supabaseClient";
import type {
  GrammarNote,
  GrammarNoteInput,
  GrammarNoteUpdate,
} from "./grammar.types";

const TABLE_NAME = "grammar_notes";

export async function listGrammarNotes(userId: string): Promise<GrammarNote[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createGrammarNote(
  userId: string,
  input: GrammarNoteInput,
): Promise<GrammarNote> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      title: input.title.trim(),
      pattern: input.pattern.trim(),
      explanation: input.explanation.trim(),
      examples: input.examples.trim(),
      common_mistakes: input.common_mistakes?.trim() || null,
      hsk_level: input.hsk_level ?? null,
      lesson: input.lesson?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateGrammarNote(
  userId: string,
  noteId: string,
  input: GrammarNoteUpdate,
): Promise<GrammarNote> {
  const updates: GrammarNoteUpdate = {};

  if (input.title !== undefined) {
    updates.title = input.title.trim();
  }

  if (input.pattern !== undefined) {
    updates.pattern = input.pattern.trim();
  }

  if (input.explanation !== undefined) {
    updates.explanation = input.explanation.trim();
  }

  if (input.examples !== undefined) {
    updates.examples = input.examples.trim();
  }

  if (input.common_mistakes !== undefined) {
    updates.common_mistakes = input.common_mistakes.trim();
  }

  if (input.hsk_level !== undefined) {
    updates.hsk_level = input.hsk_level;
  }

  if (input.lesson !== undefined) {
    updates.lesson = input.lesson?.trim() || null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq("id", noteId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function softDeleteGrammarNote(
  userId: string,
  noteId: string,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", noteId)
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}
