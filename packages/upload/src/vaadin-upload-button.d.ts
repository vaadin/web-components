/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when files are selected from the picker.
 */
export type UploadButtonFilesSelectedEvent = CustomEvent<{ files: File[] }>;

export interface UploadButtonCustomEventMap {
  'files-selected': UploadButtonFilesSelectedEvent;
}

export interface UploadButtonEventMap extends HTMLElementEventMap, UploadButtonCustomEventMap {}

/**
 * `<vaadin-upload-button>` is a Web Component that can be used as a
 * button for file uploads. When clicked, it opens a file picker dialog
 * and dispatches selected files via an event or calls addFiles on a target.
 *
 * The button can be linked to an UploadManager by setting the
 * `target` property directly. When linked, the button will automatically
 * disable itself when the maximum number of files is reached.
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-button');
 * button.target = manager;
 *
 * // Or listen to the files-selected event
 * button.addEventListener('files-selected', (e) => {
 *   manager.addFiles(e.detail.files);
 * });
 * ```
 *
 * ### Styling
 *
 * The component has minimal default styling. You can style the slotted content
 * or use CSS to customize the appearance.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|--------------------------------------------
 * `disabled`  | Set when disabled or max files reached
 */
declare class UploadButton extends ThemableMixin(HTMLElement) {
  /**
   * Reference to an UploadManager or any object with addFiles method.
   * When set, the button will automatically disable when maxFilesReached
   * becomes true on the target.
   */
  target: { addFiles(files: FileList | File[]): void; maxFilesReached?: boolean } | null;

  /**
   * When true, the button is disabled and cannot be clicked.
   */
  disabled: boolean;

  /**
   * Accepted file types (MIME types or extensions).
   */
  accept: string;

  /**
   * Maximum number of files (1 = single file mode).
   */
  maxFiles: number;

  /**
   * Capture attribute for mobile file input.
   */
  capture: string | undefined;

  /**
   * Opens the file picker dialog.
   */
  openFilePicker(): void;

  addEventListener<K extends keyof UploadButtonEventMap>(
    type: K,
    listener: (this: UploadButton, ev: UploadButtonEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof UploadButtonEventMap>(
    type: K,
    listener: (this: UploadButton, ev: UploadButtonEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-button': UploadButton;
  }
}

export { UploadButton };
