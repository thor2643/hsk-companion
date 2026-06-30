import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'

export function GrammarForm() {
  return (
    <Card title="Add grammar point">
      <div className="space-y-4">
        <Input placeholder="Rule name" />
        <Textarea placeholder="Explanation" />
        <Input placeholder="Example" />
        <Button>Save grammar</Button>
      </div>
    </Card>
  )
}

export default GrammarForm
