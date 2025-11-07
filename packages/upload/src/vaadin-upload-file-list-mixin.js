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
         * Array of progress samples for calculating upload speed.
         */
        batchProgressSamples: {
          type: Array,
        },
      };
    }

    static get observers() {
      return [
        '__updateItems(items, i18n, disabled, batchModeFileCountThreshold, batchProgress, batchTotalBytes, batchLoadedBytes, batchProgressSamples)',
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
      const { items, batchProgress, batchTotalBytes, batchLoadedBytes, batchProgressSamples } = this;

      // Calculate current file and remaining count
      const currentFile = items.find((f) => f.uploading);
      const completedCount = items.filter((f) => f.complete).length;
      const errorCount = items.filter((f) => f.error).length;
      const allComplete = items.every((f) => f.complete || f.error || f.abort);

      // Format bytes
      const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1000;
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
      };

      // Determine status text
      let statusText;
      if (allComplete) {
        if (errorCount > 0) {
          statusText = `Complete with ${errorCount} error${errorCount > 1 ? 's' : ''}`;
        } else {
          statusText = 'All files uploaded successfully';
        }
      } else if (currentFile) {
        statusText = `Uploading: ${currentFile.name}`;
      } else {
        statusText = 'Processing...';
      }

      // Calculate ETA based on 10-second rolling average of upload speed
      let etaText = '';
      if (!allComplete) {
        if (batchProgressSamples && batchProgressSamples.length >= 2) {
          // Get oldest and newest samples from the window
          const oldestSample = batchProgressSamples[0];
          const newestSample = batchProgressSamples[batchProgressSamples.length - 1];

          // Calculate speed based on the sample window
          const bytesDiff = newestSample.bytes - oldestSample.bytes;
          const timeDiff = newestSample.timestamp - oldestSample.timestamp; // milliseconds

          if (timeDiff > 0 && bytesDiff > 0) {
            const bytesPerSecond = bytesDiff / (timeDiff / 1000);
            const remainingBytes = batchTotalBytes - batchLoadedBytes;
            const remainingSeconds = remainingBytes / bytesPerSecond;

            if (remainingSeconds < 60) {
              etaText = `${Math.ceil(remainingSeconds)}s`;
            } else if (remainingSeconds < 3600) {
              etaText = `${Math.ceil(remainingSeconds / 60)}m`;
            } else {
              etaText = `${Math.ceil(remainingSeconds / 3600)}h`;
            }
          } else {
            etaText = 'calculating...';
          }
        } else {
          etaText = 'calculating...';
        }
      }

      render(
        html`
          <li class="batch-mode-container">
            <div class="batch-mode-info">
              <div class="batch-mode-status">${statusText}</div>
              <div class="batch-mode-progress-text">
                ${completedCount} of ${items.length} files • ${batchProgress}% • ${formatBytes(batchLoadedBytes)} /
                ${formatBytes(batchTotalBytes)}${etaText ? ` • ETA: ${etaText}` : ''}
              </div>
            </div>
            <vaadin-progress-bar class="batch-mode-progress-bar" value="${batchProgress / 100}"></vaadin-progress-bar>
          </li>
        `,
        this,
      );
    }
  };
