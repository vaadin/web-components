import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';

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

    [part~='editable-cell']:hover,
    [part~='editable-cell']:focus {
      background-color: var(--lumo-contrast-5pct);
      background-clip: padding-box;
    }

    /* Indicate editable cells */

    :host([theme~='highlight-editable-cells']) [part~='editable-cell'] {
      background-color: var(--lumo-contrast-5pct);
      background-clip: border-box;
    }

    :host([theme~='highlight-editable-cells']) [part~='editable-cell']:hover,
    :host([theme~='highlight-editable-cells']) [part~='editable-cell']:focus {
      background-color: var(--lumo-contrast-10pct);
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
  { moduleId: 'lumo-grid-pro' }
);
