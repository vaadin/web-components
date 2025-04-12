import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const detailsSummary = css`
  :host {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    padding: var(--lumo-space-s) 0;
    border-radius: var(--lumo-border-radius-m);
    background-color: inherit;
    color: var(--lumo-secondary-text-color);
    cursor: var(--lumo-clickable-cursor);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 500;
    line-height: var(--lumo-line-height-xs);
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  :host([disabled]),
  :host([disabled]) [part='toggle'] {
    color: var(--lumo-disabled-text-color);
    cursor: default;
  }

  @media (hover: hover) {
    :host(:hover:not([disabled])),
    :host(:hover:not([disabled])) [part='toggle'] {
      color: var(--lumo-contrast-80pct);
    }
  }

  [part='toggle'] {
    display: block;
    width: 1em;
    height: 1em;
    margin-right: var(--lumo-space-xs);
    margin-left: calc(var(--lumo-space-xs) * -1);
    color: var(--lumo-contrast-60pct);
    cursor: var(--lumo-clickable-cursor);
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-s);
    line-height: 1;
  }

  [part='toggle']::before {
    content: var(--lumo-icons-angle-right);
  }

  :host([opened]) [part='toggle'] {
    transform: rotate(90deg);
  }

  [part='content'] {
    flex-grow: 1;
  }

  /* RTL styles */
  :host([dir='rtl']) [part='toggle'] {
    margin-right: calc(var(--lumo-space-xs) * -1);
    margin-left: var(--lumo-space-xs);
  }

  :host([dir='rtl']) [part='toggle']::before {
    content: var(--lumo-icons-angle-left);
  }

  :host([opened][dir='rtl']) [part='toggle'] {
    transform: rotate(-90deg);
  }

  /* Small */
  :host([theme~='small']) {
    padding-top: var(--lumo-space-xs);
    padding-bottom: var(--lumo-space-xs);
  }

  :host([theme~='small']) [part='toggle'] {
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([theme~='small'][dir='rtl']) [part='toggle'] {
    margin-left: calc(var(--lumo-space-xs) / 2);
  }

  /* Filled */
  :host([theme~='filled']) {
    padding: var(--lumo-space-s) calc(var(--lumo-space-s) + var(--lumo-space-xs) / 2);
  }

  /* Reverse */
  :host([theme~='reverse']) {
    justify-content: space-between;
  }

  :host([theme~='reverse']) [part='toggle'] {
    order: 1;
    margin-right: 0;
  }

  :host([theme~='reverse'][dir='rtl']) [part='toggle'] {
    margin-left: 0;
  }

  /* Filled reverse */
  :host([theme~='reverse'][theme~='filled']) {
    padding-left: var(--lumo-space-m);
  }

  :host([theme~='reverse'][theme~='filled'][dir='rtl']) {
    padding-right: var(--lumo-space-m);
  }
`;

registerStyles('vaadin-details-summary', detailsSummary, { moduleId: 'lumo-details-summary' });

export { detailsSummary };
