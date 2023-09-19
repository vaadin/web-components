/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import './vaadin-upload-icons.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { UploadFileMixin } from './vaadin-upload-file-mixin.js';
import { uploadFileStyles } from './vaadin-upload-file-styles.js';

/**
 * LitElement based version of `<vaadin-upload-file>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class UploadFile extends UploadFileMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-file';
  }

  static get styles() {
    return uploadFileStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="row">
        <div part="info">
          <div part="done-icon" ?hidden="${!this.complete}" aria-hidden="true"></div>
          <div part="warning-icon" ?hidden="${!this.errorMessage}" aria-hidden="true"></div>

          <div part="meta">
            <div part="name" id="name">${this.fileName}</div>
            <div part="status" ?hidden="${!this.status}" id="status">${this.status}</div>
            <div part="error" id="error" ?hidden="${!this.errorMessage}">${this.errorMessage}</div>
          </div>
        </div>
        <div part="commands">
          <button
            type="button"
            part="start-button"
            file-event="file-start"
            @click="${this._fireFileEvent}"
            ?hidden="${!this.held}"
            aria-label="${this.i18n.file.start}"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="retry-button"
            file-event="file-retry"
            @click="${this._fireFileEvent}"
            ?hidden="${!this.errorMessage}"
            aria-label="${this.i18n.file.retry}"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="remove-button"
            file-event="file-abort"
            @click="${this._fireFileEvent}"
            aria-label="${this.i18n.file.remove}"
            aria-describedby="name"
          ></button>
        </div>
      </div>

      <slot name="progress"></slot>
    `;
  }
}

defineCustomElement(UploadFile);

export { UploadFile };
