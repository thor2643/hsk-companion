import { useState } from 'react'
import { PageShell } from '../components/ui/PageShell'
import { FlashcardExercise } from '../features/training/FlashcardExercise'

type TrainingCategory = 'flashcards'

export function TrainingPage() {
  const [activeCategory] = useState<TrainingCategory>('flashcards')

  return (
    <PageShell title="Training" description="Practice with exercise modes built from your saved study material.">
      <div className="grid grid-cols-1 rounded-lg bg-stone-100 p-1 sm:max-w-xs">
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            activeCategory === 'flashcards'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Flashcards
        </button>
      </div>

      {activeCategory === 'flashcards' ? <FlashcardExercise /> : null}
    </PageShell>
  )
}
