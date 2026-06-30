import { Card } from '../../components/ui/Card'

export function GrammarList() {
  return (
    <Card title="Grammar points">
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="font-semibold">了</p>
          <p className="text-sm text-slate-500">Used to indicate a change or new situation.</p>
        </div>
      </div>
    </Card>
  )
}

export default GrammarList
