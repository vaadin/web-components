import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button-styles.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  'vaadin-drawer-toggle',
  css`
    :host {
      min-width: 0 !important;
      width: 48px;
      height: 48px;
      padding: 0;
      border-radius: 50%;
    }

    :host(:not([dir='rtl'])) {
      margin-right: 1em;
    }

    :host([dir='rtl']) {
      margin-left: 1em;
    }

    [part='icon'],
    [part='icon']::after,
    [part='icon']::before {
      background-color: currentColor;
    }

    [part='icon'] {
      top: 18px;
      left: 15px;
    }

    [part='icon'],
    [part='icon']::after,
    [part='icon']::before {
      height: 2px;
      width: 18px;
    }

    [part='icon']::after {
      top: 5px;
    }

    [part='icon']::before {
      top: 10px;
    }
  `,
  { include: ['material-button'], moduleId: 'material-drawer-toggle' }
);
