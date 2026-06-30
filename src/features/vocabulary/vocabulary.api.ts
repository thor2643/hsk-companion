import { supabase } from "../../lib/supabaseClient";
import type {
  VocabularyItem,
  VocabularyItemInput,
  VocabularyItemUpdate,
} from "./vocabulary.types";

const TABLE_NAME = "vocabulary";

export async function listVocabulary(
  userId: string,
): Promise<VocabularyItem[]> {
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

export async function createVocabularyItem(
  userId: string,
  input: VocabularyItemInput,
): Promise<VocabularyItem> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      hanzi: input.hanzi?.trim() || null,
      pinyin: input.pinyin.trim(),
      meaning: input.meaning.trim(),
      notes: input.notes?.trim() || null,
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

export async function updateVocabularyItem(
  userId: string,
  itemId: string,
  input: VocabularyItemUpdate,
): Promise<VocabularyItem> {
  const updates: VocabularyItemUpdate = {};

  if (input.hanzi !== undefined) {
    updates.hanzi = input.hanzi?.trim() || null;
  }

  if (input.pinyin !== undefined) {
    updates.pinyin = input.pinyin.trim();
  }

  if (input.meaning !== undefined) {
    updates.meaning = input.meaning.trim();
  }

  if (input.notes !== undefined) {
    updates.notes = input.notes.trim();
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
    .eq("id", itemId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function softDeleteVocabularyItem(
  userId: string,
  itemId: string,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}
