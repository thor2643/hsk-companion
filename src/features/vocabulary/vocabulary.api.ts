import type { VocabularyItem } from './vocabulary.types'

export async function fetchVocabulary(): Promise<VocabularyItem[]> {
  return []
}

export async function createVocabulary(item: Omit<VocabularyItem, 'id'>): Promise<VocabularyItem> {
  return { id: crypto.randomUUID(), ...item }
}
