import '@vaadin/vaadin-material-styles/color.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { listBox } from '@vaadin/list-box/theme/material/vaadin-list-box-styles.js';
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

registerStyles('vaadin-avatar-group-menu', listBox, { moduleId: 'material-avatar-group-menu' });

registerStyles(
  'vaadin-avatar-group-menu-item',
  [
    item,
    css`
      :host {
        padding: 8px;
        padding-inline-end: 24px;
      }

      [part='content'] {
        display: flex;
        align-items: center;
      }

      [part='checkmark']::before {
        display: none;
      }

      [part='content'] ::slotted(vaadin-avatar) {
        margin-inline-end: 8px;
      }
    `,
  ],
  { moduleId: 'material-avatar-group-menu-item' },
);
