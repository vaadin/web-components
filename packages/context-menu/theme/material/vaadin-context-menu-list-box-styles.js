import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { listBox } from '@vaadin/list-box/theme/material/vaadin-list-box-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const contextMenuListBox = css`
  [part='items'] ::slotted([role='menuitem']) {
    min-height: 36px;
    padding: 8px 32px 8px 10px;
    font-size: var(--material-small-font-size);
    line-height: 24px;
  }

  :host([dir='rtl']) [part='items'] ::slotted([role='menuitem']) {
    padding: 8px 10px 8px 32px;
  }

  [part='items'] ::slotted([role='menuitem']:hover:not([disabled])) {
    background-color: var(--material-secondary-background-color);
  }

  [part='items'] ::slotted([role='menuitem'][focused]:not([disabled])) {
    background-color: var(--material-divider-color);
  }

  @media (pointer: coarse) {
    [part='items'] ::slotted([role='menuitem']:hover:not([disabled])),
    [part='items'] ::slotted([role='menuitem'][focused]:not([disabled])) {
      background-color: transparent;
    }
  }
`;

registerStyles('vaadin-context-menu-list-box', [listBox, contextMenuListBox], {
  moduleId: 'material-context-menu-list-box',
});

export { contextMenuListBox };
