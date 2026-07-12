// Shows which finger covers which hole. Front holes labelled L1-L3 (top hand)
// and R1-R4 (bottom hand); the thumb hole sits on the back.
const FRONT = [
  { y: 92, label: 'L1', sub: 'left index' },
  { y: 128, label: 'L2', sub: 'left middle' },
  { y: 164, label: 'L3', sub: 'left ring' },
  { y: 236, label: 'R1', sub: 'right index' },
  { y: 272, label: 'R2', sub: 'right middle' },
  { y: 308, label: 'R3', sub: 'right ring' },
  { y: 344, label: 'R4', sub: 'right pinky' },
]

export function FingerMapDiagram() {
  return (
    <svg
      viewBox="0 0 340 400"
      width="320"
      height="376"
      role="img"
      aria-label="Which finger covers which hole"
      className="fingermap"
    >
      {/* cap + body + sole */}
      <rect x="104" y="10" width="40" height="26" rx="5" className="fm-part" />
      <rect x="108" y="36" width="32" height="336" className="fm-part" />
      <path d="M 108,352 L 108,372 Q 108,396 124,396 Q 140,396 140,372 L 140,352 Z" className="fm-part" />
      <rect x="103" y="198" width="42" height="5" className="fm-ring" />

      {/* thumb hole on the back */}
      <line x1="60" y1="74" x2="108" y2="78" className="fm-leader" />
      <circle cx="52" cy="74" r="10" className="fm-hole fm-thumb" />
      <text x="52" y="50" className="fm-label" textAnchor="middle">Left</text>
      <text x="52" y="64" className="fm-label" textAnchor="middle">thumb</text>

      {/* section headers, sitting in the clear space above each group */}
      <text x="176" y="60" className="fm-hand">TOP HAND</text>
      <text x="176" y="212" className="fm-hand">BOTTOM HAND</text>

      {/* front holes with labels to the right */}
      {FRONT.map((h) => (
        <g key={h.label}>
          <circle cx="124" cy={h.y} r="9" className="fm-hole" />
          <line x1="140" y1={h.y} x2="176" y2={h.y} className="fm-leader" />
          <text x="182" y={h.y - 1} className="fm-label">
            {h.label}
          </text>
          <text x="206" y={h.y - 1} className="fm-sub">
            {h.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}
