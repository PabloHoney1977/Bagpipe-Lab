import type { ReactNode } from 'react'

/** A highlighted aside — tip, warning, or key idea. */
export function Callout({
  kind = 'tip',
  title,
  children,
}: {
  kind?: 'tip' | 'warning' | 'why'
  title?: string
  children: ReactNode
}) {
  const label = title ?? (kind === 'tip' ? 'Tip' : kind === 'warning' ? 'Watch out' : 'Why it matters')
  return (
    <aside className={`callout callout-${kind}`}>
      <p className="callout-label">{label}</p>
      <div className="callout-body">{children}</div>
    </aside>
  )
}

/** A numbered sequence of steps. */
export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="steps">
      {items.map((item, i) => (
        <li key={i} className="step">
          <span className="step-num">{i + 1}</span>
          <div className="step-body">{item}</div>
        </li>
      ))}
    </ol>
  )
}

/** A figure: a diagram/visual with a caption underneath. */
export function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="figure">
      <div className="figure-media">{children}</div>
      {caption ? <figcaption className="figure-caption">{caption}</figcaption> : null}
    </figure>
  )
}

/** Placeholder body for lessons that aren't built yet. */
export function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <div className="prose">
      <div className="coming-soon">
        <p className="coming-soon-tag">Coming soon</p>
        <div>{children}</div>
      </div>
    </div>
  )
}

/** A short list of labelled facts (e.g. anatomy parts). */
export function FactList({ items }: { items: { term: string; detail: ReactNode }[] }) {
  return (
    <dl className="fact-list">
      {items.map((it) => (
        <div key={it.term} className="fact">
          <dt className="fact-term">{it.term}</dt>
          <dd className="fact-detail">{it.detail}</dd>
        </div>
      ))}
    </dl>
  )
}
