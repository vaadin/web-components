/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

    @media (forced-colors: active) {
      [part='overlay'] {
        outline: 3px solid !important;
      }
    }
  `,
  { moduleId: 'vaadin-dialog-overlay-styles' },
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @private
 */
export class DialogOverlay extends Overlay {
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

  /**
   * @override
   */
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
