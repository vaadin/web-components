/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MenuOverlayMixin } from './vaadin-menu-overlay-mixin.js';
import { styles } from './vaadin-menu-overlay-styles.js';

registerStyles('vaadin-context-menu-overlay', styles, { moduleId: 'vaadin-context-menu-overlay-styles' });

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @mixes MenuOverlayMixin
 * @protected
 */
export class ContextMenuOverlay extends MenuOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-context-menu-overlay';
  }
}

customElements.define(ContextMenuOverlay.is, ContextMenuOverlay);
