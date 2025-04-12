import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    width: var(--lumo-size-l);
    min-width: auto;
    height: var(--lumo-size-l);
    margin: 0 var(--lumo-space-s);
    padding: 0;
    background: transparent;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    position: inherit;
    top: auto;
    width: auto;
    height: auto;
    background: transparent;
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
