/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { UploadManager } from './vaadin-upload-manager.js';

/**
 * Fired when files are selected from the picker.
 */
export type UploadButtonFilesSelectedEvent = CustomEvent<{ files: File[] }>;

export interface UploadButtonCustomEventMap {
  'files-selected': UploadButtonFilesSelectedEvent;
}

export interface UploadButtonEventMap extends HTMLElementEventMap, UploadButtonCustomEventMap {}

/**
 * `<vaadin-upload-button>` is a button component for file uploads.
 * When clicked, it opens a file picker dialog and dispatches selected
 * files via an event or calls addFiles on a target UploadManager.
 *
 * ```html
 * <vaadin-upload-button>Upload Files</vaadin-upload-button>
 * ```
 *
 * The button can be linked to an UploadManager by setting the
 * `target` property directly:
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
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 * `prefix`  | The prefix element
 * `suffix`  | The suffix element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|--------------------------------------------
 * `active`     | Set when the button is pressed
 * `disabled`   | Set when disabled or max files reached
 * `focus-ring` | Set when the button is focused via keyboard
 * `focused`    | Set when the button is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class UploadButton extends ButtonMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * Reference to an UploadManager.
   * When set, the button will automatically disable when maxFilesReached
   * becomes true on the target.
   */
  target: UploadManager | null;

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
