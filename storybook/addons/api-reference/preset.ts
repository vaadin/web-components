import { join } from 'node:path';
import type { DocgenProviderDescriptor } from 'storybook/internal/types';
import type { ApiReferenceOptions } from './docgen/docgen-worker.ts';

// Runs after the provider of the web components framework, which reads the custom elements manifest
// eslint-disable-next-line camelcase
export const experimental_docgenProvider = (existing: DocgenProviderDescriptor[] = []): DocgenProviderDescriptor[] => {
  const options: ApiReferenceOptions = { storiesDir: join(import.meta.dirname, '../../stories') };
  return [...existing, { moduleSpecifier: join(import.meta.dirname, 'docgen/docgen-worker.ts'), options }];
};
