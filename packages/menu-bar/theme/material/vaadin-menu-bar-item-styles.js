import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-context-menu-item',
  css`
    :host([theme='menu-bar-item']) [part='content'] {
      display: flex;
      /* tweak to inherit centering from menu bar button */
      align-items: inherit;
      justify-content: inherit;
      font-size: var(--material-button-font-size);
    }

    :host([theme='menu-bar-item']) [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']),
    :host([theme='menu-bar-item']) [part='content'] ::slotted(iron-icon[icon^='vaadin:']) {
      display: inline-block;
      width: 18px;
      height: 18px;
      box-sizing: border-box !important;
    }
  `,
  { moduleId: 'material-menu-bar-item' }
);
