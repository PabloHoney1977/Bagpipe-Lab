type Props = {
  covered: boolean[]
}

// covered[0] = thumb (back hole), covered[1..3] = L1-L3 (top hand front),
// covered[4..7] = R1-R4 (bottom hand front, R4 = pinky/bottom-most).
const FRONT_HOLE_Y = [90, 122, 154, 214, 246, 278, 310]
const THUMB_HOLE = { x: 66, y: 82 }

export function ChanterDiagram({ covered }: Props) {
  const [thumb, ...front] = covered

  return (
    <svg viewBox="0 0 300 460" width="250" height="384" role="img" aria-label="Chanter fingering diagram">
      {/* reed/stock cap */}
      <rect x="100" y="6" width="40" height="28" rx="5" className="chanter-cap" />

      {/* main shaft */}
      <rect x="104" y="34" width="32" height="350" className="chanter-shaft" />

      {/* bell flare */}
      <path
        d="M 104,364 L 104,384 Q 104,420 118,420 L 122,420 Q 136,420 136,384 L 136,364 Z"
        className="chanter-bell"
      />

      {/* decorative turning rings */}
      <rect x="99" y="62" width="42" height="5" className="chanter-ring" />
      <rect x="99" y="182" width="42" height="5" className="chanter-ring" />
      <rect x="99" y="340" width="42" height="5" className="chanter-ring" />

      {/* thumb hole, on the back of the chanter */}
      <line
        x1={THUMB_HOLE.x + 11}
        y1={THUMB_HOLE.y}
        x2="104"
        y2={THUMB_HOLE.y + 4}
        className="chanter-leader"
      />
      <circle
        cx={THUMB_HOLE.x}
        cy={THUMB_HOLE.y}
        r="11"
        className={thumb ? 'hole hole-covered thumb-hole' : 'hole hole-open thumb-hole'}
      />
      <text x={THUMB_HOLE.x} y={THUMB_HOLE.y - 22} className="thumb-label">
        Thumb
      </text>
      <text x={THUMB_HOLE.x} y={THUMB_HOLE.y - 10} className="thumb-label">
        (back)
      </text>

      {/* front holes */}
      {FRONT_HOLE_Y.map((y, i) => (
        <circle
          key={i}
          cx="120"
          cy={y}
          r="12"
          className={front[i] ? 'hole hole-covered' : 'hole hole-open'}
        />
      ))}

      <text x="168" y="130" className="hand-label">
        Top hand
      </text>
      <line x1="150" y1="60" x2="150" y2="172" className="hand-bracket" />

      <text x="168" y="290" className="hand-label">
        Bottom hand
      </text>
      <line x1="150" y1="196" x2="150" y2="326" className="hand-bracket" />
    </svg>
  )
}
