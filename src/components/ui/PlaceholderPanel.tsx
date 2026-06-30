type PlaceholderPanelProps = {
  title: string
  description: string
}

export function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </section>
  )
}
