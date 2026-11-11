/**
 * Everything the site says about Aras lives here. Components only render this.
 * Source: LinkedIn, read on 2026-11-11. Dates are stored exactly as displayed.
 */

export interface Role {
  role: string;
  org: string;
  line?: string;
  /** Omitted when unknown; the date column then shows only `end`. */
  start?: string;
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

export interface Profile {
  name: string;
  headline: string;
  location: string;
  /** Used for the meta description and link previews. */
  description: string;
  experience: Role[];
  education: Study[];
  links: Link[];
}

export const profile: Profile = {
  name: 'Aras Akbin',
  headline: 'Stellar Ambassador · Founder, TrustRFQ',
  location: 'San Francisco Bay Area',
  description:
    'Aras Akbin, Stellar Ambassador and founder of TrustRFQ, based in the San Francisco Bay Area.',
  experience: [
    // TODO(aras): add the TrustRFQ start date (e.g. 'Mar 2026').
    { role: 'Founder', org: 'TrustRFQ', end: 'Present' },
    {
      role: 'Global Strategy & Partnerships Advisor',
      org: 'Upvera',
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
    { program: 'Physics', school: 'De Anza College', start: '2026', end: 'Present' },
    {
      program: 'English Preparation',
      school: 'Middle East Technical University (ODTÜ)',
      start: '2025',
      end: '2026',
    },
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aras-akbin-36b9842a7/' },
    { label: 'GitHub', href: 'https://github.com/acakbin1881' },
  ],
};
