import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';

registerStyles(
  'vaadin-avatar-group-overlay',
  css`
    [part='overlay'] {
      outline: none;
    }
  `,
  { include: ['material-menu-overlay'], moduleId: 'material-avatar-group-overlay' }
);

registerStyles(
  'vaadin-avatar-group-list-box',
  css`
    [part='items'] ::slotted(vaadin-item[theme='avatar-group-item']) {
      padding: 8px;
      padding-right: 24px;
    }

    :host([dir='rtl']) [part='items'] ::slotted(vaadin-item[theme='avatar-group-item']) {
      padding: 8px;
      padding-left: 24px;
    }

    [part='items'] ::slotted(vaadin-item[theme='avatar-group-item'])::before {
      display: none;
    }
  `,
  { moduleId: 'material-avatar-group-list-box' }
);

registerStyles(
  'vaadin-item',
  css`
    :host([theme='avatar-group-item']) [part='content'] {
      display: flex;
      align-items: center;
    }

    :host([theme='avatar-group-item']:not([dir='rtl'])) ::slotted(vaadin-avatar) {
      margin-right: 8px;
    }

    :host([theme='avatar-group-item'][dir='rtl']) ::slotted(vaadin-avatar) {
      margin-left: 8px;
    }
  `,
  { moduleId: 'material-avatar-group-item' }
);
