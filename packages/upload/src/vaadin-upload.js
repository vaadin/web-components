/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-upload-icon.js';
import './vaadin-upload-icons.js';
import './vaadin-upload-file-list.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadStyles } from './styles/vaadin-upload-base-styles.js';
import { UploadMixin } from './vaadin-upload-mixin.js';

/**
 * `<vaadin-upload>` is a Web Component for uploading multiple files with drag and drop support.
 *
 * Example:
 *
 * ```html
 * <vaadin-upload></vaadin-upload>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name          | Description
 * -------------------|-------------------------------------
 * `primary-buttons`  | Upload container
 * `drop-label`       | Element wrapping drop label and icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `nodrop`             | Set when drag and drop is disabled (e.g., on touch devices)
 * `dragover`           | Set when the file is being dragged over the element
 * `dragover-valid`     | Set when the dragged file is valid with `maxFiles` and `accept` criteria
 * `max-files-reached`  | Set when maximum number of files that the user is allowed to add has been reached
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * `--vaadin-upload-background`                 |
 * `--vaadin-upload-border-color`               |
 * `--vaadin-upload-border-radius`              |
 * `--vaadin-upload-border-width`               |
 * `--vaadin-upload-gap`                        |
 * `--vaadin-upload-padding`                    |
 * `--vaadin-upload-drop-label-color`           |
 * `--vaadin-upload-drop-label-font-size`       |
 * `--vaadin-upload-drop-label-font-weight`     |
 * `--vaadin-upload-drop-label-gap`             |
 * `--vaadin-upload-drop-label-line-height`     |
 * `--vaadin-upload-file-list-divider-color`    |
 * `--vaadin-upload-file-list-divider-width`    |
 * `--vaadin-upload-file-border-radius`         |
 * `--vaadin-upload-file-button-background`     |
 * `--vaadin-upload-file-button-border-color`   |
 * `--vaadin-upload-file-button-border-radius`  |
 * `--vaadin-upload-file-button-border-width`   |
 * `--vaadin-upload-file-button-text-color`     |
 * `--vaadin-upload-file-button-padding`        |
 * `--vaadin-upload-file-done-color`            |
 * `--vaadin-upload-file-error-color`           |
 * `--vaadin-upload-file-error-font-size`       |
 * `--vaadin-upload-file-error-font-weight`     |
 * `--vaadin-upload-file-error-line-height`     |
 * `--vaadin-upload-file-gap`                   |
 * `--vaadin-upload-file-name-color`            |
 * `--vaadin-upload-file-name-font-size`        |
 * `--vaadin-upload-file-name-font-weight`      |
 * `--vaadin-upload-file-name-line-height`      |
 * `--vaadin-upload-file-padding`               |
 * `--vaadin-upload-file-status-color`          |
 * `--vaadin-upload-file-status-font-size`      |
 * `--vaadin-upload-file-status-font-weight`    |
 * `--vaadin-upload-file-status-line-height`    |
 * `--vaadin-upload-file-warning-color`         |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} file-reject - Fired when a file cannot be added to the queue due to a constrain.
 * @fires {CustomEvent} files-changed - Fired when the `files` property changes.
 * @fires {CustomEvent} max-files-reached-changed - Fired when the `maxFilesReached` property changes.
 * @fires {CustomEvent} upload-before - Fired before the XHR is opened.
 * @fires {CustomEvent} upload-start - Fired when the XHR is sent.
 * @fires {CustomEvent} upload-progress - Fired as many times as the progress is updated.
 * @fires {CustomEvent} upload-success - Fired in case the upload process succeeded.
 * @fires {CustomEvent} upload-error - Fired in case the upload process failed.
 * @fires {CustomEvent} upload-request - Fired when the XHR has been opened but not sent yet.
 * @fires {CustomEvent} upload-response - Fired when on the server response before analyzing it.
 * @fires {CustomEvent} upload-retry - Fired when retry upload is requested.
 * @fires {CustomEvent} upload-abort - Fired when upload abort is requested.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes UploadMixin
 */
class Upload extends UploadMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-upload';
  }

  static get styles() {
    return uploadStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
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

  /**
   * Fired when a file cannot be added to the queue due to a constrain:
   *  file-size, file-type or maxFiles
   *
   * @event file-reject
   * @param {Object} detail
   * @param {Object} detail.file the file added
   * @param {string} detail.error the cause
   */

  /**
   * Fired before the XHR is opened. Could be used for changing the request
   * URL. If the default is prevented, then XHR would not be opened.
   *
   * @event upload-before
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   * @param {Object} detail.file.uploadTarget the upload request URL, initialized with the value of vaadin-upload `target` property
   */

  /**
   * Fired when the XHR has been opened but not sent yet. Useful for appending
   * data keys to the FormData object, for changing some parameters like
   * headers, etc. If the event is defaultPrevented, `vaadin-upload` will not
   * send the request allowing the user to do something on his own.
   *
   * @event upload-request
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   * @param {Object} detail.formData the FormData object
   */

  /**
   * Fired when the XHR is sent.
   *
   * @event upload-start
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired as many times as the progress is updated.
   *
   * @event upload-progress
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded with loaded info
   */

  /**
   * Fired when we have the actual server response, and before the component
   * analyses it. It's useful for developers to make the upload fail depending
   * on the server response. If the event is defaultPrevented the vaadin-upload
   * will return allowing the user to do something on his own like retry the
   * upload, etc. since he has full access to the `xhr` and `file` objects.
   * Otherwise, if the event is not prevented default `vaadin-upload` continues
   * with the normal workflow checking the `xhr.status` and `file.error`
   * which also might be modified by the user to force a customized response.
   *
   * @event upload-response
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired in case the upload process succeed.
   *
   * @event upload-success
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded with loaded info
   */

  /**
   * Fired in case the upload process failed.
   *
   * @event upload-error
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired when retry upload is requested. If the default is prevented, then
   * retry would not be performed.
   *
   * @event upload-retry
   * @param {Object} detail
   * @param {Object} detail.xhr the previous upload xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired when retry abort is requested. If the default is prevented, then the
   * file upload would not be aborted.
   *
   * @event upload-abort
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */
}

defineCustomElement(Upload);

export { Upload };
