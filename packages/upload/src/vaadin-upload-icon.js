/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-upload>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
class UploadIcon extends ThemableMixin(LumoInjectionMixin(LitElement)) {
  static get is() {
    return 'vaadin-upload-icon';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  static get lumoInjector() {
    return {
      includeBaseStyles: true,
    };
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(UploadIcon);

export { UploadIcon };
