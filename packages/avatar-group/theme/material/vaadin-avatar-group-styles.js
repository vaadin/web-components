import '@vaadin/vaadin-material-styles/color.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-avatar-group',
  css`
    :host {
      --vaadin-avatar-size: 2.25rem;
    }

    :host([theme~='xlarge']) {
      --vaadin-avatar-group-overlap: 12px;
      --vaadin-avatar-group-overlap-border: 3px;
      --vaadin-avatar-size: 3.5rem;
    }

    :host([theme~='large']) {
      --vaadin-avatar-group-overlap: 10px;
      --vaadin-avatar-group-overlap-border: 3px;
      --vaadin-avatar-size: 2.75rem;
    }

    :host([theme~='small']) {
      --vaadin-avatar-group-overlap: 6px;
      --vaadin-avatar-group-overlap-border: 2px;
      --vaadin-avatar-size: 1.875rem;
    }

    :host([theme~='xsmall']) {
      --vaadin-avatar-group-overlap: 4px;
      --vaadin-avatar-group-overlap-border: 2px;
      --vaadin-avatar-size: 1.625rem;
    }
  `,
  { moduleId: 'material-avatar-group' },
);

const avatarGroupOverlay = css`
  [part='overlay'] {
    outline: none;
  }
`;

registerStyles('vaadin-avatar-group-overlay', [menuOverlay, avatarGroupOverlay], {
  moduleId: 'material-avatar-group-overlay',
});

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
  `,
  { moduleId: 'material-avatar-group-list-box' },
);

registerStyles(
  'vaadin-item',
  css`
    :host([theme='avatar-group-item']) [part='content'] {
      display: flex;
      align-items: center;
    }

    :host([theme='avatar-group-item']) [part='checkmark']::before {
      display: none;
    }

    :host([theme='avatar-group-item']:not([dir='rtl'])) ::slotted(vaadin-avatar) {
      margin-right: 8px;
    }

    :host([theme='avatar-group-item'][dir='rtl']) ::slotted(vaadin-avatar) {
      margin-left: 8px;
    }
  `,
  { moduleId: 'material-avatar-group-item' },
);
