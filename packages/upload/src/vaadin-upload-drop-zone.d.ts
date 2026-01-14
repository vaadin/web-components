/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { UploadManager } from './vaadin-upload-manager.js';

/**
 * `<vaadin-upload-drop-zone>` is a Web Component that can be used as a drop zone
 * for file uploads. When files are dropped on the drop zone, they are added to
 * a linked UploadManager.
 *
 * ```html
 * <vaadin-upload-drop-zone>
 *   <p>Drop files here</p>
 * </vaadin-upload-drop-zone>
 * ```
 *
 * The drop zone must be linked to an UploadManager by setting the
 * `manager` property:
 *
 * ```javascript
 * const dropZone = document.querySelector('vaadin-upload-drop-zone');
 * dropZone.manager = uploadManager;
 * ```
 *
 * ### Styling
 *
 * The component has no styling by default. When files are dragged over,
 * the `dragover` attribute is set and the component uses a hover effect.
 * To override the hover effect, use `vaadin-upload-drop-zone[dragover]::after`
 * selector to style the pseudo-element covering the drop zone during dragover.
 *
 * Attribute   | Description
 * ------------|--------------------------------------------
 * `dragover`  | Set when files are being dragged over the element
 * `disabled`  | Set when the manager has reached maxFiles
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class UploadDropZone extends HTMLElement {
  /**
   * Reference to an UploadManager.
   * When set, dropped files will be automatically added to the manager.
   */
  manager: UploadManager | null;

  /**
   * Whether the drop zone is disabled (e.g., when maxFiles is reached).
   */
  disabled: boolean;
}

interface UploadDropZone extends ElementMixinClass, ThemableMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-upload-drop-zone': UploadDropZone;
  }
}

export { UploadDropZone };
