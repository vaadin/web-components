/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dialog-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogBaseMixin } from './vaadin-dialog-base-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogRendererMixin } from './vaadin-dialog-renderer-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

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
 * `<vaadin-dialog>` uses `<vaadin-dialog-overlay>` internal
 * themable component as the actual visible dialog overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation.
 * for `<vaadin-dialog-overlay>` parts.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
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
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
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
 * @mixes OverlayClassMixin
 */
class Dialog extends DialogDraggableMixin(
  DialogResizableMixin(
    DialogRendererMixin(DialogBaseMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(PolymerElement))))),
  ),
) {
  static get template() {
    return html`
      <style>
        :host {
          display: none !important;
        }
      </style>

      <vaadin-dialog-overlay
        id="overlay"
        role$="[[overlayRole]]"
        header-title="[[headerTitle]]"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        restore-focus-on-close
        focus-trap
      ></vaadin-dialog-overlay>
    `;
  }

  static get is() {
    return 'vaadin-dialog';
  }

  static get properties() {
    return {
      /**
       * Set the `aria-label` attribute for assistive technologies like
       * screen readers. An empty string value for this property (the
       * default) means that the `aria-label` attribute is not present.
       */
      ariaLabel: {
        type: String,
        value: '',
      },
    };
  }

  static get observers() {
    return [
      '_openedChanged(opened)',
      '_ariaLabelChanged(ariaLabel, headerTitle)',
      '_rendererChanged(renderer, headerRenderer, footerRenderer)',
    ];
  }

  /** @protected */
  ready() {
    super.ready();

    processTemplates(this);
  }

  /** @private */
  _rendererChanged(renderer, headerRenderer, footerRenderer) {
    this.$.overlay.setProperties({ owner: this, renderer, headerRenderer, footerRenderer });
  }

  /** @private */
  _openedChanged(opened) {
    this.$.overlay.opened = opened;
  }

  /** @private */
  _ariaLabelChanged(ariaLabel, headerTitle) {
    if (ariaLabel || headerTitle) {
      this.$.overlay.setAttribute('aria-label', ariaLabel || headerTitle);
    } else {
      this.$.overlay.removeAttribute('aria-label');
    }
  }
}

defineCustomElement(Dialog);

export { Dialog };
