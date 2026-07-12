// A labeled diagram of a practice chanter, top (blowing end) to bottom.
export function AnatomyDiagram() {
  return (
    <svg
      viewBox="0 0 460 520"
      width="420"
      height="475"
      role="img"
      aria-label="Labeled diagram of a practice chanter"
      className="anatomy"
    >
      {/* ---- the chanter, built top to bottom around x = 96 ---- */}
      {/* mouthpiece / blowpipe cap */}
      <path d="M 86,20 Q 96,10 106,20 L 104,54 L 88,54 Z" className="an-part" />
      {/* upper section */}
      <rect x="86" y="54" width="20" height="120" className="an-part" />
      {/* centre joint / where the reed seats */}
      <rect x="80" y="174" width="32" height="26" rx="3" className="an-joint" />
      <circle cx="96" cy="187" r="4" className="an-reed-dot" />
      {/* lower section (body) */}
      <rect x="88" y="200" width="16" height="250" className="an-part" />
      {/* finger holes */}
      {[228, 258, 288, 336, 366, 396, 426].map((y) => (
        <circle key={y} cx="96" cy={y} r="5.5" className="an-hole" />
      ))}
      {/* sole / bell */}
      <path d="M 88,450 L 88,470 Q 88,500 96,500 Q 104,500 104,470 L 104,450 Z" className="an-part" />

      {/* ---- leader lines + labels ---- */}
      <g className="an-label-group">
        <line x1="106" y1="34" x2="180" y2="34" className="an-leader" />
        <text x="186" y="30" className="an-term">Mouthpiece</text>
        <text x="186" y="46" className="an-note">Blow here, with a steady breath.</text>

        <line x1="106" y1="110" x2="180" y2="110" className="an-leader" />
        <text x="186" y="106" className="an-term">Upper section</text>
        <text x="186" y="122" className="an-note">Carries your air down to the reed.</text>

        <line x1="112" y1="187" x2="180" y2="187" className="an-leader" />
        <text x="186" y="183" className="an-term">The reed (inside)</text>
        <text x="186" y="199" className="an-note">Seated at the joint. It makes the sound.</text>

        <line x1="104" y1="300" x2="180" y2="300" className="an-leader" />
        <text x="186" y="296" className="an-term">Lower section</text>
        <text x="186" y="312" className="an-note">Eight tone holes: seven front, one back.</text>

        <line x1="104" y1="485" x2="180" y2="485" className="an-leader" />
        <text x="186" y="481" className="an-term">Sole</text>
        <text x="186" y="497" className="an-note">The flared foot at the bottom.</text>
      </g>
    </svg>
  )
}

// A close-up of the double reed, for the reed lesson.
export function ReedDiagram() {
  return (
    <svg
      viewBox="0 0 300 180"
      width="260"
      height="156"
      role="img"
      aria-label="Close-up of a double reed"
      className="reed-cu"
    >
      {/* the two blades meeting at the tip */}
      <path d="M 100,16 L 84,120 L 100,130 Z" className="an-reed-blade" />
      <path d="M 100,16 L 116,120 L 100,130 Z" className="an-reed-blade-2" />
      {/* the slit between the blades */}
      <line x1="100" y1="20" x2="100" y2="122" className="reed-slit" />
      {/* binding at the base */}
      <rect x="84" y="120" width="32" height="26" rx="2" className="an-reed-bind" />
      {/* staple / base */}
      <rect x="88" y="146" width="24" height="18" className="an-part" />

      {/* labels */}
      <line x1="100" y1="60" x2="150" y2="60" className="an-leader" />
      <text x="156" y="64" className="an-note">two thin blades</text>
      <line x1="100" y1="118" x2="150" y2="118" className="an-leader" />
      <text x="156" y="122" className="an-note">bound at the base</text>
    </svg>
  )
}
