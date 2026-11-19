interface TocEntry {
  id: string;
  headingLevel: number;
  textContent: string;
}

/** Turns the page title into the first ToC entry */
export function overviewEntry<T extends TocEntry>(entry: T, heading: HTMLElement): T {
  if (heading.tagName !== 'H1') {
    return entry;
  }
  // Set id for tocbot
  heading.id = 'overview';
  return { ...entry, id: heading.id, headingLevel: 3, textContent: 'Overview' };
}
