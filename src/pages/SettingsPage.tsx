import { Input } from '../components/ui/Input'
import { PageShell } from '../components/ui/PageShell'
import { useDefaultHskLevel } from '../settings/appSettings'

export function SettingsPage() {
  const { defaultHskLevel, updateDefaultHskLevel } = useDefaultHskLevel()

  return (
    <PageShell title="Settings" description="Adjust defaults used when creating new study material.">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[1fr_10rem] sm:items-end">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Vocabulary defaults</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              New vocabulary items will use this HSK level unless you change it in the form.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Default HSK level</span>
            <Input
              max={6}
              min={1}
              onChange={(event) => updateDefaultHskLevel(Number(event.target.value))}
              type="number"
              value={defaultHskLevel}
            />
          </label>
        </div>
      </section>
    </PageShell>
  )
}
