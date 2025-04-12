import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    background: transparent;
    height: var(--lumo-size-l);
    margin: 0 var(--lumo-space-s);
    min-width: auto;
    padding: 0;
    width: var(--lumo-size-l);
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    background: transparent;
    height: auto;
    position: inherit;
    top: auto;
    width: auto;
  }

  [part='icon']::before {
    content: var(--lumo-icons-menu);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
  }

  :host([slot~='navbar']) {
    color: var(--lumo-secondary-text-color);
  }
`;

registerStyles('vaadin-drawer-toggle', [button, drawerToggle], { moduleId: 'lumo-drawer-toggle' });
