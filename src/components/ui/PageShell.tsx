import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-rose-700">HSK Companion</p>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      </header>
      {children}
    </div>
  )
}
