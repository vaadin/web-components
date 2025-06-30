import { css } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'dev-common',
  css`
    html {
      color-scheme: light dark;
    }

    body {
      font-family: system-ui, sans-serif;
      line-height: 1.25;
      margin: 2rem;
    }

    .heading {
      font-weight: 600;
      font-size: calc(18 / 16 * 1rem);
      line-height: calc(20 / 16 * 1rem);
      margin: 2em 0 1.25em;
      text-box: cap alphabetic;
    }

    .section {
      display: flex;
      flex-wrap: wrap;
      gap: 1lh 1.5lh;
      margin: 2lh 0;
      align-items: baseline;
    }

    .section > :is(.heading, p) {
      width: 100%;
      margin: 0;
    }
  `,
);
