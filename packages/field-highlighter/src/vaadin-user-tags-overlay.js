/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-user-tags-overlay',
  css`
    :host {
      align-items: stretch;
      justify-content: flex-start;
      background: transparent;
      box-shadow: none;
      bottom: auto;
    }

    [part='overlay'] {
      box-shadow: none;
      background: transparent;
      position: relative;
      left: -4px;
      padding: 4px;
      outline: none;
      overflow: visible;
    }

    ::slotted([part='tags']) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    :host([dir='rtl']) [part='overlay'] {
      left: auto;
      right: -4px;
    }

    [part='content'] {
      padding: 0;
    }

    :host([dir='rtl']) {
      left: auto;
    }

    :host(:not([dir='rtl'])) {
      right: auto;
    }

    :host([opening]),
    :host([closing]) {
      animation: 0.14s user-tags-overlay-dummy-animation;
    }

    @keyframes user-tags-overlay-dummy-animation {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 1;
      }
    }
  `
);

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class UserTagsOverlay extends OverlayElement {
  static get is() {
    return 'vaadin-user-tags-overlay';
  }

  ready() {
    super.ready();
    this.$.overlay.setAttribute('tabindex', '-1');
  }
}

customElements.define(UserTagsOverlay.is, UserTagsOverlay);
