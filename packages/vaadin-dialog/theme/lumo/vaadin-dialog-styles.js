import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/mixins/overlay.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    /* Optical centering */
    :host::before,
    :host::after {
      content: '';
      flex-basis: 0;
      flex-grow: 1;
    }

    :host::after {
      flex-grow: 1.1;
    }

    [part='overlay'] {
      border-radius: var(--lumo-border-radius-l);
      box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-xl);
      background-image: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    [part='content'] {
      padding: var(--lumo-space-l);
    }

    /* No padding */
    :host([theme~='no-padding']) [part='content'] {
      padding: 0;
    }

    /* Animations */

    :host([opening]),
    :host([closing]) {
      animation: 0.25s lumo-overlay-dummy-animation;
    }

    :host([opening]) [part='overlay'] {
      animation: 0.12s 0.05s vaadin-dialog-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }

    @keyframes vaadin-dialog-enter {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
    }

    :host([closing]) [part='overlay'] {
      animation: 0.1s 0.03s vaadin-dialog-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
    }

    :host([closing]) [part='backdrop'] {
      animation-delay: 0.05s;
    }

    @keyframes vaadin-dialog-exit {
      100% {
        opacity: 0;
        transform: scale(1.02);
      }
    }
  `,
  { include: ['lumo-overlay'], moduleId: 'lumo-dialog' }
);
