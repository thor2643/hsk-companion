import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'

export function SentenceForm() {
  return (
    <Card title="Add sentence">
      <div className="space-y-4">
        <Input placeholder="Chinese sentence" />
        <Input placeholder="English translation" />
        <Textarea placeholder="Notes" />
        <Button>Save sentence</Button>
      </div>
    </Card>
  )
}

export default SentenceForm
