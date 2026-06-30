import { NavLink } from 'react-router-dom'
import { navItems } from './navigation'

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-6 px-2 py-2">
        {navItems.map(({ icon: Icon, shortLabel, ...link }) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.68rem] font-medium transition ${
                isActive ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="truncate">{shortLabel ?? link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
