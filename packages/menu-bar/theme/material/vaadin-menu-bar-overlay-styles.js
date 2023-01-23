import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar-overlay',
  css`
    :host(:first-of-type) {
      padding-top: 5px;
    }
  `,
  { moduleId: 'material-menu-bar-overlay' },
);
