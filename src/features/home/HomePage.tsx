import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-slate-600">Keep your HSK study routine moving forward.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Today’s focus" className="space-y-3">
          <p className="text-sm text-slate-600">Review 10 vocabulary items and complete one grammar drill.</p>
          <div className="flex flex-wrap gap-2">
            <Badge>HSK 3</Badge>
            <Badge>Grammar</Badge>
            <Badge>Listening</Badge>
          </div>
        </Card>
        <Card title="Quick stats" className="space-y-3">
          <p className="text-sm text-slate-600">Streak: 7 days</p>
          <p className="text-sm text-slate-600">Words mastered: 124</p>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
