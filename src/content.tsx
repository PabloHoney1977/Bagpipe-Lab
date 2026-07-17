import { AnatomyDiagram, ReedDiagram } from './AnatomyDiagram'
import { FingerMapDiagram } from './FingerMapDiagram'
import { StaffDiagram } from './StaffDiagram'
import { Callout, Steps, Figure, FactList } from './ui'

export function Welcome() {
  return (
    <div className="prose">
      <p className="lede">
        This app takes you from never having held a chanter to playing real tunes on the Great
        Highland Bagpipe — one small, solid step at a time.
      </p>
      <p>
        Every piper in the world starts the same way: not on the pipes, but on the{' '}
        <strong>practice chanter</strong>. It is a simple wooden or plastic pipe with a mouthpiece
        at one end and finger holes down the front. You blow into it and cover holes to change the
        note. No bag, no drones, no wrestling with air pressure — just your breath, your fingers,
        and the tune.
      </p>
      <Callout kind="why" title="Why start here">
        The pipes ask you to do four things at once: blow, squeeze the bag, keep the drones steady,
        and finger the melody. That is too much for anyone on day one. The practice chanter lets you
        master the single hardest and most important part — your fingers and your timing — before you
        ever pick up the pipes. The fingering you learn here is <em>exactly</em> the same on the
        pipes.
      </Callout>
      <h3>How to use this app</h3>
      <p>
        The <strong>Guide</strong> you are reading is the map. It is not the practice itself — it is
        a short path of stages that each tell you one thing and then send you to the tool where you
        actually do it:
      </p>
      <FactList
        items={[
          { term: 'Guide', detail: 'This tab. Your step-by-step path — read a stage, then follow its buttons into the tools.' },
          { term: 'Scale', detail: 'Watch the full octave play, low to high and back, with the fingering leading your eye.' },
          { term: 'Play', detail: 'Three ways to practise the same patterns: feel the pulse (timing, scored), read the music (staff notation), or explore each note freely.' },
          { term: 'Grace notes', detail: 'The embellishments that make piping sound like piping — later, once your tunes are steady.' },
        ]}
      />
      <p>
        Work the stages top to bottom, tick off each stage’s practice steps in the tools, and mark a
        stage done when it feels solid. Take your time — steady beats fast, every single time.
      </p>
    </div>
  )
}

export function Anatomy() {
  return (
    <div className="prose">
      <p className="lede">Before you play it, get to know the instrument in your hands.</p>
      <p>
        A practice chanter comes apart in the middle into two pieces. The reed lives inside, seated
        where the two halves meet.
      </p>
      <Figure caption="A practice chanter, from the blowing end down to the sole.">
        <AnatomyDiagram />
      </Figure>
      <FactList
        items={[
          { term: 'Mouthpiece', detail: 'The narrow tube at the top. You blow into it with a steady, even breath.' },
          { term: 'Upper section', detail: 'The top half of the chanter; it channels your air down to the reed.' },
          { term: 'The reed', detail: 'A small double reed seated at the joint in the middle. This is what actually makes the sound.' },
          { term: 'Lower section', detail: 'The bottom half, with the eight tone holes — seven down the front and one on the back for your thumb.' },
          { term: 'Sole', detail: 'The slightly flared foot at the very bottom where the sound comes out.' },
        ]}
      />
      <Callout kind="tip">
        Practice chanters come in plastic and in wood (often African blackwood). Plastic is
        near-indestructible and perfect to learn on. Wood sounds a touch warmer but needs more care.
        Either is completely fine to start.
      </Callout>
    </div>
  )
}

