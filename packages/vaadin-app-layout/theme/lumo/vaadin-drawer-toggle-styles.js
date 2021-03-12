import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-button/theme/lumo/vaadin-button-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';

registerStyles(
  'vaadin-drawer-toggle',
  css`
    :host {
      width: var(--lumo-size-l);
      height: var(--lumo-size-l);
      min-width: auto;
      margin: 0 var(--lumo-space-s);
      padding: 0;
      background: transparent;
    }

    [part='icon'],
    [part='icon']::after,
    [part='icon']::before {
      position: inherit;
      height: auto;
      width: auto;
      background: transparent;
      top: auto;
    }

    [part='icon']::before {
      font-family: lumo-icons;
      font-size: var(--lumo-icon-size-m);
      content: var(--lumo-icons-menu);
    }
  `,
  { include: ['lumo-button'], moduleId: 'lumo-drawer-toggle' }
);
