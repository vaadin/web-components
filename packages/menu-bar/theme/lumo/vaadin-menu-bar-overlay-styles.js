import { contextMenuOverlay } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-overlay-styles.js';
import { menuOverlay } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarOverlay = css`
  :host(:first-of-type) {
    padding-top: var(--lumo-space-xs);
  }
`;

registerStyles('vaadin-menu-bar-overlay', [menuOverlay, contextMenuOverlay, menuBarOverlay], {
  moduleId: 'lumo-menu-bar-overlay',
});
