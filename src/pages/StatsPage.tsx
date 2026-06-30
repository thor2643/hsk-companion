import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function StatsPage() {
  return (
    <PageShell title="Stats" description="A place for progress, streaks, and study patterns.">
      <PlaceholderPanel
        title="Analytics foundation"
        description="Charts and learning metrics can be added after tracking events and review history are defined."
      />
    </PageShell>
  )
}
