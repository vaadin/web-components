import { useEffect, useState } from 'react';
import { type DocgenPayload, type QueryState, seedQueryState } from 'storybook/open-service';
import { getService } from 'storybook/preview-api';

const docgenQuery = () => getService('core/docgen', { internal: true }).queries.docgen;

/** Starts with the cached payload, as `DocsContainer` looks up the URL hash target on its first render. */
export function useDocgen(id: string): QueryState<DocgenPayload | undefined> {
  const [state, setState] = useState(() => seedQueryState(docgenQuery(), { id }));
  useEffect(() => docgenQuery().subscribe({ id }, setState), [id]);
  return state;
}
