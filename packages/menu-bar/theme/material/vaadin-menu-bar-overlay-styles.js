import { contextMenuOverlay } from '@vaadin/context-menu/theme/material/vaadin-context-menu-overlay-styles.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarOverlay = css`
  :host(:first-of-type) {
    padding-top: 5px;
  }
`;

registerStyles('vaadin-menu-bar-overlay', [menuOverlay, contextMenuOverlay, menuBarOverlay], {
  moduleId: 'material-menu-bar-overlay',
});
