import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active::before {
      position: absolute;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
      content: '';
      inset: 0;
      pointer-events: none;
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
      position: absolute;
      animation: vaadin-grid-pro-loading-editor 1.4s infinite;
      box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
      content: '';
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }

    @keyframes vaadin-grid-pro-loading-editor {
      50% {
        opacity: 1;
      }
    }

    [part~='updating-cell']::after {
      position: absolute;
      border-radius: 4px;
      margin: var(--_focus-ring-width);
      animation: vaadin-grid-pro-updating-cell 1.3s ease-out infinite;
      background-image: linear-gradient(90deg, transparent, var(--lumo-contrast-10pct), transparent);
      background-position: min(-200%, -4em) 0;
      background-repeat: no-repeat;
      background-size: max(4em, 50%);
      content: '';
      inset: var(--_cell-padding);
    }

    @keyframes vaadin-grid-pro-updating-cell {
      100% {
        background-position: max(300%, 8em) 0;
      }
    }
  `,
  { moduleId: 'lumo-grid-pro' },
);
