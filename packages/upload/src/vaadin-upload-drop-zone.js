/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadDropZoneStyles } from './styles/vaadin-upload-drop-zone-base-styles.js';

/**
 * `<vaadin-upload-drop-zone>` is a Web Component that can be used as an external
 * drop zone for `<vaadin-upload>`. When files are dropped on the drop zone,
 * they are added to the linked upload component.
 *
 * The drop zone can be linked to an upload component using the `for` attribute
 * (by ID) or by setting the `target` property directly.
 *
 * ```html
 * <vaadin-upload-drop-zone for="my-upload">
 *   Drop files here
 * </vaadin-upload-drop-zone>
 * <vaadin-upload id="my-upload"></vaadin-upload>
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
       * The id of the `<vaadin-upload>` element to link this drop zone to.
       * When files are dropped on the drop zone, they are added to the
       * linked upload component.
       * @attr {string} for
       */
      for: {
        type: String,
        observer: '__forChanged',
      },

      /**
       * Reference to the `<vaadin-upload>` element to link this drop zone to.
       * Can be set directly instead of using the `for` attribute.
       * @type {HTMLElement | null}
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
  __forChanged(forId) {
    if (forId) {
      this.__setTargetByIdDebouncer = Debouncer.debounce(this.__setTargetByIdDebouncer, microTask, () =>
        this.__setTargetById(forId),
      );
    } else {
      this.target = null;
    }
  }

  /** @private */
  __setTargetById(forId) {
    if (!this.isConnected) {
      return;
    }

    const target = this.getRootNode().getElementById(forId);

    if (target) {
      this.target = target;
    } else {
      console.warn(`vaadin-upload-drop-zone: No element with id="${forId}" found on the page.`);
    }
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

    if (this.target && typeof this.target.addFiles === 'function') {
      const files = await this.__getFilesFromDropEvent(event);
      this.target.addFiles(files);
    }
  }

  /**
   * Get the files from the drop event. The dropped items may contain a
   * combination of files and directories. If a dropped item is a directory,
   * it will be recursively traversed to get all files.
   *
   * @param {!DragEvent} dropEvent - The drop event
   * @returns {Promise<File[]>} - The files from the drop event
   * @private
   */
  __getFilesFromDropEvent(dropEvent) {
    async function getFilesFromEntry(entry) {
      if (entry.isFile) {
        return new Promise((resolve) => {
          // In case of an error, resolve without any files
          entry.file(resolve, () => resolve([]));
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
          // In case of an error, resolve without any files
          reader.readEntries(resolve, () => resolve([]));
        });
        const files = await Promise.all(entries.map(getFilesFromEntry));
        return files.flat();
      }
    }

    // In some cases (like dragging attachments from Outlook on Windows), "webkitGetAsEntry"
    // can return null for "dataTransfer" items. Also, there is no reason to check for
    // "webkitGetAsEntry" when there are no folders. Therefore, "dataTransfer.files" is used
    // to handle such cases.
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
