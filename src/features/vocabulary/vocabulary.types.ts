export type VocabularyItem = {
  id: string;
  user_id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes: string | null;
  hsk_level: number | null;
  lesson: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type VocabularyItemInput = {
  hanzi?: string | null;
  pinyin: string;
  meaning: string;
  notes?: string;
  hsk_level?: number | null;
  lesson?: string | null;
};

export type VocabularyItemUpdate = Partial<VocabularyItemInput>;
