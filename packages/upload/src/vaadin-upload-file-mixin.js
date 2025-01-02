/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * @polymerMixin
 * @mixes FocusMixin
 */
export const UploadFileMixin = (superClass) =>
  class UploadFileMixin extends FocusMixin(superClass) {
    static get properties() {
      return {
        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

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
      return ['__updateTabindex(tabindex, disabled)', '__updateProgress(_progress, progress, indeterminate)'];
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
    __disabledChanged(disabled) {
      if (disabled) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', this.tabindex);
      }
    }

    /** @private */
    _errorMessageChanged(errorMessage) {
      this.toggleAttribute('error', Boolean(errorMessage));
    }

    /** @private */
    __updateTabindex(tabindex, disabled) {
      if (disabled) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', tabindex);
      }
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
  };
