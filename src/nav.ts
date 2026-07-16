// Navigation types shared between App (which owns the state) and the curriculum
// (whose stage CTAs describe where to jump). Kept in their own module so the
// curriculum doesn't have to import from App, which would be a cycle.
export type Tab = 'guide' | 'scale' | 'play' | 'embellishments'
export type PlayMode = 'feel' | 'read' | 'notes'

/** A jump into a tool tab, optionally preconfigured — fired by a Guide stage. */
export type Preset = { tab: Tab; exerciseId?: string; playMode?: PlayMode }
