import { PageShell } from '../components/ui/PageShell'
import { VocabularyList } from '../features/vocabulary/VocabularyList'

export function LibraryPage() {
  return (
    <PageShell title="Library" description="Browse and maintain the vocabulary you have saved.">
      <VocabularyList />
    </PageShell>
  )
}
