import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function AddPage() {
  return (
    <PageShell title="Add" description="A dedicated workspace for creating new vocabulary, sentences, and notes.">
      <PlaceholderPanel
        title="Content entry foundation"
        description="Forms and capture flows will be added here once the data model is ready."
      />
    </PageShell>
  )
}
