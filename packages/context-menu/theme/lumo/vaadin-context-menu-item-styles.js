import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const contextMenuItem = css`
  /* :hover needed to workaround https://github.com/vaadin/web-components/issues/3133 */
  :host(:hover) {
    -webkit-user-select: none;
    user-select: none;
  }

  :host([role='menuitem'][menu-item-checked]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([aria-haspopup='true'])::after {
    color: var(--lumo-tertiary-text-color);
    content: var(--lumo-icons-angle-right);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-xs);
  }

  :host(:not([dir='rtl'])[aria-haspopup='true'])::after {
    padding-left: var(--lumo-space-m);
    margin-right: calc(var(--lumo-space-m) * -1);
  }

  :host([expanded]) {
    background-color: var(--lumo-primary-color-10pct);
  }

  /* RTL styles */
  :host([dir='rtl'][aria-haspopup='true'])::after {
    padding-right: var(--lumo-space-m);
    margin-left: calc(var(--lumo-space-m) * -1);
    content: var(--lumo-icons-angle-left);
  }
`;

registerStyles('vaadin-context-menu-item', [item, contextMenuItem], { moduleId: 'lumo-context-menu-item' });

export { contextMenuItem };
