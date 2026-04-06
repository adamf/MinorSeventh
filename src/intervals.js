/**
 * Intervals Data
 */

export const NOTES = [
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4'
];

export const INTERVALS = [
  {
    name: 'Unison',
    description: 'A unison is the same note played together.',
    semitones: 0
  },
  {
    name: 'Minor Second',
    description: "A minor second, when played ascending, is heard in the Jaws theme song. When descending, it is heard in Für Elise.",
    semitones: 1
  },
  {
    name: 'Major Second',
    description: "A major second, when played ascending, is heard in Happy Birthday. When descending, it is heard in Three Blind Mice.",
    semitones: 2
  },
  {
    name: 'Minor Third',
    description: "A minor third, when played ascending, is heard in Greensleeves. When descending, it is heard in the Star Spangled Banner.",
    semitones: 3
  },
  {
    name: 'Major Third',
    description: "A major third, when played ascending, is heard in When The Saints Go Marching In. When descending, it is heard in Beethoven's 5th Symphony.",
    semitones: 4
  },
  {
    name: 'Perfect Fourth',
    description: "A perfect fourth, when played ascending, is heard in Here Comes The Bride. When descending, it is heard in Oh Come All Ye Faithful.",
    semitones: 5
  },
  {
    name: 'Tritone',
    description: "A tritone, when played ascending, is heard in Maria from West Side Story. When descending, it is heard in Blue Seven.",
    semitones: 6
  },
  {
    name: 'Perfect Fifth',
    description: "A perfect fifth, when played ascending, is heard in Twinkle, Twinkle, Little Star. When descending, it is heard in the Flintstones theme song.",
    semitones: 7
  },
  {
    name: 'Minor Sixth',
    description: "A minor sixth, when played ascending, is heard in the jazz standard Morning Of Carnival. When descending, it is heard in the theme from Love Story.",
    semitones: 8
  },
  {
    name: 'Major Sixth',
    description: "A major sixth, when played ascending, is heard in America The Beautiful. When descending, it is heard in Over There.",
    semitones: 9
  },
  {
    name: 'Minor Seventh',
    description: "A minor seventh, when played ascending, is heard in the Star Trek theme song. When descending, it is heard in An American In Paris.",
    semitones: 10
  },
  {
    name: 'Major Seventh',
    description: "A major seventh, when played ascending, is heard in the Fantasy Island theme song. When descending, it is heard in Cole Porter's I Love You.",
    semitones: 11
  },
  {
    name: 'Octave',
    description: "An octave, when played ascending, is heard in Somewhere Over The Rainbow. When descending, it is heard in Willow Weep For Me.",
    semitones: 12
  }
];

// Calculate MIDDLE_C_INDEX dynamically based on NOTES array
export const MIDDLE_C_INDEX = NOTES.indexOf('C3');
