import { getEntry } from 'astro:content';

export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('Missing src/content/profile.yml');
  return entry;
}

export async function getCv() {
  const entry = await getEntry('cv', 'cv');
  if (!entry) throw new Error('Missing src/content/cv.yml');
  return entry;
}

export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing src/content/pages/${id}.md`);
  return entry;
}
