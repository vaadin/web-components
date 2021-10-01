import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  'vaadin-list-box',
  css`
    :host {
      -webkit-tap-highlight-color: transparent;
      --_material-item-selected-icon-display: block;
    }

    [part='items'] ::slotted(*) {
      cursor: default;
    }

    [part='items'] ::slotted(vaadin-item) {
      min-height: 36px;
      padding: 8px 32px 8px 10px;
      font-size: var(--material-small-font-size);
      line-height: 24px;
    }

    [part='items'] ::slotted(vaadin-item:hover:not([disabled])) {
      background-color: var(--material-secondary-background-color);
    }

    [part='items'] ::slotted(vaadin-item[focused]:not([disabled])) {
      background-color: var(--material-divider-color);
    }

    @media (pointer: coarse) {
      [part='items'] ::slotted(vaadin-item:hover:not([disabled])),
      [part='items'] ::slotted(vaadin-item[focused]:not([disabled])) {
        background-color: transparent;
      }
    }

    /* Dividers */
    [part='items'] ::slotted(hr) {
      height: 1px;
      border: 0;
      padding: 0;
      margin: 8px 0;
      background-color: var(--material-divider-color);
    }

    /* RTL specific styles */
    :host([dir='rtl']) [part='items'] ::slotted(vaadin-item) {
      padding: 8px 10px 8px 32px;
    }
  `,
  { moduleId: 'material-list-box' }
);
