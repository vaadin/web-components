/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dialog-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemePropertyMixin
 * @mixes ElementMixin
 * @mixes DialogDraggableMixin
 * @mixes DialogResizableMixin
 * @mixes OverlayClassMixin
 */
class Dialog extends OverlayClassMixin(
  ThemePropertyMixin(ElementMixin(DialogDraggableMixin(DialogResizableMixin(PolymerElement)))),
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
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
      },

      /**
       * Set to true to disable closing dialog on outside click
       * @attr {boolean} no-close-on-outside-click
       * @type {boolean}
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing dialog on Escape press
       * @attr {boolean} no-close-on-esc
       * @type {boolean}
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },

      /**
       * Set the `aria-label` attribute for assistive technologies like
       * screen readers. An empty string value for this property (the
       * default) means that the `aria-label` attribute is not present.
       */
      ariaLabel: {
        type: String,
        value: '',
      },

      /**
       * Custom function for rendering the content of the dialog.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `dialog` The reference to the `<vaadin-dialog>` element.
       * @type {DialogRenderer | undefined}
       */
      renderer: Function,

      /**
       * String used for rendering a dialog title.
       *
       * If both `headerTitle` and `headerRenderer` are defined, the title
       * and the elements created by the renderer will be placed next to
       * each other, with the title coming first.
       *
       * When `headerTitle` is set, the attribute `has-title` is added to the overlay element.
       * @attr {string} header-title
       */
      headerTitle: String,

      /**
       * Custom function for rendering the dialog header.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `dialog` The reference to the `<vaadin-dialog>` element.
       *
       * If both `headerTitle` and `headerRenderer` are defined, the title
       * and the elements created by the renderer will be placed next to
       * each other, with the title coming first.
       *
       * When `headerRenderer` is set, the attribute `has-header` is added to the overlay element.
       * @type {DialogRenderer | undefined}
       */
      headerRenderer: Function,

      /**
       * Custom function for rendering the dialog footer.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `dialog` The reference to the `<vaadin-dialog>` element.
       *
       * When `footerRenderer` is set, the attribute `has-footer` is added to the overlay element.
       * @type {DialogRenderer | undefined}
       */
      footerRenderer: Function,

      /**
       * Set to true to remove backdrop and allow click events on background elements.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: false,
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

    const overlay = this.$.overlay;
    overlay.setAttribute('role', 'dialog');

    overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
    overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));

    this._overlayElement = overlay;

    processTemplates(this);
  }

  /**
   * Requests an update for the content of the dialog.
   * While performing the update, it invokes the renderer passed in the `renderer` property,
   * as well as `headerRender` and `footerRenderer` properties, if these are defined.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this.$) {
      this.$.overlay.requestContentUpdate();
    }
  }

  /** @private */
  _rendererChanged(renderer, headerRenderer, footerRenderer) {
    this.$.overlay.setProperties({ owner: this, renderer, headerRenderer, footerRenderer });
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    // Restore opened state if overlay was opened when disconnecting
    if (this.__restoreOpened) {
      this.opened = true;
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    // Close overlay and memorize opened state
    this.__restoreOpened = this.opened;
    this.opened = false;
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

  /** @private */
  _onOverlayOpened(e) {
    if (e.detail.value === false) {
      this.opened = false;
    }
  }

  /**
   * Close the dialog if `noCloseOnOutsideClick` isn't set to true
   * @private
   */
  _handleOutsideClick(e) {
    if (this.noCloseOnOutsideClick) {
      e.preventDefault();
    }
  }

  /**
   * Close the dialog if `noCloseOnEsc` isn't set to true
   * @private
   */
  _handleEscPress(e) {
    if (this.noCloseOnEsc) {
      e.preventDefault();
    }
  }

  /** @private */
  _bringOverlayToFront() {
    if (this.modeless) {
      this.$.overlay.bringToFront();
    }
  }
}

customElements.define(Dialog.is, Dialog);

export { Dialog };
