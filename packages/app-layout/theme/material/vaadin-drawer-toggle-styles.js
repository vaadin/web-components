import '@vaadin/vaadin-material-styles/color.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    min-width: 0 !important;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
    margin-inline-end: 1em;
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
`;

export { drawerToggle };
