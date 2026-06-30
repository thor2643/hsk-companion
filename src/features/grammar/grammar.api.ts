import type { GrammarPoint } from './grammar.types'

export async function fetchGrammar(): Promise<GrammarPoint[]> {
  return []
}

export async function createGrammar(item: Omit<GrammarPoint, 'id'>): Promise<GrammarPoint> {
  return { id: crypto.randomUUID(), ...item }
}
