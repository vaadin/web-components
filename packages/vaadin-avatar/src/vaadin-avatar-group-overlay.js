/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
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
 * The overlay element.
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-avatar-group-overlay>` parts.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
 */
class AvatarGroupOverlayElement extends OverlayElement {
  static get is() {
    return 'vaadin-avatar-group-overlay';
  }
}

customElements.define(AvatarGroupOverlayElement.is, AvatarGroupOverlayElement);
