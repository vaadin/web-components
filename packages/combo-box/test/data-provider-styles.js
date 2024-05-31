import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-combo-box*',
  css`
    :host {
      --vaadin-combo-box-overlay-max-height: 400px;
    }
  `,
);
