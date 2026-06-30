import { PageShell } from '../components/ui/PageShell'
import { FlashcardExercise } from '../features/training/FlashcardExercise'

export function TrainingPage() {
  return (
    <PageShell title="Training" description="Practice with exercise modes built from your saved study material.">
      <FlashcardExercise />
    </PageShell>
  )
}
