import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-app-layout',
  css`
    :host,
    :host([overlay]) [part='backdrop'],
    [part='drawer'] {
      height: inherit;
    }
  `,
);
