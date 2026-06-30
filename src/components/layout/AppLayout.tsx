import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 pb-24 lg:p-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout
