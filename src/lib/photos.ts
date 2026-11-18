import type { ImageMetadata } from 'astro';

/**
 * Resolves a file name from profile.ts ("hike.jpg") to the image in
 * src/assets/photos/. Astro resizes these at build time and drops their
 * metadata, so phone GPS data never reaches the site.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function photo(name: string): ImageMetadata {
  const file = files[`../assets/photos/${name}`];
  if (!file) throw new Error(`Photo not found: src/assets/photos/${name}`);
  return file.default;
}
