import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function HomePage() {
  return (
    <PageShell title="Home" description="A calm starting point for daily Chinese study sessions.">
      <PlaceholderPanel
        title="Dashboard foundation"
        description="Future study summaries, next actions, and recently touched material can live here."
      />
    </PageShell>
  )
}
