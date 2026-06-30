import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function LibraryPage() {
  return (
    <PageShell title="Library" description="A browsable home for saved study material.">
      <PlaceholderPanel
        title="Collection foundation"
        description="Lists, filters, and item detail views can be layered into this page without changing the route."
      />
    </PageShell>
  )
}
