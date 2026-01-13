/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadDropZoneStyles } from './styles/vaadin-upload-drop-zone-base-styles.js';
import { getFilesFromDropEvent } from './vaadin-upload-helpers.js';
import { UploadManager } from './vaadin-upload-manager.js';

/**
 * `<vaadin-upload-drop-zone>` is a Web Component that can be used as a drop zone
 * for file uploads. When files are dropped on the drop zone, they are dispatched
 * via an event or added to a linked manager.
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
 * the `dragover` attribute is set and the component uses the same hover
 * effect as `<vaadin-upload>`:
 *
 * Attribute   | Description
 * ------------|--------------------------------------------
 * `dragover`  | Set when files are being dragged over the element
 *
 * The following CSS custom properties are used for the dragover state:
 *
 * Custom property                   | Description
 * ----------------------------------|--------------------------------------------
 * `--vaadin-upload-background`      | Background color during dragover
 * `--vaadin-upload-border-color`    | Border color during dragover
 * `--vaadin-upload-border-width`    | Border width during dragover
 * `--vaadin-upload-border-radius`   | Border radius during dragover
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class UploadDropZone extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-upload-drop-zone';
  }

  static get styles() {
    return uploadDropZoneStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadManager.
       * When set, dropped files will be automatically added to the manager.
       * @type {Object | null}
       */
      manager: {
        type: Object,
        value: null,
      },

      /** @private */
      _dragover: {
        type: Boolean,
        value: false,
        reflect: true,
        attribute: 'dragover',
      },
    };
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

    // If we have a manager, add the files
    if (this.manager instanceof UploadManager) {
      const files = await getFilesFromDropEvent(event);
      this.manager.addFiles(files);
    }
  }
}

defineCustomElement(UploadDropZone);

export { UploadDropZone };
