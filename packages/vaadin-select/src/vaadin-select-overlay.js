/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-select-overlay',
  css`
    :host {
      align-items: flex-start;
      justify-content: flex-start;
    }
  `,
  { moduleId: 'vaadin-select-overlay-styles' }
);

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @protected
 */
class SelectOverlayElement extends OverlayElement {
  static get is() {
    return 'vaadin-select-overlay';
  }
}

customElements.define(SelectOverlayElement.is, SelectOverlayElement);
