type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return <span className={`rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ${className}`}>{children}</span>
}

export default Badge
