import { supabase } from "../../lib/supabaseClient";
import type {
  SentenceItem,
  SentenceItemInput,
  SentenceItemUpdate,
} from "./sentence.types";

const TABLE_NAME = "sentences";

export async function listSentences(userId: string): Promise<SentenceItem[]> {
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

export async function createSentenceItem(
  userId: string,
  input: SentenceItemInput,
): Promise<SentenceItem> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      hanzi: input.hanzi?.trim() ?? "",
      pinyin: input.pinyin.trim(),
      translation: input.translation.trim(),
      hsk_level: input.hsk_level ?? null,
      lesson: input.lesson?.trim() || null,
      notes: input.notes?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSentenceItem(
  userId: string,
  itemId: string,
  input: SentenceItemUpdate,
): Promise<SentenceItem> {
  const updates: SentenceItemUpdate = {};

  if (input.hanzi !== undefined) {
    updates.hanzi = input.hanzi.trim();
  }

  if (input.pinyin !== undefined) {
    updates.pinyin = input.pinyin.trim();
  }

  if (input.translation !== undefined) {
    updates.translation = input.translation.trim();
  }

  if (input.hsk_level !== undefined) {
    updates.hsk_level = input.hsk_level;
  }

  if (input.lesson !== undefined) {
    updates.lesson = input.lesson?.trim() || null;
  }

  if (input.notes !== undefined) {
    updates.notes = input.notes.trim();
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

export async function softDeleteSentenceItem(
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
