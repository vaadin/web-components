import '@vaadin/vaadin-material-styles/color.js';
import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    width: 48px;
    min-width: 0 !important;
    height: 48px;
    margin-inline-end: 1em;
    padding: 0;
    border-radius: 50%;
  }

  [part='icon'] {
    top: 18px;
    left: 15px;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    width: 18px;
    height: 2px;
    background-color: currentColor;
  }

  [part='icon']::after {
    top: 5px;
  }

  [part='icon']::before {
    top: 10px;
  }
`;

registerStyles('vaadin-drawer-toggle', [button, drawerToggle], {
  moduleId: 'material-drawer-toggle',
});
