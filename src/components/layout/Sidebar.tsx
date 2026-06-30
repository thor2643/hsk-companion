import { NavLink } from 'react-router-dom'
import { navItems } from './navigation'

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">HSK Companion</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Study Desk</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ icon: Icon, ...link }) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-stone-100 hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
