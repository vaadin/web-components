/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { styles } from '@vaadin/context-menu/src/vaadin-menu-overlay-styles.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-menu-bar-overlay', styles, { moduleId: 'vaadin-menu-bar-overlay-styles' });

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @mixes MenuOverlayMixin
 * @private
 */
class MenuBarOverlay extends MenuOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-menu-bar-overlay';
  }
}

customElements.define(MenuBarOverlay.is, MenuBarOverlay);
