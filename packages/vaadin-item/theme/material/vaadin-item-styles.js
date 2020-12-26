import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';

registerStyles(
  'vaadin-item',
  css`
    :host {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      overflow: hidden;
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
      line-height: 24px;
      padding: 4px 0;
    }

    /* It's the list-box's responsibility to add the focus style */
    :host([focused]) {
      outline: none;
    }

    /* Checkmark */
    :host::before {
      display: var(--_material-item-selected-icon-display, none);
      content: '';
      font-family: material-icons;
      font-size: 24px;
      line-height: 1;
      font-weight: 400;
      width: 24px;
      text-align: center;
      margin-right: 10px;
      color: var(--material-secondary-text-color);
      flex: none;
    }

    :host([selected])::before {
      content: var(--material-icons-check);
    }

    /* Disabled */
    :host([disabled]) {
      color: var(--material-disabled-text-color);
      cursor: default;
      pointer-events: none;
    }

    /* RTL specific styles */
    :host([dir='rtl'])::before {
      margin-right: 0;
      margin-left: 10px;
    }
  `,
  { moduleId: 'material-item' }
);
