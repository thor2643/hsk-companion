import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout
