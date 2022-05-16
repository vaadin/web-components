import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const contextMenuOverlay = css`
  [part='overlay'] {
    outline: none;
    will-change: transform, opacity;
  }
`;

registerStyles('vaadin-context-menu-overlay', [menuOverlay, contextMenuOverlay], {
  moduleId: 'material-context-menu-overlay',
});

registerStyles(
  'vaadin-context-menu-list-box',
  css`
    [part='items'] ::slotted(.vaadin-menu-item:not(hr)) {
      min-height: 36px;
      padding: 8px 32px 8px 10px;
      font-size: var(--material-small-font-size);
      line-height: 24px;
    }

    :host([dir='rtl']) [part='items'] ::slotted(.vaadin-menu-item:not(hr)) {
      padding: 8px 10px 8px 32px;
    }

    [part='items'] ::slotted(.vaadin-menu-item:hover:not([disabled])) {
      background-color: var(--material-secondary-background-color);
    }

    [part='items'] ::slotted(.vaadin-menu-item[focused]:not([disabled])) {
      background-color: var(--material-divider-color);
    }

    @media (pointer: coarse) {
      [part='items'] ::slotted(.vaadin-menu-item:hover:not([disabled])),
      [part='items'] ::slotted(.vaadin-menu-item[focused]:not([disabled])) {
        background-color: transparent;
      }
    }
  `,
  { moduleId: 'material-context-menu-list-box' },
);

registerStyles(
  'vaadin-context-menu-item',
  css`
    :host(.vaadin-menu-item.vaadin-context-menu-parent-item)::after {
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
    }

    :host(:not([dir='rtl']).vaadin-menu-item.vaadin-context-menu-parent-item)::after {
      content: var(--material-icons-chevron-right);
      padding-left: 9px;
      margin-right: -9px;
    }

    :host([dir='rtl'].vaadin-menu-item.vaadin-context-menu-parent-item)::after {
      content: var(--material-icons-chevron-left);
      padding-right: 9px;
      margin-left: -9px;
    }

    :host(.vaadin-menu-item)::before {
      display: block;
    }

    :host(.vaadin-menu-item[menu-item-checked]) [part='checkmark']::before {
      content: var(--material-icons-check);
    }

    :host([expanded]) {
      background-color: var(--material-secondary-background-color);
    }
  `,
  { moduleId: 'material-context-menu-item' },
);
