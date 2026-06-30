export type GrammarNote = {
  id: string;
  user_id: string;
  title: string;
  pattern: string;
  explanation: string;
  examples: string;
  common_mistakes: string | null;
  hsk_level: number | null;
  lesson: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GrammarNoteInput = {
  title: string;
  pattern: string;
  explanation: string;
  examples: string;
  common_mistakes?: string;
  hsk_level?: number | null;
  lesson?: string | null;
};

export type GrammarNoteUpdate = Partial<GrammarNoteInput>;
