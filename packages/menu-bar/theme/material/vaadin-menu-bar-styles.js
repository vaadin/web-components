import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar',
  css`
    [part='container'] {
      /* To retain the box-shadow */
      padding-bottom: 5px;
    }

    :host([has-single-button]) ::slotted(vaadin-menu-bar-button) {
      border-radius: 4px;
    }

    :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button[first-visible]),
    :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
      margin-inline-start: auto;
    }
  `,
  { moduleId: 'material-menu-bar' },
);
