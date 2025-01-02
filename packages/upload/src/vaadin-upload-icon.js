/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-upload>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
class UploadIcon extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'vaadin-upload-icon';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
    `;
  }
}

defineCustomElement(UploadIcon);

export { UploadIcon };