export function Reed() {
  return (
    <div className="prose">
      <p className="lede">The reed is the heart of the chanter. Everything you play depends on it.</p>
      <p>
        Tucked inside, at the joint, is a small <strong>double reed</strong> — two thin blades of cane
        or moulded plastic bound together, with a narrow slit between them. When you blow, air rushes
        through that slit and the two blades vibrate rapidly against each other. That vibration is the
        sound. It travels down the lower section and out through the tone holes and sole.
      </p>
      <Figure caption="A double reed: two blades with a slit between them, bound at the base.">
        <ReedDiagram />
      </Figure>
      <Callout kind="why" title="One long, continuous tone">
        Here is the single most important thing to understand about a chanter: as long as you are
        blowing, it is <em>sounding</em>. You cannot tongue notes to separate them the way a flute or
        trumpet player can, and you cannot stop a note without stopping the whole instrument. This one
        fact shapes everything in piping — it is the reason grace notes exist, and you will meet them
        later.
      </Callout>
      <h3>Waking the reed up</h3>
      <p>
        A cold, dry reed can be stiff and reluctant. A little warmth and moisture from your breath
        brings it to life.
      </p>
      <Steps
        items={[
          'Blow a few gentle, warm breaths through the chanter before you expect a clean note.',
          'Give it a moment. The reed settles and starts to speak more easily as it warms.',
          'When you are done for the day, let the chanter dry before you put it away.',
        ]}
      />
      <Callout kind="warning">
        The reed is delicate. Never poke your finger or anything else into the slit between the
        blades, and don’t bang the chanter on hard surfaces. A crushed reed won’t play.
      </Callout>
    </div>
  )
}

export function Blowing() {
  return (
    <div className="prose">
      <p className="lede">The goal is one thing: a steady, unwavering tone.</p>
      <p>
        Blowing a chanter is not about blowing <em>hard</em>. It is about blowing{' '}
        <strong>evenly</strong> — the same gentle, constant pressure held right through a note and
        across the gaps between notes. A wobbling breath makes a wobbling, wavering pitch, and it is
        the first thing a trained ear notices.
      </p>
      <h3>Finding the right pressure</h3>
      <Steps
        items={[
          'Cover all the holes and blow very softly — so softly the reed barely speaks.',
          'Slowly add pressure until the note settles into a clear, bright, steady tone. That point is your target.',
          'Keep adding pressure past it and the note turns thin, sharp, and strained — too much. Ease back to that clear, comfortable spot.',
        ]}
      />
      <Callout kind="tip" title="Lean into it">
        The reed sounds best at a pressure just a little above the bare minimum needed to make it
        speak. Pipers call this “leaning into” the reed. It gives a fuller, more stable note than
        blowing as softly as possible.
      </Callout>
      <Callout kind="why">
        Steady blowing is the foundation the whole rest of the course sits on. When you play tunes
        later, your fingers get all the attention — but it is a rock-steady breath underneath that
        makes those tunes actually sound good.
      </Callout>
    </div>
  )
}

export function Holding() {
  return (
    <div className="prose">
      <p className="lede">A relaxed, correct hold now saves you from bad habits that are hard to undo later.</p>
      <h3>Which hand goes where</h3>
      <p>
        Your <strong>left hand goes on top</strong>, nearest the mouthpiece, and your{' '}
        <strong>right hand goes on the bottom</strong>. This is the standard for every Highland
        piper, and it stays the same when you move to the pipes — so it is worth building the habit
        from your very first note.
      </p>
      <Callout kind="warning">
        This is true no matter which hand you write with. Left-handed players use the same hold. Fight
        the temptation to swap — the whole tradition, and every tune book and teacher, assumes left on
        top.
      </Callout>
      <h3>Posture</h3>
      <Steps
        items={[
          'Sit or stand up straight, shoulders relaxed and down — not hunched over the chanter.',
          'Let the chanter hang down and slightly out in front of you at a comfortable, natural angle.',
          'Keep your wrists straight, so that only your fingers move when you play, not your whole arm.',
          'Let your fingers rest with a soft, natural curve — not locked flat, not tightly clawed.',
        ]}
      />
      <Callout kind="tip">
        Check in with yourself often. Tension creeps into the shoulders, wrists, and jaw without you
        noticing. A relaxed player plays cleaner and lasts longer.
      </Callout>
    </div>
  )
}

