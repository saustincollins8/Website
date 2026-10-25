import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS can save an emptied field as "" or null instead of removing it.
// Treat both as "not set", so clearing an optional field never fails the build.
const blankToUndefined = (value: unknown) =>
  value === '' || value === null ? undefined : value;
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(blankToUndefined, schema.optional());
const withDefault = <T extends z.ZodType>(schema: T, fallback: z.output<T>) =>
  z.preprocess(blankToUndefined, schema.default(fallback as never));
const list = <T extends z.ZodType>(item: T) => withDefault(z.array(item), []);

// Links typed without a scheme, e.g. "www.example.com", get "https://" added
// rather than failing the build.
const url = () =>
  z.preprocess(
    (value) =>
      typeof value === 'string' && !/^[a-z][a-z\d+.-]*:/i.test(value.trim())
        ? `https://${value.trim()}`
        : value,
    z.url(),
  );

const quote = z.object({
  text: optional(z.string()),
  author: optional(z.string()),
  // Language of the quote, e.g. "fr", so browsers and screen readers handle it correctly.
  lang: optional(z.string()),
  translation: optional(z.string()),
});

const profile = defineCollection({
  loader: glob({ pattern: 'profile.yml', base: './src/content' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      fullName: optional(z.string()),
      tagline: z.string(),
      shortBio: z.string(),
      email: optional(z.email()),
      headshot: optional(image()),
      headshotAlt: withDefault(z.string(), ''),
      currentPositions: list(
        z.object({
          title: z.string(),
          institution: z.string().trim(),
          url: optional(url()),
        }),
      ),
      researchInterests: list(z.string()),
      links: list(z.object({ label: z.string(), url: url() })),
      footerQuote: optional(quote),
      // Small "Site by …" line next to the copyright; clear the text to hide it.
      credit: optional(
        z.object({ text: optional(z.string()), url: optional(url()) }),
      ),
    }),
});

const cvItem = {
  dates: z.coerce.string(),
  note: optional(z.string()),
};

const cv = defineCollection({
  loader: glob({ pattern: 'cv.yml', base: './src/content' }),
  schema: z.object({
    // Path of the uploaded PDF, e.g. /files/austin-collins-cv.pdf
    pdf: optional(z.string()),
    positions: list(
      z.object({ role: z.string(), institution: z.string(), ...cvItem }),
    ),
    education: list(
      z.object({ degree: z.string(), institution: z.string(), ...cvItem }),
    ),
    grants: list(
      z.object({
        title: z.string(),
        funder: optional(z.string()),
        ...cvItem,
      }),
    ),
    honours: list(z.string()),
    memberships: list(z.string()),
    languages: list(z.string()),
  }),
});

// Free-text pages (home bio, research, teaching statement) written in Markdown.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: optional(z.string()),
    intro: optional(z.string()),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    // For a review, the title of the book being reviewed.
    title: z.string(),
    type: z.enum(['book', 'article', 'chapter', 'review', 'report']),
    status: withDefault(
      z.enum(['published', 'forthcoming', 'in-progress']),
      'published',
    ),
    date: z.coerce.date(),
    // Journal, edited volume or website.
    venue: optional(z.string()),
    volume: optional(z.coerce.string()),
    issue: optional(z.coerce.string()),
    pages: optional(z.coerce.string()),
    publisher: optional(z.string()),
    editors: optional(z.string()),
    reviewedWork: optional(
      z.object({
        creators: optional(z.string()),
        publisher: optional(z.string()),
        year: optional(z.coerce.string()),
      }),
    ),
    doi: optional(z.string()),
    url: optional(url()),
    // Short text shown after the citation, e.g. "Manuscript in revision."
    note: optional(z.string()),
    featured: withDefault(z.boolean(), false),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    // The paper's exact title; leave empty and use `note` when it isn't known.
    title: optional(z.string()),
    kind: z.enum([
      'conference',
      'invited',
      'workshop',
      'podcast',
      'video',
      'writing',
    ]),
    event: z.string(),
    location: optional(z.string()),
    date: z.coerce.date(),
    datePrecision: withDefault(z.enum(['year', 'month', 'day']), 'month'),
    note: optional(z.string()),
    url: optional(url()),
    video: optional(url()),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    // Courses are grouped by institution, so stray spaces must not split a group.
    institution: z.string().trim(),
    // Shown on the site, e.g. "Fall 2026". `start` is only used for ordering.
    when: optional(z.string()),
    start: z.coerce.date(),
    format: optional(z.string()),
    // Path of an uploaded syllabus PDF, e.g. /files/syllabus.pdf
    syllabus: optional(z.string()),
  }),
});

export const collections = {
  profile,
  cv,
  pages,
  publications,
  talks,
  courses,
};
