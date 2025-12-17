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
import { uploadDropAreaStyles } from './styles/vaadin-upload-drop-area-base-styles.js';

/**
 * `<vaadin-upload-drop-area>` is a Web Component for displaying a styled drop area
 * that can be used with `<vaadin-upload>` when using the `drop-area-id` attribute.
 *
 * The component reacts visually when files are dragged over it.
 *
 * ```html
 * <vaadin-upload-drop-area id="drop-area">
 *   Drop files here
 * </vaadin-upload-drop-area>
 * <vaadin-upload theme="headless" drop-area-id="drop-area"></vaadin-upload>
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
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                               | Description
 * :-------------------------------------------------|:--------------------------------------------
 * `--vaadin-upload-drop-area-background`            | Background color
 * `--vaadin-upload-drop-area-border-color`          | Border color
 * `--vaadin-upload-drop-area-border-radius`         | Border radius
 * `--vaadin-upload-drop-area-border-width`          | Border width
 * `--vaadin-upload-drop-area-color`                 | Text color
 * `--vaadin-upload-drop-area-font-size`             | Font size
 * `--vaadin-upload-drop-area-gap`                   | Gap between content elements
 * `--vaadin-upload-drop-area-min-height`            | Minimum height
 * `--vaadin-upload-drop-area-padding`               | Padding
 * `--vaadin-upload-drop-area-dragover-background`   | Background color when dragging over
 * `--vaadin-upload-drop-area-dragover-border-color` | Border color when dragging over
 * `--vaadin-upload-drop-area-dragover-color`        | Text color when dragging over
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class UploadDropArea extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-drop-area';
  }

  static get styles() {
    return uploadDropAreaStyles;
  }

  static get properties() {
    return {
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
  __onDragover() {
    if (!this._dragover) {
      this._dragover = true;
    }
  }

  /** @private */
  __onDragleave() {
    if (this._dragover) {
      this._dragover = false;
    }
  }

  /** @private */
  __onDrop() {
    this._dragover = false;
  }

  /** @private */
  __dragoverChanged(dragover) {
    this.toggleAttribute('dragover', dragover);
  }
}

defineCustomElement(UploadDropArea);

export { UploadDropArea };
