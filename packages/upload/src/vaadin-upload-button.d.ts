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
 * `<vaadin-upload-button>` is a button component for file uploads.
 * When clicked, it opens a file picker dialog and calls addFiles
 * on a linked UploadManager.
 *
 * ```html
 * <vaadin-upload-button>Upload Files</vaadin-upload-button>
 * ```
 *
 * The button must be linked to an UploadManager by setting the
 * `manager` property:
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-button');
 * button.manager = uploadManager;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the button.
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `active`       | Set when the button is pressed down, either with mouse, touch or the keyboard
 * `disabled`     | Set when the button is disabled
 * `focus-ring`   | Set when the button is focused using the keyboard
 * `focused`      | Set when the button is focused
 * `has-tooltip`  | Set when the button has a slotted tooltip
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-button-background`     |
 * | `--vaadin-button-border-color`   |
 * | `--vaadin-button-border-radius`  |
 * | `--vaadin-button-border-width`   |
 * | `--vaadin-button-font-size`      |
 * | `--vaadin-button-font-weight`    |
 * | `--vaadin-button-gap`            |
 * | `--vaadin-button-height`         |
 * | `--vaadin-button-line-height`    |
 * | `--vaadin-button-margin`         |
 * | `--vaadin-button-padding`        |
 * | `--vaadin-button-text-color`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class UploadButton extends ButtonMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * Reference to an UploadManager.
   * When set, the button will automatically disable when maxFilesReached
   * becomes true on the manager. The file picker will also use the manager's
   * `accept` and `maxFiles` settings.
   */
  manager: UploadManager | null;

  /**
   * Capture attribute for mobile file input.
   */
  capture: string | undefined;

  /**
   * Opens the file picker dialog.
   */
  openFilePicker(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-button': UploadButton;
  }
}

export { UploadButton };
