import { addLumoGlobalStyles } from '@vaadin/vaadin-lumo-styles/global.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

registerStyles(
  'vaadin-avatar-group',
  css`
    :host {
      --vaadin-avatar-size: 2.25rem;
    }
  `,
);

addLumoGlobalStyles(
  '',
  css`
    :host {
      --vaadin-user-color-0: #000;
      --vaadin-user-color-1: #000;
      --vaadin-user-color-2: #000;
    }
  `,
);
