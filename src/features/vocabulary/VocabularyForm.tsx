import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'

export function VocabularyForm() {
  return (
    <Card title="Add vocabulary">
      <div className="space-y-4">
        <Input placeholder="Chinese" />
        <Input placeholder="Pinyin" />
        <Input placeholder="English" />
        <Textarea placeholder="Example sentence" />
        <Button>Add word</Button>
      </div>
    </Card>
  )
}

export default VocabularyForm
