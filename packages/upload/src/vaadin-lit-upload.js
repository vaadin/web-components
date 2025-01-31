/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import './vaadin-lit-upload-icon.js';
import './vaadin-upload-icons.js';
import './vaadin-lit-upload-file-list.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { UploadMixin } from './vaadin-upload-mixin.js';

/**
 * LitElement based version of `<vaadin-upload>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Upload extends UploadMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-upload';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      :host([hidden]) {
        display: none !important;
      }

      [hidden] {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div part="primary-buttons">
        <slot name="add-button"></slot>
        <div part="drop-label" ?hidden="${this.nodrop}" id="dropLabelContainer" aria-hidden="true">
          <slot name="drop-label-icon"></slot>
          <slot name="drop-label"></slot>
        </div>
      </div>
      <slot name="file-list"></slot>
      <slot></slot>
      <input
        type="file"
        id="fileInput"
        hidden
        @change="${this._onFileInputChange}"
        accept="${this.accept}"
        ?multiple="${this._isMultiple(this.maxFiles)}"
        capture="${ifDefined(this.capture)}"
      />
    `;
  }
}

defineCustomElement(Upload);

export { Upload };
