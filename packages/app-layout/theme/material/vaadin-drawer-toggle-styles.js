import '@vaadin/vaadin-material-styles/color.js';
import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    border-radius: 50%;
    height: 48px;
    margin-inline-end: 1em;
    min-width: 0 !important;
    padding: 0;
    width: 48px;
  }

  [part='icon'] {
    left: 15px;
    top: 18px;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    background-color: currentColor;
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

registerStyles('vaadin-drawer-toggle', [button, drawerToggle], {
  moduleId: 'material-drawer-toggle',
});
