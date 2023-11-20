import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tabs',
  css`
    [part='forward-button'],
    [part='back-button'] {
      transition: none;
    }
  `,
);
