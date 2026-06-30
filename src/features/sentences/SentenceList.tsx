import { Card } from '../../components/ui/Card'

export function SentenceList() {
  return (
    <Card title="Sentences">
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="font-semibold">你好吗？</p>
          <p className="text-sm text-slate-500">How are you?</p>
        </div>
      </div>
    </Card>
  )
}

export default SentenceList
