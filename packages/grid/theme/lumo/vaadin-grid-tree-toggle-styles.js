import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-tree-toggle',
  css`
    :host {
      --vaadin-grid-tree-toggle-level-offset: 2em;
      align-items: center;
      -webkit-tap-highlight-color: transparent;
      transform: translateX(calc(var(--lumo-space-s) * -1));
      vertical-align: middle;
    }

    :host(:not([leaf])) {
      cursor: default;
    }

    [part='toggle'] {
      display: inline-block;
      width: 1em;
      height: 1em;
      margin: calc(1em / -3);
      /* Increase touch target area */
      padding: calc(1em / 3);
      color: var(--lumo-contrast-50pct);
      font-size: 1.5em;
      line-height: 1;
      text-align: center;
      cursor: var(--lumo-clickable-cursor);
    }

    :host(:not([dir='rtl'])) [part='toggle'] {
      margin-right: 0;
    }

    @media (hover: hover) {
      :host(:hover) [part='toggle'] {
        color: var(--lumo-contrast-80pct);
      }
    }

    [part='toggle']::before {
      display: inline-block;
      height: 100%;
      font-family: 'lumo-icons';
    }

    :host(:not([expanded])) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
    }

    :host([expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
      transform: rotate(90deg);
    }

    /* RTL specific styles */

    :host([dir='rtl']) {
      margin-right: calc(var(--lumo-space-s) * -1);
      margin-left: 0;
    }

    :host([dir='rtl']) [part='toggle'] {
      margin-left: 0;
    }

    :host([dir='rtl'][expanded]) [part='toggle']::before {
      transform: rotate(-90deg);
    }

    :host([dir='rtl']:not([expanded])) [part='toggle']::before,
    :host([dir='rtl'][expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-left);
    }
  `,
  { moduleId: 'lumo-grid-tree-toggle' },
);
