const PHASES = [
  { title: 'Meet the chanter', free: true },
  { title: 'The scale', free: true },
  { title: 'Steady rhythm, no embellishments', free: true },
  { title: 'The doubling', free: false },
  { title: 'First real tunes', free: false },
  { title: 'Progressive embellishments', free: false },
]

function App() {
  return (
    <main>
      <h1>Bagpipe Lab</h1>
      <p>Interactive practice-chanter trainer. App shell — curriculum coming soon.</p>
      <ol>
        {PHASES.map((phase) => (
          <li key={phase.title}>
            {phase.title} {phase.free ? '' : '(unlock)'}
          </li>
        ))}
      </ol>
    </main>
  )
}

export default App
