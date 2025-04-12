import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-icon',
  css`
    :host {
      height: 24px;
      width: 24px;
    }
  `,
  { moduleId: 'material-icon' },
);
