/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-upload-file.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadFileListStyles } from './styles/vaadin-upload-file-list-core-styles.js';
import { UploadFileListMixin } from './vaadin-upload-file-list-mixin.js';

/**
 * An element used internally by `<vaadin-upload>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes UploadFileListMixin
 * @private
 */
class UploadFileList extends UploadFileListMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-upload-file-list';
  }

  static get styles() {
    return uploadFileListStyles;
  }

  /** @protected */
  render() {
    return html`
      <ul part="list">
        <slot></slot>
      </ul>
    `;
  }
}

defineCustomElement(UploadFileList);

export { UploadFileList };
