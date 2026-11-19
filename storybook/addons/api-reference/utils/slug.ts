/** Creates the same heading ids as the api-docs site for identifiers and plain words. */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/gu, '-');
}

/** Adds `-1`, `-2` to repeated ids like markdown-it-anchor, after the ids of the `seed` headings. */
export function createSlugger(seed: Iterable<string> = []): (text: string) => string {
  const used = new Set<string>();
  const slug = (text: string) => {
    const base = slugify(text);
    let unique = base;
    for (let i = 1; used.has(unique); i++) {
      unique = `${base}-${i}`;
    }
    used.add(unique);
    return unique;
  };
  for (const text of seed) {
    slug(text);
  }
  return slug;
}

export function headingTexts(markdown: string): string[] {
  const texts: string[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^ {0,3}(?:```|~~~)/u.test(line)) {
      inFence = !inFence;
      continue;
    }
    const heading = inFence ? null : /^ {0,3}#{1,6}\s+(.*?)(?:\s+#+)?\s*$/u.exec(line);
    if (heading) {
      texts.push(heading[1]);
    }
  }
  return texts;
}
