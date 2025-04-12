import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const item = css`
  :host {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    line-height: 24px;
    min-height: 36px;
    overflow: hidden;
    padding: 8px 32px 8px 10px;
  }

  /* It's the list-box's responsibility to add the focus style */
  :host([focused]) {
    outline: none;
  }

  /* Checkmark */
  [part='checkmark']::before {
    color: var(--material-secondary-text-color);
    content: '';
    display: var(--_material-item-selected-icon-display, none);
    flex: none;
    font-family: material-icons;
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
    margin-right: 10px;
    text-align: center;
    width: 24px;
  }

  :host([selected]) [part='checkmark']::before {
    content: var(--material-icons-check);
  }

  @media (any-hover: hover) {
    :host(:hover:not([disabled])) {
      background-color: var(--material-secondary-background-color);
    }
  }

  :host([focused]:not([disabled])) {
    background-color: var(--material-divider-color);
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--material-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  /* RTL specific styles */
  :host([dir='rtl']) {
    padding: 8px 10px 8px 32px;
  }

  :host([dir='rtl']) [part='checkmark']::before {
    margin-left: 10px;
    margin-right: 0;
  }
`;

registerStyles('vaadin-item', item, { moduleId: 'material-item' });

export { item };
