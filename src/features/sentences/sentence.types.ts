export type SentenceItem = {
  id: string;
  user_id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  hsk_level: number | null;
  lesson: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SentenceItemInput = {
  hanzi?: string;
  pinyin: string;
  translation: string;
  hsk_level?: number | null;
  lesson?: string | null;
  notes?: string;
};

export type SentenceItemUpdate = Partial<SentenceItemInput>;
