import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const drawerToggle = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    position: relative;
    outline: none;
    width: var(--lumo-size-l);
    height: var(--lumo-size-l);
    min-width: auto;
    margin: 0 var(--lumo-space-s);
    padding: 0;
    background: transparent;
  }

  [part='icon'],
  [part='icon']::before {
    background: transparent;
    width: auto;
    height: auto;
    mask-image: none;
  }

  [part='icon']::before {
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
    content: var(--lumo-icons-menu);
  }

  :host([slot~='navbar']) {
    color: var(--lumo-secondary-text-color);
  }
`;

registerStyles('vaadin-drawer-toggle', [button, drawerToggle], { moduleId: 'lumo-drawer-toggle' });
