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
 * The avatar element for message.
 *
 * ### Styling
 *
 * See [`<vaadin-avatar>` documentation](https://github.com/vaadin/vaadin-avatar/blob/master/src/vaadin-avatar.js)
 * for `<vaadin-message-avatar>` parts and available slots
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin#readme)
 *
 * @extends AvatarElement
 */
class MessageAvatarElement extends AvatarElement {
  static get is() {
    return 'vaadin-message-avatar';
  }

  static get version() {
    return '2.0.0-alpha1';
  }
}

customElements.define(MessageAvatarElement.is, MessageAvatarElement);
