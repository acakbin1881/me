/**
 * Prefixes a site-relative path with the configured `base` ("/me").
 * Use for every internal link and every file from /public:
 *   href={url('/')}  href={url('/projects')}  src={url('/photo.jpg')}
 * Page paths get a trailing slash (matches `trailingSlash: 'always'`);
 * file paths (anything with an extension) are left as they are.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let clean = path.replace(/^\//, '');
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  if (!isFile && clean !== '' && !clean.endsWith('/')) clean += '/';
  return `${base}/${clean}`;
}
