/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when files are dropped on the drop zone.
 */
export type UploadDropZoneFilesDroppedEvent = CustomEvent<{ files: File[] }>;

export interface UploadDropZoneCustomEventMap {
  'files-dropped': UploadDropZoneFilesDroppedEvent;
}

export interface UploadDropZoneEventMap extends HTMLElementEventMap, UploadDropZoneCustomEventMap {}

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
 */
declare class UploadDropZone extends ThemableMixin(HTMLElement) {
  /**
   * Reference to an UploadManager or any object with addFiles method.
   */
  target: { addFiles(files: FileList | File[]): void } | null;

  addEventListener<K extends keyof UploadDropZoneEventMap>(
    type: K,
    listener: (this: UploadDropZone, ev: UploadDropZoneEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof UploadDropZoneEventMap>(
    type: K,
    listener: (this: UploadDropZone, ev: UploadDropZoneEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-drop-zone': UploadDropZone;
  }
}

export { UploadDropZone };
