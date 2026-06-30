import { BarChart3, BookOpen, Dumbbell, Home, PlusCircle, Settings } from 'lucide-react'

export const navItems = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: Home },
  { to: '/add', label: 'Add', shortLabel: 'Add', icon: PlusCircle },
  { to: '/library', label: 'Library', shortLabel: 'Library', icon: BookOpen },
  { to: '/training', label: 'Training', shortLabel: 'Train', icon: Dumbbell },
  { to: '/stats', label: 'Stats', shortLabel: 'Stats', icon: BarChart3 },
  { to: '/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
] as const
