import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tooltip-overlay',
  css`
    :host {
      --vaadin-tooltip-offset-top: 0;
      --vaadin-tooltip-offset-bottom: 0;
      --vaadin-tooltip-offset-start: 0;
      --vaadin-tooltip-offset-end: 0;
    }

    [part='overlay'] {
      width: 50px;
      border: 1px solid blue;
    }
  `,
);
