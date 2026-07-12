import type { ReactNode } from 'react'
import {
  Welcome,
  Anatomy,
  Reed,
  Blowing,
  Holding,
  FingerPlacement,
  ToThePipes,
} from './content'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'
import { ComingSoon } from './ui'

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

export const CURRICULUM: Unit[] = [
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
    id: 'notes',
    title: 'The nine notes',
    summary: 'Meet each note of the chanter and the fingering that makes it.',
    lessons: [
      {
        id: 'note-explorer',
        title: 'The nine notes',
        subtitle: 'Tap any note to hear it and see the fingering',
        render: () => <MeetTheChanter />,
      },
    ],
  },
  {
    id: 'scale',
    title: 'The scale',
    summary: 'Play the full run of notes, low to high and back, in time.',
    lessons: [
      {
        id: 'scale-playalong',
        title: 'The scale, low to high',
        subtitle: 'Watch the fingering move through the octave',
        render: () => <TheScale />,
      },
    ],
  },
  {
    id: 'rhythm',
    title: 'Steady rhythm',
    summary: 'Simple tunes, graded on your timing and finger accuracy.',
    lessons: [
      {
        id: 'rhythm-intro',
        title: 'Playing in time',
        render: () => (
          <ComingSoon>
            <p>
              Once you can hold each note cleanly, the next skill is playing them{' '}
              <em>in time</em>. This stage will bring simple, public-domain melodies with a
              falling-notes lane and a metronome, scoring you purely on your timing and
              finger-sequence accuracy — no embellishments yet, just a rock-steady rhythm.
            </p>
          </ComingSoon>
        ),
      },
    ],
  },
  {
    id: 'embellishments',
    title: 'Embellishments',
    summary: 'The grace-note movements that make piping sound like piping.',
    lessons: [
      {
        id: 'embellishments-intro',
        title: 'The doubling and beyond',
        render: () => (
          <ComingSoon>
            <p>
              Because a chanter can’t stop between two of the same note, pipers use tiny grace-note
              movements to separate them. This stage introduces the doubling — your first
              embellishment — right when you need it, then builds up through strikes, grips, throws,
              and more, each in the tune that calls for it.
            </p>
          </ComingSoon>
        ),
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

export const FLAT_LESSONS: FlatLesson[] = CURRICULUM.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ unit, lesson, index: 0 })),
).map((entry, i) => ({ ...entry, index: i }))

export function findFlat(lessonId: string): FlatLesson | undefined {
  return FLAT_LESSONS.find((f) => f.lesson.id === lessonId)
}
