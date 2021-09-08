/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

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
class AvatarGroupOverlayElement extends OverlayElement {
  static get is() {
    return 'vaadin-avatar-group-overlay';
  }
}

customElements.define(AvatarGroupOverlayElement.is, AvatarGroupOverlayElement);
