import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title ? <h3 className="mb-4 text-lg font-semibold">{title}</h3> : null}
      {children}
    </section>
  )
}

export default Card
