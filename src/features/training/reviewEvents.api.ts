import { supabase } from "../../lib/supabaseClient";
import type { FlashcardReviewResult, TrainingItemType } from "./training.types";

const TABLE_NAME = "review_events";

export type ReviewEventRow = {
  id: string;
  user_id: string;
  item_id: string;
  item_type: TrainingItemType;
  correct_count: number | null;
  almost_correct_count: number | null;
  wrong_count: number | null;
};

type ReviewEventIncrement = {
  item_id: string;
  item_type: TrainingItemType;
  correct_count: number;
  almost_correct_count: number;
  wrong_count: number;
};

function aggregateResults(results: FlashcardReviewResult[]) {
  const increments = new Map<string, ReviewEventIncrement>();

  for (const result of results) {
    const key = `${result.item_type}:${result.item_id}`;
    const current = increments.get(key) ?? {
      item_id: result.item_id,
      item_type: result.item_type,
      correct_count: 0,
      almost_correct_count: 0,
      wrong_count: 0,
    };

    if (result.grade === "correct") {
      current.correct_count += 1;
    }

    if (result.grade === "almost_correct") {
      current.almost_correct_count += 1;
    }

    if (result.grade === "wrong") {
      current.wrong_count += 1;
    }

    increments.set(key, current);
  }

  return Array.from(increments.values());
}

export async function listReviewEvents(userId: string): Promise<ReviewEventRow[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id,user_id,item_id,item_type,correct_count,almost_correct_count,wrong_count")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function saveReviewResults(
  userId: string,
  results: FlashcardReviewResult[],
) {
  const increments = aggregateResults(results);

  for (const increment of increments) {
    const { data: existingRow, error: loadError } = await supabase
      .from(TABLE_NAME)
      .select(
        "id,user_id,item_id,item_type,correct_count,almost_correct_count,wrong_count",
      )
      .eq("user_id", userId)
      .eq("item_id", increment.item_id)
      .eq("item_type", increment.item_type)
      .maybeSingle<ReviewEventRow>();

    if (loadError) {
      throw loadError;
    }

    if (existingRow) {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          correct_count:
            (existingRow.correct_count ?? 0) + increment.correct_count,
          almost_correct_count:
            (existingRow.almost_correct_count ?? 0) +
            increment.almost_correct_count,
          wrong_count: (existingRow.wrong_count ?? 0) + increment.wrong_count,
        })
        .eq("id", existingRow.id)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      continue;
    }

    const { error } = await supabase.from(TABLE_NAME).insert({
      user_id: userId,
      item_id: increment.item_id,
      item_type: increment.item_type,
      correct_count: increment.correct_count,
      almost_correct_count: increment.almost_correct_count,
      wrong_count: increment.wrong_count,
    });

    if (error) {
      throw error;
    }
  }
}
