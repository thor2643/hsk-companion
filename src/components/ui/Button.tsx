import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
