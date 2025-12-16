/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dialog-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogBaseMixin } from './vaadin-dialog-base-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogRendererMixin } from './vaadin-dialog-renderer-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';
import { DialogSizeMixin } from './vaadin-dialog-size-mixin.js';

export { DialogOverlay } from './vaadin-dialog-overlay.js';

/**
 * `<vaadin-dialog>` is a Web Component for creating customized modal dialogs.
 *
 * ### Rendering
 *
 * The content of the dialog can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `dialog` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `dialog`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-dialog id="dialog"></vaadin-dialog>
 * ```
 * ```js
 * const dialog = document.querySelector('#dialog');
 * dialog.renderer = function(root, dialog) {
 *   root.textContent = "Sample dialog";
 * };
 * ```
 *
 * Renderer is called on the opening of the dialog.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 * `header`         | Element wrapping title and header content
 * `header-content` | Element wrapping the header content slot
 * `title`          | Element wrapping the title slot
 * `footer`         | Element wrapping the footer slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|--------------------------------------------
 * `has-title`      | Set when the element has a title
 * `has-header`     | Set when the element has header renderer
 * `has-footer`     | Set when the element has footer renderer
 * `overflow`       | Set to `top`, `bottom`, none or both
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                      |
 * :----------------------------------------|
 * |`--vaadin-dialog-background`            |
 * |`--vaadin-dialog-border-color`          |
 * |`--vaadin-dialog-border-radius`         |
 * |`--vaadin-dialog-border-width`          |
 * |`--vaadin-dialog-max-width`             |
 * |`--vaadin-dialog-min-width`             |
 * |`--vaadin-dialog-padding`               |
 * |`--vaadin-dialog-shadow`                |
 * |`--vaadin-dialog-title-color`           |
 * |`--vaadin-dialog-title-font-size`       |
 * |`--vaadin-dialog-title-font-weight`     |
 * |`--vaadin-dialog-title-line-height`     |
 * |`--vaadin-overlay-backdrop-background`  |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} dragged - Fired when the dialog drag is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the dialog is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemePropertyMixin
 * @mixes ElementMixin
 * @mixes DialogBaseMixin
 * @mixes DialogDraggableMixin
 * @mixes DialogRendererMixin
 * @mixes DialogResizableMixin
 * @mixes DialogSizeMixin
 */
class Dialog extends DialogSizeMixin(
  DialogDraggableMixin(
    DialogResizableMixin(
      DialogRendererMixin(DialogBaseMixin(ThemePropertyMixin(ElementMixin(PolylitMixin(LitElement))))),
    ),
  ),
) {
  static get is() {
    return 'vaadin-dialog';
  }

  static get styles() {
    return css`
      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: block !important;
        position: fixed;
        outline: none;
      }

      :host,
      :host([hidden]) {
        display: none !important;
      }

      :host(:focus-visible) ::part(overlay) {
        outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-dialog-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .headerTitle="${this.headerTitle}"
        .renderer="${this.renderer}"
        .headerRenderer="${this.headerRenderer}"
        .footerRenderer="${this.footerRenderer}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        theme="${ifDefined(this._theme)}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?resizable="${this.resizable}"
        restore-focus-on-close
        focus-trap
        exportparts="backdrop, overlay, header, title, header-content, content, footer"
      >
        <slot name="title" slot="title"></slot>
        <slot name="header-content" slot="header-content"></slot>
        <slot name="footer" slot="footer"></slot>
        <slot></slot>
      </vaadin-dialog-overlay>
    `;
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('headerTitle')) {
      this.ariaLabel = this.headerTitle;
    }
  }
}

defineCustomElement(Dialog);

export { Dialog };
