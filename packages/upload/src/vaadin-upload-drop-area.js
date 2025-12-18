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
 * `<vaadin-upload-drop-area>` is a Web Component that can be used as a drop area
 * with `<vaadin-upload>` when using the `drop-area-id` attribute.
 *
 * The component has no styling by default. When files are dragged over it,
 * it displays styling matching `<vaadin-upload>`'s dragover state.
 *
 * ```html
 * <vaadin-upload-drop-area id="drop-area">
 *   Drop files here
 * </vaadin-upload-drop-area>
 * <vaadin-upload headless drop-area-id="drop-area"></vaadin-upload>
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
