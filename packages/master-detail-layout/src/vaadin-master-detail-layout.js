/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement, nothing } from 'lit';
import { getFocusableElements } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { transitionStyles } from './vaadin-master-detail-layout-transition-styles.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * ### Styling
 *
 * The following custom CSS properties are available for styling (needed to be set
 * on the `<html>` element since they are used by the global view transitions):
 *
 * Custom CSS property                                  | Description         | Default
 * -----------------------------------------------------|---------------------|--------
 * `--vaadin-master-detail-layout-transition-duration`  | Transition duration | 300ms
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name      | Description
 * ---------------|----------------------
 * `backdrop`     | Backdrop covering the master area in the drawer mode
 * `master`       | The master area
 * `detail`       | The detail area
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------| -----------
 * `containment`  | Set to `layout` or `viewport` depending on the containment.
 * `orientation`  | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`   | Set when the detail content is provided.
 * `drawer`       | Set when the layout is using the drawer mode.
 * `stack`        | Set when the layout is using the stack mode.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} backdrop-click - Fired when the user clicks the backdrop in the drawer mode.
 * @fires {CustomEvent} detail-escape-press - Fired when the user presses Escape in the detail area.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ResizeMixin
 * @mixes SlotStylesMixin
 */
class MasterDetailLayout extends SlotStylesMixin(ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-master-detail-layout';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        box-sizing: border-box;
        height: 100%;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:not([has-detail])) [part='detail'],
      [part='backdrop'] {
        display: none;
      }

      :host([orientation='horizontal']) [part='master'] {
        max-width: 100%;
      }

      /* Drawer mode */
      :host(:is([drawer], [stack])) {
        position: relative;
      }

      :host(:is([drawer], [stack])[containment='layout']) [part='detail'],
      :host([drawer][containment='layout']) [part='backdrop'] {
        position: absolute;
      }

      :host(:is([drawer], [stack])[containment='viewport']) [part='detail'],
      :host([drawer][containment='viewport']) [part='backdrop'] {
        position: fixed;
      }

      :host([drawer][has-detail]) [part='backdrop'] {
        display: block;
        inset: 0;
        z-index: 1;
      }

      :host(:is([drawer], [stack])) [part='detail'] {
        z-index: 1;
      }

      :host([drawer][orientation='horizontal']) [part='detail'] {
        inset-inline-end: 0;
        height: 100%;
        width: var(--_detail-min-size, min-content);
        max-width: 100%;
      }

      :host([drawer][orientation='horizontal'][containment='viewport']) [part='detail'] {
        inset-block-start: 0;
      }

      /* No fixed size */
      :host(:not([has-master-size])) [part='master'],
      :host(:not([has-detail-size])) [part='detail'] {
        flex-grow: 1;
        flex-basis: 50%;
      }

      /* Fixed size */
      :host([has-master-size]) [part='master'],
      :host([has-detail-size]) [part='detail'] {
        flex-shrink: 0;
      }

      :host([has-master-size][orientation='horizontal']) [part='master'] {
        width: var(--_master-size);
      }

      :host([has-detail-size][orientation='horizontal']:not([stack])) [part='detail'] {
        width: var(--_detail-size);
      }

      :host([has-master-size][has-detail-size]) [part='master'] {
        flex-grow: 1;
        flex-basis: var(--_master-size);
      }

      :host([has-master-size][has-detail-size]) [part='detail'] {
        flex-grow: 1;
        flex-basis: var(--_detail-size);
      }

      /* Min size */
      :host([has-master-min-size][has-detail][orientation='horizontal']:not([drawer]):not([stack])) [part='master'] {
        min-width: var(--_master-min-size);
      }

      :host([has-detail-min-size][orientation='horizontal']:not([drawer]):not([stack])) [part='detail'] {
        min-width: var(--_detail-min-size);
      }

      :host([has-master-min-size]) [part='master'],
      :host([has-detail-min-size]) [part='detail'] {
        flex-shrink: 0;
      }

      /* Vertical */
      :host([orientation='vertical']) {
        flex-direction: column;
      }

      :host([orientation='vertical'][drawer]) [part='master'] {
        max-height: 100%;
      }

      :host([orientation='vertical'][drawer]) [part='detail'] {
        inset-block-end: 0;
        width: 100%;
        height: var(--_detail-min-size, min-content);
      }

      :host([drawer][orientation='vertical'][containment='viewport']) [part='detail'] {
        inset-inline-start: 0;
      }

      /* Fixed size */
      :host([has-master-size][orientation='vertical']) [part='master'] {
        height: var(--_master-size);
      }

      :host([has-detail-size][orientation='vertical']:not([stack])) [part='detail'] {
        height: var(--_detail-size);
      }

      /* Min size */
      :host([has-master-min-size][orientation='vertical']:not([drawer])) [part='master'],
      :host([has-master-min-size][orientation='vertical'][drawer]) {
        min-height: var(--_master-min-size);
      }

      :host([has-detail-min-size][orientation='vertical']:not([drawer]):not([stack])) [part='detail'] {
        min-height: var(--_detail-min-size);
      }

      /* Stack mode */
      :host([stack]) [part='master'] {
        max-height: 100%;
      }

      :host([stack]) [part='detail'] {
        inset: 0;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Fixed size (in CSS length units) to be set on the detail area.
       * When specified, it prevents the detail area from growing or
       * shrinking. If there is not enough space to show master and detail
       * areas next to each other, the details are shown as an overlay:
       * either as drawer or stack, depending on the `stackOverlay` property.
       *
       * @attr {string} detail-size
       */
      detailSize: {
        type: String,
        sync: true,
        observer: '__detailSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the detail area.
       * When specified, it prevents the detail area from shrinking below
       * this size. If there is not enough space to show master and detail
       * areas next to each other, the details are shown as an overlay:
       * either as drawer or stack, depending on the `stackOverlay` property.
       *
       * @attr {string} detail-min-size
       */
      detailMinSize: {
        type: String,
        sync: true,
        observer: '__detailMinSizeChanged',
      },

      /**
       * Fixed size (in CSS length units) to be set on the master area.
       * When specified, it prevents the master area from growing or
       * shrinking. If there is not enough space to show master and detail
       * areas next to each other, the details are shown as an overlay:
       * either as drawer or stack, depending on the `stackOverlay` property.
       *
       * @attr {string} master-size
       */
      masterSize: {
        type: String,
        sync: true,
        observer: '__masterSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the master area.
       * When specified, it prevents the master area from shrinking below
       * this size. If there is not enough space to show master and detail
       * areas next to each other, the details are shown as an overlay:
       * either as drawer or stack, depending on the `stackOverlay` property.
       *
       * @attr {string} master-min-size
       */
      masterMinSize: {
        type: String,
        sync: true,
        observer: '__masterMinSizeChanged',
      },

      /**
       * Define how master and detail areas are shown next to each other,
       * and the way how size and min-size properties are applied to them.
       * Possible values are: `horizontal` or `vertical`.
       * Defaults to horizontal.
       */
      orientation: {
        type: String,
        value: 'horizontal',
        reflectToAttribute: true,
        observer: '__orientationChanged',
        sync: true,
      },

      /**
       * When specified, forces the details to be shown as an overlay
       * (either as drawer or stack), even if there is enough space for
       * master and detail to be shown next to each other using the default
       * (split) mode.
       *
       * In order to enforce the stack mode, use this property together with
       * `stackOverlay` property and set both to `true`.
       *
       * @attr {boolean} force-overlay
       */
      forceOverlay: {
        type: Boolean,
        value: false,
        observer: '__forceOverlayChanged',
        sync: true,
      },

      /**
       * Defines the containment of the detail area when the layout is in
       * overlay mode. When set to `layout`, the overlay is confined to the
       * layout. When set to `viewport`, the overlay is confined to the
       * browser's viewport. Defaults to `layout`.
       */
      containment: {
        type: String,
        value: 'layout',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, the layout in the overlay mode is rendered as a stack,
       * making detail area fully cover the master area. Otherwise, it is
       * rendered as a drawer and has a visual backdrop.
       *
       * In order to enforce the stack mode, use this property together with
       * `forceOverlay` property and set both to `true`.
       *
       * @attr {string} stack-threshold
       */
      stackOverlay: {
        type: Boolean,
        value: false,
        observer: '__stackOverlayChanged',
        sync: true,
      },

      /**
       * When true, the layout does not use animated transitions for the detail area.
       *
       * @attr {boolean} no-animation
       */
      noAnimation: {
        type: Boolean,
        value: false,
      },

      /**
       * When true, the component uses the drawer mode. This property is read-only.
       * @protected
       */
      _drawer: {
        type: Boolean,
        attribute: 'drawer',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, the component uses the stack mode. This property is read-only.
       * @protected
       */
      _stack: {
        type: Boolean,
        attribute: 'stack',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, the component has the detail content provided.
       * @protected
       */
      _hasDetail: {
        type: Boolean,
        attribute: 'has-detail',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  static get experimental() {
    return true;
  }

  /** @override */
  get slotStyles() {
    return [transitionStyles];
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" @click="${this.__onBackdropClick}"></div>
      <div id="master" part="master" ?inert="${this._hasDetail && this._drawer && this.containment === 'layout'}">
        <slot></slot>
      </div>
      <div
        id="detail"
        part="detail"
        role="${this._drawer || this._stack ? 'dialog' : nothing}"
        aria-modal="${this._drawer && this.containment === 'viewport' ? 'true' : nothing}"
        @keydown="${this.__onDetailKeydown}"
      >
        <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
      </div>
    `;
  }

  /** @private */
  __onDetailSlotChange(e) {
    const children = e.target.assignedNodes();

    this._hasDetail = children.length > 0;
    this.__detectLayoutMode();

    // Move focus to the detail area when it is added to the DOM,
    // in case if the layout is using drawer or stack mode.
    if ((this._drawer || this._stack) && children.length > 0) {
      const focusables = getFocusableElements(children[0]);
      if (focusables.length) {
        focusables[0].focus();
      }
    }
  }

  /** @private */
  __onBackdropClick() {
    this.dispatchEvent(new CustomEvent('backdrop-click'));
  }

  /** @private */
  __onDetailKeydown(event) {
    if (event.key === 'Escape') {
      // Prevent firing on parent layout when using nested layouts
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('detail-escape-press'));
    }
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__detectLayoutMode();
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __detailMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-min-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __masterMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-min-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __orientationChanged(orientation, oldOrientation) {
    if (orientation || oldOrientation) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __forceOverlayChanged(forceOverlay, oldForceOverlay) {
    if (forceOverlay || oldForceOverlay) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __stackOverlayChanged(stackOverlay, oldStackOverlay) {
    if (stackOverlay || oldStackOverlay) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __updateStyleProperty(prop, size, oldSize) {
    if (size) {
      this.style.setProperty(`--_${prop}`, size);
    } else if (oldSize) {
      this.style.removeProperty(`--_${prop}`);
    }

    this.toggleAttribute(`has-${prop}`, !!size);
  }

  /** @private */
  __setOverlayMode(value) {
    if (this.stackOverlay) {
      this._stack = value;
    } else {
      this._drawer = value;
    }
  }

  /** @private */
  __detectLayoutMode() {
    this._drawer = false;
    this._stack = false;

    if (this.forceOverlay) {
      this.__setOverlayMode(true);
      return;
    }

    if (!this._hasDetail) {
      return;
    }

    if (this.orientation === 'vertical') {
      this.__detectVerticalMode();
    } else {
      this.__detectHorizontalMode();
    }
  }

  /** @private */
  __detectHorizontalMode() {
    const detailWidth = this.$.detail.offsetWidth;

    // Detect minimum width needed by master content. Use max-width to ensure
    // the layout can switch back to split mode once there is enough space.
    // If there is master  size or min-size set, use that instead to force the
    // overlay mode by setting `masterSize` / `masterMinSize` to 100%/
    this.$.master.style.maxWidth = this.masterSize || this.masterMinSize || 'min-content';
    const masterWidth = this.$.master.offsetWidth;
    this.$.master.style.maxWidth = '';

    // If the combined minimum size of both the master and the detail content
    // exceeds the size of the layout, the layout changes to the overlay mode.
    this.__setOverlayMode(this.offsetWidth < masterWidth + detailWidth);

    // Toggling the overlay resizes master content, which can cause document
    // scroll bar to appear or disappear, and trigger another resize of the
    // layout which can affect previous measurements and end up in horizontal
    // scroll. Check if that is the case and if so, preserve the overlay mode.
    if (this.offsetWidth < this.scrollWidth) {
      this.__setOverlayMode(true);
    }
  }

  /** @private */
  __detectVerticalMode() {
    const masterHeight = this.$.master.clientHeight;

    // If the combined minimum size of both the master and the detail content
    // exceeds the available height, the layout changes to the overlay mode.
    if (this.offsetHeight < masterHeight + this.$.detail.clientHeight) {
      this.__setOverlayMode(true);
    }
  }

  /**
   * Sets the detail element to be displayed in the detail area and starts a
   * view transition that animates adding, replacing or removing the detail
   * area. During the view transition, the element is added to the DOM and
   * assigned to the `detail` slot. Any previous detail element is removed.
   * When passing null as the element, the current detail element is removed.
   *
   * If the browser does not support view transitions, the respective updates
   * are applied immediately without starting a transition. The transition can
   * also be skipped using the `skipTransition` parameter.
   *
   * @param element the new detail element, or null to remove the current detail
   * @param skipTransition whether to skip the transition
   * @returns {Promise<void>}
   * @protected
   */
  _setDetail(element, skipTransition) {
    // Don't start a transition if detail didn't change
    const currentDetail = this.querySelector('[slot="detail"]');
    if ((element || null) === currentDetail) {
      return Promise.resolve();
    }

    const updateSlot = () => {
      // Remove old content
      this.querySelectorAll('[slot="detail"]').forEach((oldElement) => oldElement.remove());
      // Add new content
      if (element) {
        element.setAttribute('slot', 'detail');
        this.appendChild(element);
      }
    };

    if (skipTransition) {
      updateSlot();
      return Promise.resolve();
    }

    const hasDetail = !!currentDetail;
    const transitionType = hasDetail && element ? 'replace' : hasDetail ? 'remove' : 'add';
    return this._startTransition(transitionType, () => {
      // Update the DOM
      updateSlot();
      // Finish the transition
      this._finishTransition();
    });
  }

  /**
   * Starts a view transition that animates adding, replacing or removing the
   * detail area. Once the transition is ready and the browser has taken a
   * snapshot of the current layout, the provided update callback is called.
   * The callback should update the DOM, which can happen asynchronously.
   * Once the DOM is updated, the caller must call `_finishTransition`,
   * which results in the browser taking a snapshot of the new layout and
   * animating the transition.
   *
   * If the browser does not support view transitions, or the `noAnimation`
   * property is set, the update callback is called immediately without
   * starting a transition.
   *
   * @param transitionType
   * @param updateCallback
   * @returns {Promise<void>}
   * @protected
   */
  _startTransition(transitionType, updateCallback) {
    const useTransition = typeof document.startViewTransition === 'function' && !this.noAnimation;
    if (!useTransition) {
      updateCallback();
      return Promise.resolve();
    }

    this.setAttribute('transition', transitionType);
    this.__transition = document.startViewTransition(() => {
      // Return a promise that can be resolved once the DOM is updated
      return new Promise((resolve) => {
        this.__resolveUpdateCallback = resolve;
        // Notify the caller that the transition is ready, so that they can
        // update the DOM
        updateCallback();
      });
    });
    return this.__transition.finished;
  }

  /**
   * Finishes the current view transition, if any. This method should be called
   * after the DOM has been updated to finish the transition and animate the
   * change in the layout.
   *
   * @returns {Promise<void>}
   * @protected
   */
  async _finishTransition() {
    // Detect new layout mode after DOM has been updated
    this.__detectLayoutMode();

    if (!this.__transition) {
      return Promise.resolve();
    }
    // Resolve the update callback to finish the transition
    this.__resolveUpdateCallback();
    await this.__transition.finished;
    this.removeAttribute('transition');
    this.__transition = null;
    this.__resolveUpdateCallback = null;
  }

  /**
   * @event backdrop-click
   * Fired when the user clicks the backdrop in the drawer mode.
   */

  /**
   * @event detail-escape-press
   * Fired when the user presses Escape in the detail area.
   */
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };
