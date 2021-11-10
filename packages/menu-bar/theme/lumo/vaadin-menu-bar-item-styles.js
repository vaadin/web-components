import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-context-menu-item',
  css`
    :host([theme='menu-bar-item']) [part='content'] {
      display: flex;
      /* tweak to inherit centering from menu bar button */
      align-items: inherit;
      justify-content: inherit;
    }

    :host([theme='menu-bar-item']) [part='content'] ::slotted(vaadin-icon),
    :host([theme='menu-bar-item']) [part='content'] ::slotted(iron-icon) {
      display: inline-block;
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    :host([theme='menu-bar-item']) [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']),
    :host([theme='menu-bar-item']) [part='content'] ::slotted(iron-icon[icon^='vaadin:']) {
      padding: var(--lumo-space-xs);
      box-sizing: border-box !important;
    }
  `,
  { moduleId: 'lumo-menu-bar-item' }
);
