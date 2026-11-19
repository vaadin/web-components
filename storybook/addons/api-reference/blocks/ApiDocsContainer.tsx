import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import React, { type PropsWithChildren } from 'react';
import { Global } from 'storybook/theming/emotion';
import { useDocgen } from './use-docgen.js';

const TOC_STYLES = {
  '.sbdocs.sbdocs-toc--custom, .sbdocs-toc--custom > nav': { width: 200 },
  // Wraps member names longer than the ToC width
  '.sbdocs-toc--custom .toc-link': { overflowWrap: 'anywhere' },
  // Storybook does not style the lists that tocbot collapses
  '.sbdocs-toc--custom .toc-list.is-collapsed': { display: 'none' },
} as const;

/** Waits for the docgen payload, as `DocsContainer` builds the ToC and scrolls to the URL hash only once. */
export function ApiDocsContainer({ context, children, ...props }: PropsWithChildren<DocsContainerProps>) {
  const { isInitialLoading } = useDocgen(context.resolveOf('meta', ['meta']).preparedMeta.componentId);
  return isInitialLoading ? null : (
    <DocsContainer context={context} {...props}>
      <Global styles={TOC_STYLES} />
      {children}
    </DocsContainer>
  );
}
