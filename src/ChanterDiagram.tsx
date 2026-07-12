type Props = {
  covered: boolean[]
}

const HOLE_Y = [70, 108, 146, 184, 232, 270, 308, 346]

export function ChanterDiagram({ covered }: Props) {
  return (
    <svg viewBox="0 0 200 420" width="200" height="420" role="img" aria-label="Chanter fingering diagram">
      <rect x="45" y="18" width="50" height="30" rx="6" className="chanter-reed" />
      <rect x="50" y="42" width="40" height="360" rx="14" className="chanter-body" />

      {HOLE_Y.map((y, i) => (
        <circle
          key={i}
          cx="70"
          cy={y}
          r="12"
          className={covered[i] ? 'hole hole-covered' : 'hole hole-open'}
        />
      ))}

      <text x="118" y="130" className="hand-label">
        Top hand
      </text>
      <line x1="100" y1="60" x2="100" y2="196" className="hand-bracket" />

      <text x="118" y="290" className="hand-label">
        Bottom hand
      </text>
      <line x1="100" y1="222" x2="100" y2="358" className="hand-bracket" />
    </svg>
  )
}
