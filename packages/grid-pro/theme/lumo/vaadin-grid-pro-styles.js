import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
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

    :host([theme~='highlight-read-only-cells']) [part~='body-cell']:not([part~='editable-cell']) {
      background-image: repeating-linear-gradient(
        135deg,
        transparent,
        transparent 6px,
        var(--lumo-contrast-5pct) 6px,
        var(--lumo-contrast-5pct) 14px
      );
    }
  `,
  { moduleId: 'lumo-grid-pro' },
);
