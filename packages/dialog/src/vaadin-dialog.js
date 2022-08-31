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
    [part='header'],
    [part='header-content'],
    [part='footer'] {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: none;
      pointer-events: none;
      z-index: 1;
    }

    [part='header'] {
      flex-wrap: nowrap;
    }

    ::slotted([slot='header-content']),
    ::slotted([slot='title']),
    ::slotted([slot='footer']) {
      display: contents;
      pointer-events: auto;
    }

    ::slotted([slot='title']) {
      font: inherit !important;
      overflow-wrap: anywhere;
    }

    [part='header-content'] {
      flex: 1;
    }

    :host([has-title]) [part='header-content'],
    [part='footer'] {
      justify-content: flex-end;
    }

    :host(:not([has-title]):not([has-header])) [part='header'],
    :host(:not([has-header])) [part='header-content'],
    :host(:not([has-title])) [part='title'],
    :host(:not([has-footer])) [part='footer'] {
      display: none !important;
    }

    :host(:is([has-title], [has-header], [has-footer])) [part='content'] {
      height: auto;
    }

    @media (min-height: 320px) {
      :host(:is([has-title], [has-header], [has-footer])) .resizer-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      :host(:is([has-title], [has-header], [has-footer])) [part='content'] {
        flex: 1;
        overflow: auto;
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
  { moduleId: 'vaadin-dialog-overlay-styles' },
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
      const resizerContainer = document.createElement('section');
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
      '_headerFooterRendererChange(headerRenderer, footerRenderer, opened)',
      '_headerTitleChanged(headerTitle, opened)',
    ];
  }

  static get properties() {
    return {
      modeless: Boolean,

      withBackdrop: Boolean,

      headerTitle: String,

      headerRenderer: Function,

      footerRenderer: Function,
    };
  }

  /** @protected */
  ready() {
    super.ready();

    // Update overflow attribute on resize
    this.__resizeObserver = new ResizeObserver(() => {
      this.__updateOverflow();
    });
    this.__resizeObserver.observe(this.$.resizerContainer);

    // Update overflow attribute on scroll
    this.$.content.addEventListener('scroll', () => {
      this.__updateOverflow();
    });
  }

  /** @private */
  __createContainer(slot) {
    const container = document.createElement('div');
    container.setAttribute('slot', slot);
    return container;
  }

  /** @private */
  __clearContainer(container) {
    container.innerHTML = '';
    // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
    // When clearing the rendered content, this part needs to be manually disposed of.
    // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
    delete container._$litPart$;
  }

  /** @private */
  __initContainer(container, slot) {
    if (container) {
      // Reset existing container in case if a new renderer is set.
      this.__clearContainer(container);
    } else {
      // Create the container, but wait to append it until requestContentUpdate is called.
      container = this.__createContainer(slot);
    }
    return container;
  }

  /** @private */
  _headerFooterRendererChange(headerRenderer, footerRenderer, opened) {
    const headerRendererChanged = this.__oldHeaderRenderer !== headerRenderer;
    this.__oldHeaderRenderer = headerRenderer;

    const footerRendererChanged = this.__oldFooterRenderer !== footerRenderer;
    this.__oldFooterRenderer = footerRenderer;

    const openedChanged = this._oldOpenedFooterHeader !== opened;
    this._oldOpenedFooterHeader = opened;

    // Set attributes here to update styles before detecting content overflow
    this.toggleAttribute('has-header', !!headerRenderer);
    this.toggleAttribute('has-footer', !!footerRenderer);

    if (headerRendererChanged) {
      if (headerRenderer) {
        this.headerContainer = this.__initContainer(this.headerContainer, 'header-content');
      } else if (this.headerContainer) {
        this.headerContainer.remove();
        this.headerContainer = null;
        this.__updateOverflow();
      }
    }

    if (footerRendererChanged) {
      if (footerRenderer) {
        this.footerContainer = this.__initContainer(this.footerContainer, 'footer');
      } else if (this.footerContainer) {
        this.footerContainer.remove();
        this.footerContainer = null;
        this.__updateOverflow();
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
  }

  /** @private */
  _headerTitleChanged(headerTitle, opened) {
    this.toggleAttribute('has-title', !!headerTitle);

    if (opened && (headerTitle || this._oldHeaderTitle)) {
      this.requestContentUpdate();
    }
    this._oldHeaderTitle = headerTitle;
  }

  /** @private */
  _headerTitleRenderer() {
    if (this.headerTitle) {
      if (!this.headerTitleElement) {
        this.headerTitleElement = document.createElement('h2');
        this.headerTitleElement.setAttribute('slot', 'title');
        this.headerTitleElement.classList.add('draggable');
      }
      this.appendChild(this.headerTitleElement);
      this.headerTitleElement.textContent = this.headerTitle;
    } else if (this.headerTitleElement) {
      this.headerTitleElement.remove();
      this.headerTitleElement = null;
    }
  }

  requestContentUpdate() {
    super.requestContentUpdate();

    if (this.headerContainer) {
      // If a new renderer has been set, make sure to reattach the container
      if (!this.headerContainer.parentElement) {
        this.appendChild(this.headerContainer);
      }

      if (this.headerRenderer) {
        // Only call header renderer after the container has been initialized
        this.headerRenderer.call(this.owner, this.headerContainer, this.owner);
      }
    }

    if (this.footerContainer) {
      // If a new renderer has been set, make sure to reattach the container
      if (!this.footerContainer.parentElement) {
        this.appendChild(this.footerContainer);
      }

      if (this.footerRenderer) {
        // Only call header renderer after the container has been initialized
        this.footerRenderer.call(this.owner, this.footerContainer, this.owner);
      }
    }

    this._headerTitleRenderer();

    this.__updateOverflow();
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

    Object.keys(parsedBounds).forEach((arg) => {
      if (typeof parsedBounds[arg] === 'number') {
        parsedBounds[arg] = `${parsedBounds[arg]}px`;
      }
    });

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

  /** @private */
  __updateOverflow() {
    let overflow = '';

    // Only set "overflow" attribute if the dialog has a header, title or footer.
    // Check for state attributes as extending components might not use renderers.
    if (this.hasAttribute('has-header') || this.hasAttribute('has-footer') || this.headerTitle) {
      const content = this.$.content;

      if (content.scrollTop > 0) {
        overflow += ' top';
      }

      if (content.scrollTop < content.scrollHeight - content.clientHeight) {
        overflow += ' bottom';
      }
    }

    const value = overflow.trim();
    if (value.length > 0 && this.getAttribute('overflow') !== value) {
      this.setAttribute('overflow', value);
    } else if (value.length === 0 && this.hasAttribute('overflow')) {
      this.removeAttribute('overflow');
    }
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
 */
class Dialog extends ThemePropertyMixin(ElementMixin(DialogDraggableMixin(DialogResizableMixin(PolymerElement)))) {
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
    this.$.overlay.setAttribute('role', 'dialog');
    this.$.overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
    this.$.overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));

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
    this.$.overlay.requestContentUpdate();
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
