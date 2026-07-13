import type { ReactNode } from 'react'
import {
  Welcome,
  Anatomy,
  Reed,
  Blowing,
  Holding,
  FingerPlacement,
  NotationBasics,
  RhythmBasics,
  StaffNotes,
  ToThePipes,
} from './content'

export type Lesson = {
  id: string
  title: string
  subtitle?: string
  render: () => ReactNode
}

export type Unit = {
  id: string
  title: string
  summary: string
  lessons: Lesson[]
}

// The Guide tab is the written course. The interactive tools (nine notes /
// scale / play / embellishments) live in their own tabs.
export const GUIDE_UNITS: Unit[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    summary: 'Before your first note — the instrument, the reed, and your hands.',
    lessons: [
      { id: 'welcome', title: 'Welcome', subtitle: 'What this course is and where it leads', render: () => <Welcome /> },
      { id: 'anatomy', title: 'Meet the practice chanter', subtitle: 'The parts of the instrument', render: () => <Anatomy /> },
      { id: 'reed', title: 'The reed', subtitle: 'How the chanter makes its sound', render: () => <Reed /> },
      { id: 'blowing', title: 'Blowing steadily', subtitle: 'The one skill under everything', render: () => <Blowing /> },
      { id: 'holding', title: 'Holding the chanter', subtitle: 'Hands, posture, and a relaxed hold', render: () => <Holding /> },
      { id: 'fingers', title: 'Finger placement', subtitle: 'Where your fingers go and how to seal', render: () => <FingerPlacement /> },
    ],
  },
  {
    id: 'reading',
    title: 'Reading the music',
    summary: 'Bagpipe notation looks like any other sheet music, but it reads far simpler.',
    lessons: [
      {
        id: 'notation-basics',
        title: 'Why bagpipe notation is simple',
        subtitle: 'One clef, one range, no sharps or flats',
        render: () => <NotationBasics />,
      },
      {
        id: 'rhythm-basics',
        title: 'Reading the rhythm',
        subtitle: 'Note lengths, bar lines, and time signatures',
        render: () => <RhythmBasics />,
      },
      {
        id: 'staff-notes',
        title: 'The staff, note by note',
        subtitle: 'Matching each of the nine notes to its place on the stave',
        render: () => <StaffNotes />,
      },
    ],
  },
  {
    id: 'pipes',
    title: 'Onto the pipes',
    summary: 'Carry everything across to the Great Highland Bagpipe.',
    lessons: [
      { id: 'to-the-pipes', title: 'From chanter to pipes', subtitle: 'What changes, and what stays the same', render: () => <ToThePipes /> },
    ],
  },
]

export type FlatLesson = { unit: Unit; lesson: Lesson; index: number }

export const GUIDE_FLAT: FlatLesson[] = GUIDE_UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ unit, lesson, index: 0 })),
).map((entry, i) => ({ ...entry, index: i }))

export function findGuideLesson(lessonId: string): FlatLesson | undefined {
  return GUIDE_FLAT.find((f) => f.lesson.id === lessonId)
}
