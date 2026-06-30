import { PageShell } from '../components/ui/PageShell'
import { VocabularyForm } from '../features/vocabulary/VocabularyForm'

export function AddPage() {
  return (
    <PageShell title="Add" description="Create vocabulary items for your personal study library.">
      <VocabularyForm />
    </PageShell>
  )
}
