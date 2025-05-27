import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'dev-common',
  css`
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.25;
      color: var(--_vaadin-color);
      background: var(--_vaadin-background);
      margin: 2rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--_vaadin-color-strong);
      font-weight: 600;
      font-size: calc(18 / 16 * 1rem);
      line-height: calc(20 / 16 * 1rem);
      margin: 2em 0 1.25em;
      text-box: cap alphabetic;
    }

    section {
      display: flex;
      flex-wrap: wrap;
      gap: 1lh 1.5lh;
      margin: 2lh 0;
    }

    section > :is(h1, h2, h3, h4, h5, h6, p) {
      width: 100%;
      margin: 0;
    }
  `,
);
