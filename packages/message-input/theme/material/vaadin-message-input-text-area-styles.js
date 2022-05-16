import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-input-text-area',
  css`
    :host {
      margin: 0 0.5em 0 0;
    }

    :host([dir='rtl']) {
      margin: 0 0 0 0.5em;
    }
  `,
  { moduleId: 'material-message-input-text-area' },
);
