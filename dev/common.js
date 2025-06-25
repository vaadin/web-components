// Add standard Lumo styles to the page. NOTE: the autoload helper is not intended for public use.
import '@vaadin/vaadin-lumo-styles/test/autoload.js';
import { css } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'dev-common',
  css`
    body {
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
    }

    .section > :is(.heading, p) {
      width: 100%;
      margin: 0;
    }
  `,
);
