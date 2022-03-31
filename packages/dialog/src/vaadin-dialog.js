/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    /* prefixing with the element tag to avoid styling confirm-dialog header part */
    header[part='header'] {
      display: flex;
    }

    [part='header-content'] {
      flex: 1;
    }

    /* prefixing with the element tag to avoid styling confirm-dialog footer part */
    footer[part='footer'] {
      display: flex;
      justify-content: flex-end;
    }

    :host(:not([has-title]):not([has-header])) header[part='header'],
    :host(:not([has-title])) [part='title'] {
      display: none;
    }

    :host(:not([has-footer])) footer[part='footer'] {
      display: none;
    }

    :host([has-title]) [part='content'],
    :host([has-header]) [part='content'],
    :host([has-footer]) [part='content'] {
      min-height: 100%;
      height: auto;
    }

    @media (min-height: 320px) {
      :host([has-title]) .resizer-container,
      :host([has-header]) .resizer-container,
      :host([has-footer]) .resizer-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      :host([has-title]) [part='content'],
      :host([has-header]) [part='content'],
      :host([has-footer]) [part='content'] {
        flex: 1;
        overflow: auto;
      }

      :host([has-title]) [part='content'],
      :host([has-header]) [part='content'],
      :host([has-footer]) [part='content'] {
        min-height: auto;
        height: 100%;
      }
    }

    /*
      NOTE(platosha): Make some min-width to prevent collapsing of the content
      taking the parent width, e. g., <vaadin-grid> and such.
    */
    [part='content'] {
      min-width: 12em; /* matches the default <vaadin-text-field> width */
    }

    :host([has-bounds-set]) [part='overlay'] {
      max-width: none;
    }
  `,
  { moduleId: 'vaadin-dialog-overlay-styles' }
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
export class DialogOverlay extends OverlayElement {
  static get is() {
    return 'vaadin-dialog-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const overlayPart = memoizedTemplate.content.querySelector('[part="overlay"]');
      const resizerContainer = document.createElement('div');
      resizerContainer.id = 'resizerContainer';
      resizerContainer.classList.add('resizer-container');
      resizerContainer.appendChild(contentPart);
      overlayPart.appendChild(resizerContainer);

      const headerContainer = document.createElement('header');
      headerContainer.setAttribute('part', 'header');
      resizerContainer.insertBefore(headerContainer, contentPart);

      const titleContainer = document.createElement('div');
      titleContainer.setAttribute('part', 'title');
      headerContainer.appendChild(titleContainer);

      const titleSlot = document.createElement('slot');
      titleSlot.setAttribute('name', 'title');
      titleContainer.appendChild(titleSlot);

      const headerContentContainer = document.createElement('div');
      headerContentContainer.setAttribute('part', 'header-content');
      headerContainer.appendChild(headerContentContainer);

      const headerSlot = document.createElement('slot');
      headerSlot.setAttribute('name', 'header-content');
      headerContentContainer.appendChild(headerSlot);

      const footerContainer = document.createElement('footer');
      footerContainer.setAttribute('part', 'footer');
      resizerContainer.appendChild(footerContainer);

      const footerSlot = document.createElement('slot');
      footerSlot.setAttribute('name', 'footer');
      footerContainer.appendChild(footerSlot);
    }
    return memoizedTemplate;
  }

  static get observers() {
    return [
      '_headerRendererChange(headerRenderer, footerRenderer, opened)',
      '_headerTitleChanged(headerTitle, opened)'
    ];
  }

  static get properties() {
    return {
      modeless: Boolean,

      withBackdrop: Boolean,

      headerTitle: String,

      headerRenderer: Function,

      footerRenderer: Function
    };
  }

  _headerRendererChange(headerRenderer, footerRenderer, opened) {
    const headerRendererChanged = this.__oldHeaderRenderer !== headerRenderer;
    this.__oldHeaderRenderer = headerRenderer;

    const footerRendererChanged = this.__oldFooterRenderer !== footerRenderer;
    this.__oldFooterRenderer = footerRenderer;

    const openedChanged = this._oldOpened !== opened;
    this._oldOpened = opened;

    if (headerRendererChanged) {
      if (!this.headerContainer && this.headerRenderer) {
        this.headerContainer = document.createElement('header');
        this.headerContainer.setAttribute('slot', 'header-content');
        this.appendChild(this.headerContainer);
      } else if (this.headerRenderer) {
        this.headerContainer.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete this.headerContainer._$litPart$;
      } else if (this.headerContainer && !this.headerRenderer) {
        this.headerContainer.remove();
      }
    }

    if (footerRendererChanged) {
      if (!this.footerContainer && this.footerRenderer) {
        this.footerContainer = document.createElement('footer');
        this.footerContainer.setAttribute('slot', 'footer');
        this.appendChild(this.footerContainer);
      } else if (this.footerRenderer) {
        this.footerContainer.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete this.footerContainer._$litPart$;
      } else if (this.footerContainer && !this.footerRenderer) {
        this.footerContainer.remove();
      }
    }

    if (
      (headerRenderer && (headerRendererChanged || openedChanged)) ||
      (footerRenderer && (footerRendererChanged || openedChanged))
    ) {
      if (opened) {
        this.requestContentUpdate();
      }
    }
    this._toggleHasHeaderAttribute();
    this._toggleHasFooterAttribute();
  }

  _toggleHasHeaderAttribute() {
    if (this.headerRenderer) {
      this.setAttribute('has-header', '');
    } else {
      this.removeAttribute('has-header');
    }
  }

  _toggleHasFooterAttribute() {
    if (this.footerRenderer) {
      this.setAttribute('has-footer', '');
    } else {
      this.removeAttribute('has-footer');
    }
  }

  _headerTitleChanged(headerTitle, opened) {
    const headerTitleChanged = this._oldHeaderTitle !== headerTitle;
    this._oldHeaderTitle = headerTitle;

    const openedChanged = this._oldOpened !== opened;
    this._oldOpened = opened;

    if (headerTitleChanged || openedChanged) {
      if (this.opened) {
        this.requestContentUpdate();
      }
    }
    this._toggleHasTitleAttribute();
  }

  _toggleHasTitleAttribute() {
    if (this.headerTitle) {
      this.setAttribute('has-title', '');
    } else {
      this.removeAttribute('has-title');
    }
  }

  _headerTitleRenderer() {
    const headerTitleElement = this.getHeaderTitleElement();
    if (this.headerTitle) {
      headerTitleElement.textContent = this.headerTitle;
    } else {
      headerTitleElement.remove();
    }
  }

  /**
   *
   * @returns HTMLElement header title element
   */
  getHeaderTitleElement() {
    let headerTitleElement = this.querySelector('[slot=title]');

    if (!headerTitleElement) {
      headerTitleElement = document.createElement('span');
      headerTitleElement.id = 'title';
      headerTitleElement.setAttribute('slot', 'title');
      headerTitleElement.classList.add('draggable');
      this.setAttribute('aria-labelledby', 'title');
      this.appendChild(headerTitleElement);
    }

    return headerTitleElement;
  }

  requestContentUpdate() {
    super.requestContentUpdate();

    // If a new renderer has been set, make sure to reattach the header/footer roots
    if (this.headerContainer && !this.headerContainer.parentElement) {
      this.appendChild(this.headerContainer);
    }

    if (this.footerContainer && !this.footerContainer.parentElement) {
      this.appendChild(this.footerContainer);
    }

    if (this.headerRenderer) {
      this.headerRenderer.call(this.owner, this.headerContainer);
    }

    if (this.footerRenderer) {
      this.footerRenderer.call(this.owner, this.footerContainer);
    }

    this._headerTitleRenderer();
  }

  /**
   * Updates the coordinates of the overlay.
   * @param {!DialogOverlayBoundsParam} bounds
   */
  setBounds(bounds) {
    const overlay = this.$.overlay;
    const parsedBounds = { ...bounds };

    if (overlay.style.position !== 'absolute') {
      overlay.style.position = 'absolute';
      this.setAttribute('has-bounds-set', '');
      this.__forceSafariReflow();
    }

    for (const arg in parsedBounds) {
      if (typeof parsedBounds[arg] === 'number') {
        parsedBounds[arg] = `${parsedBounds[arg]}px`;
      }
    }

    Object.assign(overlay.style, parsedBounds);
  }

  /**
   * Retrieves the coordinates of the overlay.
   * @return {!DialogOverlayBounds}
   */
  getBounds() {
    const overlayBounds = this.$.overlay.getBoundingClientRect();
    const containerBounds = this.getBoundingClientRect();
    const top = overlayBounds.top - containerBounds.top;
    const left = overlayBounds.left - containerBounds.left;
    const width = overlayBounds.width;
    const height = overlayBounds.height;
    return { top, left, width, height };
  }

  /**
   * Safari 13 renders overflowing elements incorrectly.
   * This forces it to recalculate height.
   * @private
   */
  __forceSafariReflow() {
    const scrollPosition = this.$.resizerContainer.scrollTop;
    const overlay = this.$.overlay;
    overlay.style.display = 'block';

    requestAnimationFrame(() => {
      overlay.style.display = '';
      this.$.resizerContainer.scrollTop = scrollPosition;
    });
  }
}

customElements.define(DialogOverlay.is, DialogOverlay);

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
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemePropertyMixin
 * @mixes ElementMixin
 * @mixes DialogDraggableMixin
 * @mixes DialogResizableMixin
 */
class Dialog extends ThemePropertyMixin(ElementMixin(DialogDraggableMixin(DialogResizableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>

      <vaadin-dialog-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
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
        notify: true
      },

      /**
       * Set to true to disable closing dialog on outside click
       * @attr {boolean} no-close-on-outside-click
       * @type {boolean}
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable closing dialog on Escape press
       * @attr {boolean} no-close-on-esc
       * @type {boolean}
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false
      },

      /**
       * Set the `aria-label` attribute for assistive technologies like
       * screen readers. An empty string value for this property (the
       * default) means that the `aria-label` attribute is not present.
       */
      ariaLabel: {
        type: String,
        value: ''
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

      headerTitle: String,

      headerRenderer: Function,

      footerRenderer: Function,

      /**
       * Set to true to remove backdrop and allow click events on background elements.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_openedChanged(opened)',
      '_ariaLabelChanged(ariaLabel)',
      '_rendererChanged(renderer, headerRenderer, footerRenderer)',
      '_headerTitleChanged(headerTitle)'
    ];
  }

  /** @protected */
  ready() {
    super.ready();
    this.$.overlay.setAttribute('role', 'dialog');
    this.$.overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
    this.$.overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));

    processTemplates(this);
  }

  /**
   * Requests an update for the content of the dialog.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    this.$.overlay.requestContentUpdate();
  }

  /** @private */
  _rendererChanged(renderer, headerRenderer, footerRenderer) {
    this.$.overlay.setProperties({ owner: this, renderer, headerRenderer, footerRenderer });
  }

  _headerTitleChanged(headerTitle) {
    this.$.overlay.setProperties({ headerTitle });
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.opened = false;
  }

  /** @private */
  _openedChanged(opened) {
    this.$.overlay.opened = opened;
  }

  /** @private */
  _ariaLabelChanged(ariaLabel) {
    if (ariaLabel) {
      this.$.overlay.setAttribute('aria-label', ariaLabel);
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
