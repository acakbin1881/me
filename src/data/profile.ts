/**
 * Everything the site says about Aras lives here. Components only render this.
 *
 * The page is one sheet of paper with two sides:
 *   front (white)  = work: the statement, Experience, Education
 *   back  (red)    = life: the statement, one chapter per verb, Contact
 *
 * Career facts come from LinkedIn (read on 2026-11-11). Dates are stored as shown there.
 */

export interface Role {
  role: string;
  org: string;
  /** The organization's website; the name becomes a link to it. */
  href?: string;
  line?: string;
  /** Omitted when unknown; the "since" column then stays empty. */
  start?: string;
  /** 'Present' is shown as a red "Now". */
  end: string;
}

export interface Study {
  program: string;
  school: string;
  start: string;
  end: string;
}

export interface Link {
  label: string;
  href: string;
}

/** One photo. `file` is a file name in src/assets/photos/. */
export interface Shot {
  file: string;
  alt: string;
  /** Place and year, e.g. "Half Moon Bay, 2026". */
  caption: string;
}

/**
 * One part of life on the back of the sheet: a verb set very large, one line of
 * text and 1 to 3 photos. The first photo gets the largest slot.
 */
export interface Chapter {
  verb: string;
  note: string;
  shots: Shot[];
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  /** Used for the meta description and link previews. */
  description: string;
  /** Front statement: the lines that follow the name. Keep each under 20 characters. */
  work: string[];
  /** Back statement: the lines that follow the name. Keep each under 20 characters. */
  life: string[];
  experience: Role[];
  education: Study[];
  /** Shown in Contact at the bottom of the page. */
  email: string;
  links: Link[];
  chapters: Chapter[];
}

export const profile: Profile = {
  name: 'Aras Akbin',
  headline: 'Stellar Ambassador · Founder, TrustRFQ',
  location: 'San Francisco Bay Area',
  description:
    'Aras Akbin, Stellar Ambassador and founder of TrustRFQ, based in the San Francisco Bay Area.',
  work: ['builds TrustRFQ,', 'represents Stellar,', 'studies physics.'],
  life: ['also trains,', 'cooks,', 'speaks on stage.'],
  experience: [
    // TODO(aras): add the TrustRFQ start date (e.g. 'Mar 2026').
    { role: 'Founder', org: 'TrustRFQ', end: 'Present' },
    {
      role: 'Global Strategy & Partnerships Advisor',
      org: 'Upvera',
      href: 'https://upvera.co/en/',
      line: 'Build-in-public platform for startup founders',
      start: 'Jul 2026',
      end: 'Present',
    },
    { role: 'Ambassador', org: 'Stellar Development Foundation', start: 'Jun 2026', end: 'Present' },
    {
      role: 'Blockchain Developer (Freelance)',
      org: 'ODTÜ Blockchain',
      line: 'Blockchain and Web3',
      start: '2025',
      end: '2026',
    },
  ],
  education: [
    {
      program: 'English Preparation',
      school: 'Middle East Technical University (ODTÜ)',
      start: '2025',
      end: '2026',
    },
  ],
  email: 'ac.akbin1418@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aras-akbin-36b9842a7/' },
    { label: 'GitHub', href: 'https://github.com/acakbin1881' },
    { label: 'X', href: 'https://x.com/acakbinxyz' },
  ],
  // TODO(aras): everything below is stand-in content. Replace the notes, captions
  // and placeholder-*.jpg files with your own. Add or remove chapters freely; the
  // four layouts repeat in order.
  chapters: [
    {
      verb: 'Trains',
      note: 'Sport comes first in the day, before the laptop opens.',
      shots: [
        { file: 'placeholder-train-1.jpg', alt: 'Stand-in image: a barbell on a gym floor', caption: 'Place, 2026' },
        { file: 'placeholder-train-2.jpg', alt: 'Stand-in image: a running track from above', caption: 'Place, 2026' },
      ],
    },
    {
      verb: 'Cooks',
      note: 'Dinner from scratch, usually for more than one.',
      shots: [
        { file: 'placeholder-cook-1.jpg', alt: 'Stand-in image: a plate on a table', caption: 'Place, 2026' },
        { file: 'placeholder-cook-2.jpg', alt: 'Stand-in image: a pan on a stove', caption: 'Place, 2025' },
      ],
    },
    {
      verb: 'Speaks',
      note: 'Talks, demos and workshops, in front of any room that will listen.',
      shots: [
        { file: 'placeholder-speak-1.jpg', alt: 'Stand-in image: a speaker in front of a slide', caption: 'Place, 2026' },
        { file: 'placeholder-speak-2.jpg', alt: 'Stand-in image: a microphone', caption: 'Place, 2026' },
      ],
    },
    {
      verb: 'Etc.',
      note: 'Hobbies, tastes and everything that fits in no category.',
      shots: [
        { file: 'placeholder-etc-2.jpg', alt: 'Stand-in image: a record on a turntable', caption: 'Place, 2025' },
        { file: 'placeholder-etc-3.jpg', alt: 'Stand-in image: a chessboard', caption: 'Place, 2026' },
        { file: 'placeholder-etc-1.jpg', alt: 'Stand-in image: mountains under a low sun', caption: 'Place, 2024' },
      ],
    },
  ],
};
