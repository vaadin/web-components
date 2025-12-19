/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadDropZoneStyles } from './styles/vaadin-upload-drop-zone-base-styles.js';

/**
 * `<vaadin-upload-drop-zone>` is a Web Component that can be used as a drop zone
 * for file uploads. When files are dropped on the drop zone, they are dispatched
 * via an event or added to a linked target.
 *
 * ```javascript
 * const dropZone = document.querySelector('vaadin-upload-drop-zone');
 * dropZone.target = manager;
 *
 * // Or listen to the files-dropped event
 * dropZone.addEventListener('files-dropped', (e) => {
 *   manager.addFiles(e.detail.files);
 * });
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|--------------------------------------------
 * `dragover`  | Set when files are being dragged over the element
 *
 * When `dragover` is set, the component uses the same CSS custom properties
 * as `<vaadin-upload>` for consistent styling:
 *
 * - `--vaadin-upload-background`
 * - `--vaadin-upload-border-color`
 * - `--vaadin-upload-border-width`
 * - `--vaadin-upload-border-radius`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @fires {CustomEvent} files-dropped - Fired when files are dropped on the drop zone
 */
class UploadDropZone extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-drop-zone';
  }

  static get styles() {
    return uploadDropZoneStyles;
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadManager or any object with addFiles method.
       * @type {Object | null}
       */
      target: {
        type: Object,
        value: null,
      },

      /** @private */
      _dragover: {
        type: Boolean,
        value: false,
        observer: '__dragoverChanged',
      },
    };
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('dragover', this.__onDragover.bind(this));
    this.addEventListener('dragleave', this.__onDragleave.bind(this));
    this.addEventListener('drop', this.__onDrop.bind(this));
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  __onDragover(event) {
    event.preventDefault();
    if (!this._dragover) {
      this._dragover = true;
    }
    event.dataTransfer.dropEffect = 'copy';
  }

  /** @private */
  __onDragleave(event) {
    event.preventDefault();
    if (this._dragover) {
      this._dragover = false;
    }
  }

  /** @private */
  async __onDrop(event) {
    event.preventDefault();
    this._dragover = false;

    const files = await this.__getFilesFromDropEvent(event);

    // Dispatch event for listeners
    this.dispatchEvent(
      new CustomEvent('files-dropped', {
        detail: { files },
        bubbles: true,
        composed: true,
      }),
    );

    // If we have a target with addFiles, call it
    if (this.target && typeof this.target.addFiles === 'function') {
      this.target.addFiles(files);
    }
  }

  /**
   * Get the files from the drop event. The dropped items may contain a
   * combination of files and directories. If a dropped item is a directory,
   * it will be recursively traversed to get all files.
   *
   * @param {DragEvent} dropEvent - The drop event
   * @returns {Promise<File[]>} - The files from the drop event
   * @private
   */
  __getFilesFromDropEvent(dropEvent) {
    async function getFilesFromEntry(entry) {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file(resolve, () => resolve([]));
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
          reader.readEntries(resolve, () => resolve([]));
        });
        const files = await Promise.all(entries.map(getFilesFromEntry));
        return files.flat();
      }
    }

    const containsFolders = Array.from(dropEvent.dataTransfer.items)
      .filter((item) => !!item)
      .filter((item) => typeof item.webkitGetAsEntry === 'function')
      .map((item) => item.webkitGetAsEntry())
      .some((entry) => !!entry && entry.isDirectory);

    if (!containsFolders) {
      return Promise.resolve(dropEvent.dataTransfer.files ? Array.from(dropEvent.dataTransfer.files) : []);
    }

    const filePromises = Array.from(dropEvent.dataTransfer.items)
      .map((item) => item.webkitGetAsEntry())
      .filter((entry) => !!entry)
      .map(getFilesFromEntry);

    return Promise.all(filePromises).then((files) => files.flat());
  }

  /** @private */
  __dragoverChanged(dragover) {
    this.toggleAttribute('dragover', dragover);
  }
}

defineCustomElement(UploadDropZone);

export { UploadDropZone };
