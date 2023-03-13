import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { listBox } from '@vaadin/list-box/theme/lumo/vaadin-list-box-styles.js';
import { menuOverlayCore } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-avatar-group',
  css`
    :host {
      --vaadin-avatar-size: var(--lumo-size-m);
    }

    :host([theme~='xlarge']) {
      --vaadin-avatar-group-overlap: 12px;
      --vaadin-avatar-group-overlap-border: 3px;
      --vaadin-avatar-size: var(--lumo-size-xl);
    }

    :host([theme~='large']) {
      --vaadin-avatar-group-overlap: 10px;
      --vaadin-avatar-group-overlap-border: 3px;
      --vaadin-avatar-size: var(--lumo-size-l);
    }

    :host([theme~='small']) {
      --vaadin-avatar-group-overlap: 6px;
      --vaadin-avatar-group-overlap-border: 2px;
      --vaadin-avatar-size: var(--lumo-size-s);
    }

    :host([theme~='xsmall']) {
      --vaadin-avatar-group-overlap: 4px;
      --vaadin-avatar-group-overlap-border: 2px;
      --vaadin-avatar-size: var(--lumo-size-xs);
    }
  `,
  { moduleId: 'lumo-avatar-group' },
);

const avatarGroupOverlay = css`
  :host {
    --_lumo-list-box-item-selected-icon-display: none;
    --_lumo-list-box-item-padding-left: calc(var(--lumo-space-m) + var(--lumo-border-radius-m) / 4);
  }

  [part='overlay'] {
    outline: none;
  }
`;

registerStyles('vaadin-avatar-group-overlay', [overlay, menuOverlayCore, avatarGroupOverlay], {
  moduleId: 'lumo-avatar-group-overlay',
});

registerStyles('vaadin-avatar-group-menu', listBox, { moduleId: 'lumo-avatar-group-menu' });

registerStyles(
  'vaadin-avatar-group-menu-item',
  [
    item,
    css`
      :host {
        padding: var(--lumo-space-xs);
        padding-inline-end: var(--lumo-space-m);
      }

      [part='content'] {
        display: flex;
        align-items: center;
      }

      [part='content'] ::slotted(vaadin-avatar) {
        width: var(--lumo-size-xs);
        height: var(--lumo-size-xs);
        margin-inline-end: var(--lumo-space-s);
      }
    `,
  ],
  { moduleId: 'lumo-avatar-group-menu-item' },
);