export function FingerPlacement() {
  return (
    <div className="prose">
      <p className="lede">
        Every note is made by sealing and un-sealing holes. Getting your fingers right is the whole
        game.
      </p>
      <Figure caption="Eight fingers over eight holes: left thumb on the back, three left fingers and four right fingers down the front.">
        <FingerMapDiagram />
      </Figure>
      <p>
        Eight holes, eight fingers. Your <strong>left thumb</strong> covers the single hole on the
        back. Your <strong>left index, middle, and ring</strong> fingers cover the top three holes on
        the front. Your <strong>right index, middle, ring, and little finger</strong> cover the bottom
        four.
      </p>
      <h3>Use the pads, not the tips</h3>
      <p>
        Cover each hole with the soft <strong>pad</strong> of your finger — the flat, fleshy part just
        below the tip — not the very point of the fingertip. Your fingers lie fairly flat across the
        chanter rather than pressing straight down like piano keys.
      </p>
      <Callout kind="why" title="Why sealing matters so much">
        A hole that is even slightly uncovered leaks air, and a leaking hole gives you a wrong note or
        an ugly squeal instead of the note you wanted. Each covered hole must be sealed{' '}
        <em>completely</em>. This is the number-one thing beginners get wrong — and the interactive
        note diagrams in the next stage let you see exactly which holes need to be sealed for every
        note.
      </Callout>
      <h3>Keep lifted fingers close</h3>
      <p>
        When a finger is <em>off</em> its hole, don’t fling it high into the air. Lift it just a
        small amount — around half an inch — and keep it hovering right over its hole, ready to drop
        back cleanly. Close, controlled fingers are fast fingers.
      </p>
      <Callout kind="tip">
        Everyone’s hands are a different shape and size. Nudge each finger up or down a little until
        every hole seals comfortably and your hand feels relaxed. There is a bit of personal fit in
        finding your positions — that is normal.
      </Callout>
    </div>
  )
}

export function NotationBasics() {
  return (
    <div className="prose">
      <p className="lede">
        Bagpipe sheet music looks like any other sheet music at a glance — but it reads far more
        simply than the piano or guitar music you may have seen before.
      </p>
      <p>
        Pipe tunes are written on a <strong>staff</strong> — the five horizontal lines, with four
        spaces between them, that the notes sit on; the higher up the staff a note sits, the higher it
        sounds. At the far left is a <strong>clef</strong>, a symbol that fixes which line means which
        note, and pipe music always uses the same one. That part is completely ordinary. What is
        unusual is how little else there is to learn.
      </p>
      <FactList
        items={[
          {
            term: 'Only nine notes, ever',
            detail:
              'The chanter can only play Low G, Low A, B, C, D, E, F, High G, and High A — the same nine notes from the Play tab’s note explorer. Whatever is on the page, it is always one of those nine.',
          },
          {
            term: 'No sharps or flats',
            detail:
              'A written note always means its plain letter — an A is an A, a C is a C. The extra symbols other instruments use to nudge a note up or down never appear here.',
          },
          {
            term: 'One range, forever',
            detail:
              'The chanter’s entire range is Low G up to High A — under two octaves. Learn where those nine notes sit on the staff once, and you have learned the whole instrument’s range. There is no more range to discover later.',
          },
        ]}
      />
      <Callout kind="why" title="Why this matters">
        The chanter is a <strong>fixed-pitch instrument</strong> — every fingering produces one exact
        pitch that never bends or slides. Because there is nothing to adjust by ear, none of the extra
        note-raising or note-lowering symbols other instruments' music leans on are ever needed. Most
        instruments take years to sight-read fluently because their music can span many octaves and
        shift between many keys. The chanter's tiny, fixed range is exactly why piping is one of the
        fastest instruments to learn to read.
      </Callout>
      <p>
        The next lesson maps each of the nine notes onto the staff, so you can look at any bar of
        pipe music and know instantly which note to play. The one after that covers timing — how the
        shape of a note tells you how long to hold it.
      </p>
    </div>
  )
}

