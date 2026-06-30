import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card title="Sign in" className="w-full max-w-md">
        <div className="space-y-4">
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Continue</Button>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
