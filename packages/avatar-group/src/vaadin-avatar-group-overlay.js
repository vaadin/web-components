/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
