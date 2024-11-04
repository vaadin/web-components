/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import './vaadin-upload-icons.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { UploadFileMixin } from './vaadin-upload-file-mixin.js';
import { uploadFileStyles } from './vaadin-upload-file-styles.js';

registerStyles('vaadin-upload-file', uploadFileStyles, { moduleId: 'vaadin-upload-file-styles' });

/**
 * `<vaadin-upload-file>` element represents a file in the file list of `<vaadin-upload>`.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------
 * `row`            | File container
 * `info`           | Container for file status icon, file name, status and error messages
 * `done-icon`      | File done status icon
 * `warning-icon`   | File warning status icon
 * `meta`           | Container for file name, status and error messages
 * `name`           | File name
 * `error`          | Error message, shown when error happens
 * `status`         | Status message
 * `commands`       | Container for file command buttons
 * `start-button`   | Start file upload button
 * `retry-button`   | Retry file upload button
 * `remove-button`  | Remove file button
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|-------------
 * `disabled`       | Set when the element is disabled
 * `focus-ring`     | Set when the element is focused using the keyboard.
 * `focused`        | Set when the element is focused.
 * `error`          | An error has happened during uploading.
 * `indeterminate`  | Uploading is in progress, but the progress value is unknown.
 * `uploading`      | Uploading is in progress.
 * `complete`       | Uploading has finished successfully.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes UploadFileMixin
 * @mixes ThemableMixin
 */
class UploadFile extends UploadFileMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
  static get template() {
    return html`
      <div part="row">
        <div part="info">
          <div part="done-icon" hidden$="[[!complete]]" aria-hidden="true"></div>
          <div part="warning-icon" hidden$="[[!errorMessage]]" aria-hidden="true"></div>

          <div part="meta">
            <div part="name" id="name">[[fileName]]</div>
            <div part="status" hidden$="[[!status]]" id="status">[[status]]</div>
            <div part="error" id="error" hidden$="[[!errorMessage]]">[[errorMessage]]</div>
          </div>
        </div>
        <div part="commands">
          <button
            type="button"
            part="start-button"
            file-event="file-start"
            on-click="_fireFileEvent"
            hidden$="[[!held]]"
            disabled$="[[disabled]]"
            aria-label$="[[i18n.file.start]]"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="retry-button"
            file-event="file-retry"
            on-click="_fireFileEvent"
            hidden$="[[!errorMessage]]"
            disabled$="[[disabled]]"
            aria-label$="[[i18n.file.retry]]"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="remove-button"
            file-event="file-abort"
            on-click="_fireFileEvent"
            disabled$="[[disabled]]"
            aria-label$="[[i18n.file.remove]]"
            aria-describedby="name"
          ></button>
        </div>
      </div>

      <slot name="progress"></slot>
    `;
  }

  static get is() {
    return 'vaadin-upload-file';
  }

  /**
   * Fired when the retry button is pressed. It is listened by `vaadin-upload`
   * which will start a new upload process of this file.
   *
   * @event file-retry
   * @param {Object} detail
   * @param {Object} detail.file file to retry upload of
   */

  /**
   * Fired when the start button is pressed. It is listened by `vaadin-upload`
   * which will start a new upload process of this file.
   *
   * @event file-start
   * @param {Object} detail
   * @param {Object} detail.file file to start upload of
   */

  /**
   * Fired when abort button is pressed. It is listened by `vaadin-upload` which
   * will abort the upload in progress, and then remove the file from the list.
   *
   * @event file-abort
   * @param {Object} detail
   * @param {Object} detail.file file to abort upload of
   */
}

defineCustomElement(UploadFile);

export { UploadFile };
