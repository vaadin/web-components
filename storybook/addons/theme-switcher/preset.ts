import { join } from 'node:path';

// Storybook detects `manager.js` and `preview.js` of a local addon, but not TypeScript files
export const managerEntries = (entries: string[] = []): string[] => [
  ...entries,
  join(import.meta.dirname, 'manager.tsx'),
];

export const previewAnnotations = (entries: string[] = []): string[] => [
  ...entries,
  join(import.meta.dirname, 'preview.ts'),
];
