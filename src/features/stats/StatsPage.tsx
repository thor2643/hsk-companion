import { Card } from '../../components/ui/Card'

export function StatsPage() {
  return (
    <div className="space-y-6">
      <Card title="Study progress">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Accuracy</p>
            <p className="text-2xl font-semibold">82%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Reviews</p>
            <p className="text-2xl font-semibold">143</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Streak</p>
            <p className="text-2xl font-semibold">7 days</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StatsPage
