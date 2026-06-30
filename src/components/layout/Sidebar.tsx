import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/sentences', label: 'Sentences' },
  { to: '/grammar', label: 'Grammar' },
  { to: '/training', label: 'Training' },
  { to: '/stats', label: 'Stats' },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">HSK Companion</h2>
        <p className="text-sm text-slate-500">Your Chinese study hub</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
