import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function TrainingPage() {
  return (
    <PageShell title="Training" description="A focused area for practice modes and review sessions.">
      <PlaceholderPanel
        title="Practice foundation"
        description="Flashcards, translation drills, and spaced repetition sessions can be introduced here later."
      />
    </PageShell>
  )
}
