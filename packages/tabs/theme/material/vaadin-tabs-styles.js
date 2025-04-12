import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tabs',
  css`
    :host {
      display: flex;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
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
      align-items: center;
      color: var(--material-secondary-text-color);
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      font-family: material-icons;
      font-size: 24px;
      height: 100%;
      justify-content: center;
      top: 0;
      transition: 0.2s opacity;
      width: 48px;
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
  { moduleId: 'material-tabs' },
);
