/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import './vaadin-upload-icons.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
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
 * @mixes ControllerMixin
 * @mixes FocusMixin
 * @mixes ThemableMixin
 */
class UploadFile extends FocusMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
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

        :host([complete]) ::slotted([slot='progress']),
        :host([error]) ::slotted([slot='progress']) {
          display: none !important;
        }
      </style>

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
            aria-label$="[[i18n.file.start]]"
            aria-describedby="name"
          ></button>
          <button
            type="button"
            part="retry-button"
            file-event="file-retry"
            on-click="_fireFileEvent"
            hidden$="[[!errorMessage]]"
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

      <slot name="progress"></slot>
    `;
  }

  static get is() {
    return 'vaadin-upload-file';
  }

  static get properties() {
    return {
      /**
       * True if uploading is completed, false otherwise.
       */
      complete: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Error message returned by the server, if any.
       */
      errorMessage: {
        type: String,
        value: '',
        observer: '_errorMessageChanged',
      },

      /**
       * The object representing a file.
       */
      file: {
        type: Object,
      },

      /**
       * Name of the uploading file.
       */
      fileName: {
        type: String,
      },

      /**
       * True if uploading is not started, false otherwise.
       */
      held: {
        type: Boolean,
        value: false,
      },

      /**
       * True if remaining time is unknown, false otherwise.
       */
      indeterminate: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * The object used to localize this component.
       */
      i18n: {
        type: Object,
      },

      /**
       * Number representing the uploading progress.
       */
      progress: {
        type: Number,
      },

      /**
       * Uploading status.
       */
      status: {
        type: String,
      },

      /**
       * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
       * @protected
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },

      /**
       * True if uploading is in progress, false otherwise.
       */
      uploading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /** @private */
      _progress: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['__updateProgress(_progress, progress, indeterminate)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new SlotController(this, 'progress', 'vaadin-progress-bar', {
        initializer: (progress) => {
          this._progress = progress;
        },
      }),
    );

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
  _errorMessageChanged(errorMessage) {
    this.toggleAttribute('error', Boolean(errorMessage));
  }

  /** @private */
  __updateProgress(progress, value, indeterminate) {
    if (progress) {
      progress.value = isNaN(value) ? 0 : value / 100;
      progress.indeterminate = indeterminate;
    }
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

customElements.define(UploadFile.is, UploadFile);

export { UploadFile };
