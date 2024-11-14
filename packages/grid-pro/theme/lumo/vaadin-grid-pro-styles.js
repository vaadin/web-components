import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    }

    [part~='editable-cell'],
    [part~='editable-cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: var(--lumo-clickable-cursor);
    }

    [part~='editable-cell']:hover,
    [part~='editable-cell']:focus {
      background: var(--lumo-base-color) linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
    }

    /* Indicate editable cells */

    :host([theme~='highlight-editable-cells']) [part~='editable-cell'] {
      background: var(--lumo-base-color) linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
    }

    :host([theme~='highlight-editable-cells']) [part~='editable-cell']:hover,
    :host([theme~='highlight-editable-cells']) [part~='editable-cell']:focus {
      background: var(--lumo-base-color) linear-gradient(var(--lumo-contrast-10pct), var(--lumo-contrast-10pct));
    }

    /* Indicate read-only cells */

    /* prettier-ignore */
    :host([theme~='highlight-read-only-cells']) [tabindex]:not([part~='editable-cell']):not([part~='header-cell']):not([part~='footer-cell']) {
      background-image: repeating-linear-gradient(
        135deg,
        transparent,
        transparent 6px,
        var(--lumo-contrast-5pct) 6px,
        var(--lumo-contrast-5pct) 14px
      );
    }

    /* Loading editor cell styles are used by Flow GridPro */
    :host([loading-editor]) [part~='focused-cell']::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) transparent;
      animation: vaadin-grid-pro-loading-editor 1.4s infinite;
    }

    :host([loading-editor]) [part~='focused-cell'] ::slotted(vaadin-grid-cell-content) {
      opacity: 0;
      pointer-events: none;
    }

    @keyframes vaadin-grid-pro-loading-editor {
      50% {
        box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
      }
    }
  `,
  { moduleId: 'lumo-grid-pro' },
);
