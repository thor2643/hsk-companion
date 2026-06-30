import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export function VocabularyList() {
  return (
    <div className="space-y-4">
      <Card title="Vocabulary">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-semibold">学习</p>
              <p className="text-sm text-slate-500">xuéxí · to study</p>
            </div>
            <Badge>HSK 3</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-semibold">朋友</p>
              <p className="text-sm text-slate-500">péngyou · friend</p>
            </div>
            <Badge>HSK 2</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default VocabularyList
