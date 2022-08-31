/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import './vaadin-upload-icons.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * `progress`       | Progress bar
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|-------------
 * `focus-ring`     | Set when the element is focused using the keyboard.
 * `focused`        | Set when the element is focused.
 * `error`          | An error has happened during uploading.
 * `indeterminate`  | Uploading is in progress, but the progress value is unknown.
 * `uploading`      | Uploading is in progress.
 * `complete`       | Uploading has finished successfully.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes FocusMixin
 * @mixes ThemableMixin
 */
class UploadFile extends FocusMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        [hidden] {
          display: none;
        }

        [part='row'] {
          list-style-type: none;
        }

        button {
          background: transparent;
          padding: 0;
          border: none;
          box-shadow: none;
        }
      </style>

      <div part="row">
        <div part="info">
          <div part="done-icon" hidden$="[[!file.complete]]" aria-hidden="true"></div>
          <div part="warning-icon" hidden$="[[!file.error]]" aria-hidden="true"></div>

          <div part="meta">
            <div part="name" id="name">[[file.name]]</div>
            <div part="status" hidden$="[[!file.status]]" id="status">[[file.status]]</div>
            <div part="error" id="error" hidden$="[[!file.error]]">[[file.error]]</div>
          </div>
        </div>
        <div part="commands">
          <button
            type="button"
            part="start-button"
            file-event="file-start"
            on-click="_fireFileEvent"
            hidden$="[[!file.held]]"
            aria-label$="[[i18n.file.start]]"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="retry-button"
            file-event="file-retry"
            on-click="_fireFileEvent"
            hidden$="[[!file.error]]"
            aria-label$="[[i18n.file.retry]]"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="remove-button"
            file-event="file-abort"
            on-click="_fireFileEvent"
            aria-label$="[[i18n.file.remove]]"
            aria-describedby="name"
          ></button>
        </div>
      </div>

      <vaadin-progress-bar
        part="progress"
        id="progress"
        value$="[[_formatProgressValue(file.progress)]]"
        error$="[[file.error]]"
        indeterminate$="[[file.indeterminate]]"
        uploading$="[[file.uploading]]"
        complete$="[[file.complete]]"
      ></vaadin-progress-bar>
    `;
  }

  static get is() {
    return 'vaadin-upload-file';
  }

  static get properties() {
    return {
      file: Object,

      i18n: Object,

      /**
       * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
       * @protected
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return [
      '_fileAborted(file.abort)',
      '_toggleHostAttribute(file.error, "error")',
      '_toggleHostAttribute(file.indeterminate, "indeterminate")',
      '_toggleHostAttribute(file.uploading, "uploading")',
      '_toggleHostAttribute(file.complete, "complete")',
    ];
  }

  /** @protected */
  ready() {
    super.ready();

    // Handle moving focus to the button on Tab.
    this.shadowRoot.addEventListener('focusin', (e) => {
      const target = e.composedPath()[0];

      if (target.getAttribute('part').endsWith('button')) {
        this._setFocused(false);
      }
    });

    // Handle moving focus from the button on Shift Tab.
    this.shadowRoot.addEventListener('focusout', (e) => {
      if (e.relatedTarget === this) {
        this._setFocused(true);
      }
    });
  }

  /**
   * Override method inherited from `FocusMixin` to mark the file as focused
   * only when the host is focused.
   * @param {Event} event
   * @return {boolean}
   * @protected
   */
  _shouldSetFocus(event) {
    return event.composedPath()[0] === this;
  }

  /** @private */
  _fileAborted(abort) {
    if (abort) {
      this._remove();
    }
  }

  /** @private */
  _remove() {
    this.dispatchEvent(
      new CustomEvent('file-remove', {
        detail: { file: this.file },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @private */
  _formatProgressValue(progress) {
    return progress / 100;
  }

  /** @private */
  _fireFileEvent(e) {
    e.preventDefault();
    return this.dispatchEvent(
      new CustomEvent(e.target.getAttribute('file-event'), {
        detail: { file: this.file },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @private */
  _toggleHostAttribute(value, attributeName) {
    const shouldHave = Boolean(value);
    const has = this.hasAttribute(attributeName);
    if (has !== shouldHave) {
      if (shouldHave) {
        this.setAttribute(attributeName, '');
      } else {
        this.removeAttribute(attributeName);
      }
    }
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
   * will abort the upload in progress, but will not remove the file from the list
   * to allow the animation to hide the element to be run.
   *
   * @event file-abort
   * @param {Object} detail
   * @param {Object} detail.file file to abort upload of
   */

  /**
   * Fired after the animation to hide the element has finished. It is listened
   * by `vaadin-upload` which will actually remove the file from the upload
   * file list.
   *
   * @event file-remove
   * @param {Object} detail
   * @param {Object} detail.file file to remove from the  upload of
   */
}

customElements.define(UploadFile.is, UploadFile);

export { UploadFile };
