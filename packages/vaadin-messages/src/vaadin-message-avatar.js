/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { AvatarElement } from '@vaadin/vaadin-avatar/src/vaadin-avatar.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-message-avatar',
  css`
    :host {
      --vaadin-avatar-outline-width: 0px; /* stylelint-disable-line length-zero-no-unit */
      flex-shrink: 0;
    }
  `,
  { moduleId: 'vaadin-message-avatar-styles' }
);

/**
 * An element used internally by `<vaadin-message>`. Not intended to be used separately.
 *
 * @extends AvatarElement
 * @private
 */
class MessageAvatarElement extends AvatarElement {
  static get is() {
    return 'vaadin-message-avatar';
  }

  static get version() {
    return '21.0.4';
  }
}

customElements.define(MessageAvatarElement.is, MessageAvatarElement);
