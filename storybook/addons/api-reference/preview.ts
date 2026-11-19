import { definePreviewAddon, type PreviewAddon } from 'storybook/internal/csf';
import { ApiDocsContainer, ApiDocsPage, overviewEntry } from './blocks/index.js';

export default (): PreviewAddon =>
  definePreviewAddon({
    parameters: {
      docs: {
        container: ApiDocsContainer,
        page: ApiDocsPage,
        toc: {
          title: 'On this page',
          headingSelector: 'h1, h2, h3',
          unsafeTocbotOptions: { collapseDepth: 2, headingObjectCallback: overviewEntry },
        },
      },
    },
  });
