import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  'vaadin-tabs',
  css`
    :host {
      -webkit-tap-highlight-color: transparent;
    }

    :host {
      display: flex;
      flex-shrink: 0;
    }

    /* Hide scroll buttons when no needed, and on touch devices */

    :host(:not([overflow])) [part='forward-button'],
    :host(:not([overflow])) [part='back-button'] {
      display: none;
    }

    @media (pointer: coarse) {
      [part='back-button'],
      [part='forward-button'] {
        display: none !important;
      }
    }

    [part='forward-button'],
    [part='back-button'] {
      font-family: material-icons;
      color: var(--material-secondary-text-color);
      font-size: 24px;
      display: flex;
      flex-shrink: 0;
      flex-grow: 0;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 100%;
      transition: 0.2s opacity;
      top: 0;
    }

    [part='forward-button']:hover,
    [part='back-button']:hover {
      color: inherit;
    }

    :host(:not([dir='rtl'])) [part='forward-button'] {
      right: 0;
    }

    [part='forward-button']::after {
      content: var(--material-icons-chevron-right);
    }

    [part='back-button']::after {
      content: var(--material-icons-chevron-left);
    }

    :host([overflow]) [part='tabs']::after {
      content: '';
      display: flex;
      flex-shrink: 0;
      width: 32px;
    }

    /* Fixed width tabs */
    :host([theme~='fixed']) [part='tabs'] ::slotted(vaadin-tab) {
      flex-basis: 0.0001px;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='forward-button'] {
      left: 0;
    }

    :host([dir='rtl']) [part='forward-button']::after {
      content: var(--material-icons-chevron-left);
    }

    :host([dir='rtl']) [part='back-button']::after {
      content: var(--material-icons-chevron-right);
    }
  `,
  { moduleId: 'material-tabs' }
);