export function RhythmBasics() {
  return (
    <div className="prose">
      <p className="lede">
        Once you know which of the nine notes is which, the only other thing the page tells you is{' '}
        <em>when</em> to play them.
      </p>
      <h3>Note lengths</h3>
      <p>
        A note's shape tells you how long it lasts, measured in <strong>beats</strong> — the same
        steady pulse a metronome ticks out.
      </p>
      <FactList
        items={[
          { term: 'Quarter note', detail: 'One full beat. The basic unit most tunes are built from.' },
          { term: 'Eighth note', detail: 'Half a beat. Two eighth notes fill the space of one quarter note, and are usually beamed together with a bar joining their stems.' },
          { term: 'Half note', detail: 'Two beats — held twice as long as a quarter note.' },
          { term: 'Dotted note', detail: 'A dot after a note adds half its value again. A dotted quarter note lasts one and a half beats.' },
        ]}
      />
      <h3>Bars and time signatures</h3>
      <p>
        Vertical bar lines divide the music into equal groups of beats. The <strong>time
        signature</strong> at the start of the tune — two stacked numbers, like <code>2/4</code> or{' '}
        <code>6/8</code> — tells you how many beats fill each bar and what kind of note counts as one
        beat.
      </p>
      <FactList
        items={[
          { term: 'The top number', detail: 'How many beats are in each bar — two in 2/4, six in 6/8 (felt as two groups of three).' },
          { term: 'The bottom number', detail: 'Which kind of note counts as one beat. You don’t have to work this out to play — the Play tab counts the beats for you.' },
        ]}
      />
      <Callout kind="tip" title="You already know this feel">
        This is exactly what the <strong>Play</strong> tab's falling-notes lane turns into something
        you can feel instead of just read: the tempo (bpm) sets the pulse, the time signature sets how
        the beats group into bars, and each note's length is how long its lane takes to fall. Reading
        the shapes on a page and feeling the beat in the Play tab are the same skill, from two
        directions.
      </Callout>
    </div>
  )
}

export function StaffNotes() {
  const ascending = ['Low G', 'Low A', 'B', 'C', 'D', 'E', 'F', 'High G', 'High A']
  return (
    <div className="prose">
      <p className="lede">Here is where every note the chanter can play sits on the staff, low to high.</p>
      <Figure caption="The nine chanter notes, ascending. Bottom line of the staff is unused — Low G is one line up from it.">
        <StaffDiagram notes={ascending.map((note) => ({ note }))} />
      </Figure>
      <FactList
        items={[
          { term: 'Low G', detail: 'The 2nd line from the bottom. The very bottom line of the staff is not used by any chanter note.' },
          { term: 'Low A → F', detail: 'From there, each note climbs one line or space at a time — Low A, B, C, D, E, F — right up to F on the top line.' },
          { term: 'High G', detail: 'Floats just above the staff, in the open space above the top line. No ledger line needed.' },
          { term: 'High A', detail: 'One step higher still, sitting on a short extra line drawn just above the staff — a “ledger line” — the only note that needs one.' },
        ]}
      />
      <Callout kind="tip" title="Cross-check it by ear">
        Open the <strong>Play</strong> tab's note explorer and tap through the nine notes while you
        look back at this diagram. Matching the sound, the fingering, and the staff position together
        is what makes reading fast and automatic.
      </Callout>
      <Callout kind="why">
        Because the chanter only ever uses these nine positions, you never have to work out which
        octave a note belongs to the way a piano or guitar player does. Once this diagram is familiar,
        you have learned to sight-read pitch on the chanter — for good.
      </Callout>
    </div>
  )
}

export function ToThePipes() {
  return (
    <div className="prose">
      <p className="lede">Everything you are building on the chanter is aimed at this moment.</p>
      <p>
        When your fingering is clean and your rhythm is steady, you are ready to carry it all across
        to the Great Highland Bagpipe. The good news: <strong>the fingering is identical.</strong>{' '}
        Every note and every movement you have learned transfers straight over. What is new is
        everything <em>around</em> the fingering.
      </p>
      <FactList
        items={[
          { term: 'The bag', detail: 'You tuck a bag under your arm and squeeze it to store and push air, instead of blowing straight into the chanter.' },
          { term: 'Blow and squeeze together', detail: 'You blow to fill the bag and squeeze to keep pressure steady — the two work in a constant give-and-take so the sound never wavers.' },
          { term: 'The drones', detail: 'Three drones rest on your shoulder and sound a constant background chord. You learn to tune them and keep them steady.' },
          { term: 'The pipe chanter', detail: 'Louder and reed-driven, but fingered exactly like your practice chanter.' },
        ]}
      />
      <Callout kind="tip">
        Most pipers spend months on the practice chanter before the pipes, and keep using it for the
        rest of their playing lives to learn new tunes. It never stops being useful.
      </Callout>
      <p>
        For now, this stage is a preview of where you’re headed. Keep working through the earlier
        stages until your fingers know the way — the pipes will be waiting.
      </p>
    </div>
  )
}
