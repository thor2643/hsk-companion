import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function TrainingPage() {
  return (
    <div className="space-y-6">
      <Card title="Training modes">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">Flashcards</h3>
            <p className="mt-2 text-sm text-slate-600">Review vocabulary with spaced repetition.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">Translation</h3>
            <p className="mt-2 text-sm text-slate-600">Translate Chinese into English and vice versa.</p>
          </div>
        </div>
      </Card>
      <Button>Start session</Button>
    </div>
  )
}

export default TrainingPage
