import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/vocabulary', label: 'Vocab' },
  { to: '/training', label: 'Train' },
  { to: '/stats', label: 'Stats' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/90 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl justify-around px-4 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-sky-600 text-white' : 'text-slate-600'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
