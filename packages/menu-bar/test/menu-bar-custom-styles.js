import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar',
  css`
    :host([theme='big']) ::slotted(vaadin-menu-bar-button) {
      width: 100px;
    }
  `,
  { moduleId: 'vaadin-menu-bar-test-styles' },
);
