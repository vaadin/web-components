import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const contextMenuItem = css`
  :host([aria-haspopup='true'])::after {
    font-family: material-icons;
    font-size: var(--material-icon-font-size);
  }

  :host(:not([dir='rtl'])[aria-haspopup='true'])::after {
    content: var(--material-icons-chevron-right);
    padding-left: 9px;
    margin-right: -9px;
  }

  :host([dir='rtl'][aria-haspopup='true'])::after {
    content: var(--material-icons-chevron-left);
    padding-right: 9px;
    margin-left: -9px;
  }

  :host([menu-item-checked]) [part='checkmark']::before {
    content: var(--material-icons-check);
  }

  :host([expanded]) {
    background-color: var(--material-secondary-background-color);
  }
`;

registerStyles('vaadin-context-menu-item', [item, contextMenuItem], { moduleId: 'material-context-menu-item' });

export { contextMenuItem };
