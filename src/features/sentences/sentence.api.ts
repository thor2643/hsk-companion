import type { SentenceItem } from './sentence.types'

export async function fetchSentences(): Promise<SentenceItem[]> {
  return []
}

export async function createSentence(item: Omit<SentenceItem, 'id'>): Promise<SentenceItem> {
  return { id: crypto.randomUUID(), ...item }
}
