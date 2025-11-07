/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';

/**
 * @polymerMixin
 */
export const UploadFileListMixin = (superClass) =>
  class UploadFileListMixin extends superClass {
    static get properties() {
      return {
        /**
         * The array of files being processed, or already uploaded.
         */
        items: {
          type: Array,
        },

        /**
         * The object used to localize upload files.
         */
        i18n: {
          type: Object,
        },

        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Number of files that triggers batch mode.
         */
        batchModeFileCountThreshold: {
          type: Number,
        },

        /**
         * Batch progress percentage (0-100).
         */
        batchProgress: {
          type: Number,
        },

        /**
         * Total bytes to upload in batch.
         */
        batchTotalBytes: {
          type: Number,
        },

        /**
         * Bytes uploaded so far in batch.
         */
        batchLoadedBytes: {
          type: Number,
        },

        /**
         * Batch upload start timestamp.
         */
        batchStartTime: {
          type: Number,
        },
      };
    }

    static get observers() {
      return [
        '__updateItems(items, i18n, disabled, batchModeFileCountThreshold, batchProgress, batchTotalBytes, batchLoadedBytes, batchStartTime)',
      ];
    }

    /** @private */
    __updateItems(items, i18n) {
      if (items && i18n) {
        this.requestContentUpdate();
      }
    }

    /**
     * Requests an update for the `vaadin-upload-file` elements.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      const { items, i18n, disabled, batchModeFileCountThreshold } = this;

      // Determine if we should show batch mode
      const isBatchMode = items && batchModeFileCountThreshold && items.length > batchModeFileCountThreshold;

      if (isBatchMode) {
        // Render batch mode UI
        this._renderBatchMode();
      } else {
        // Render individual file items
        render(
          html`
            ${items.map(
              (file) => html`
                <li>
                  <vaadin-upload-file
                    .disabled="${disabled}"
                    .file="${file}"
                    .complete="${file.complete}"
                    .errorMessage="${file.error}"
                    .fileName="${file.name}"
                    .held="${file.held}"
                    .indeterminate="${file.indeterminate}"
                    .progress="${file.progress}"
                    .status="${file.status}"
                    .uploading="${file.uploading}"
                    .i18n="${i18n}"
                  ></vaadin-upload-file>
                </li>
              `,
            )}
          `,
          this,
        );
      }
    }

    /** @private */
    _renderBatchMode() {
      const { items, batchProgress, batchTotalBytes, batchLoadedBytes, batchStartTime } = this;

      // Calculate current file and remaining count
      const currentFile = items.find((f) => f.uploading);
      const completedCount = items.filter((f) => f.complete).length;

      // Format bytes
      const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1000;
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
      };

      // Calculate ETA
      let etaText = 'calculating...';
      if (batchStartTime && batchLoadedBytes > 0) {
        const elapsed = (Date.now() - batchStartTime) / 1000; // seconds
        const bytesPerSecond = batchLoadedBytes / elapsed;
        const remainingBytes = batchTotalBytes - batchLoadedBytes;
        const remainingSeconds = remainingBytes / bytesPerSecond;

        if (remainingSeconds < 60) {
          etaText = `${Math.ceil(remainingSeconds)}s`;
        } else if (remainingSeconds < 3600) {
          etaText = `${Math.ceil(remainingSeconds / 60)}m`;
        } else {
          etaText = `${Math.ceil(remainingSeconds / 3600)}h`;
        }
      }

      render(
        html`
          <li class="batch-mode-container">
            <div class="batch-mode-info">
              <div class="batch-mode-status"> ${currentFile ? `Uploading: ${currentFile.name}` : 'Processing...'} </div>
              <div class="batch-mode-progress-text">
                ${completedCount} of ${items.length} files • ${batchProgress}% • ${formatBytes(batchLoadedBytes)} /
                ${formatBytes(batchTotalBytes)} • ETA: ${etaText}
              </div>
            </div>
            <vaadin-progress-bar class="batch-mode-progress-bar" value="${batchProgress / 100}"></vaadin-progress-bar>
          </li>
        `,
        this,
      );
    }
  };
