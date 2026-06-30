import { PlaceholderPanel } from '../components/ui/PlaceholderPanel'
import { PageShell } from '../components/ui/PageShell'

export function SettingsPage() {
  return (
    <PageShell title="Settings" description="App preferences and account-related configuration will live here.">
      <PlaceholderPanel
        title="Preferences foundation"
        description="Theme, study goals, and Supabase-backed account settings can be added when those flows are ready."
      />
    </PageShell>
  )
}
