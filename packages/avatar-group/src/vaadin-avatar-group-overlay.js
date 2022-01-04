/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-avatar-group-overlay',
  css`
    :host {
      align-items: flex-start;
      justify-content: flex-start;
    }

    :host([bottom-aligned]) {
      justify-content: flex-end;
    }
  `,
  { moduleId: 'vaadin-avatar-group-overlay-styles' }
);

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class AvatarGroupOverlay extends OverlayElement {
  static get is() {
    return 'vaadin-avatar-group-overlay';
  }
}

customElements.define(AvatarGroupOverlay.is, AvatarGroupOverlay);
