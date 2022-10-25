/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @private
 */
class AvatarGroupOverlay extends PositionMixin(Overlay) {
  static get is() {
    return 'vaadin-avatar-group-overlay';
  }
}

customElements.define(AvatarGroupOverlay.is, AvatarGroupOverlay);
