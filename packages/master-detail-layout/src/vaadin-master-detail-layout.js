/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { getFocusableElements } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { masterDetailLayoutStyles } from './styles/vaadin-master-detail-layout-base-styles.js';
import { masterDetailLayoutTransitionStyles } from './styles/vaadin-master-detail-layout-transition-base-styles.js';

function parseTrackSizes(gridTemplate) {
  return gridTemplate
    .replace(/\[[^\]]+\]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .split(' ')
    .map(parseFloat);
}

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name      | Description
 * ---------------|----------------------
 * `backdrop`     | Backdrop covering the master area in the overlay mode
 * `master`       | The master area
 * `detail`       | The detail area
 *
 * The following state attributes are available for styling:
 *
 * Attribute             | Description
 * ----------------------|----------------------
 * `expand`              | Set to `master`, `detail`, or `both`.
 * `orientation`         | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`          | Set when the detail content is provided and visible.
 * `overflow`            | Set when columns don't fit and the detail is shown as an overlay.
 * `overlay-containment` | Set to `layout` or `viewport`.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                  |
 * :----------------------------------------------------|
 * | `--vaadin-master-detail-layout-border-color`       |
 * | `--vaadin-master-detail-layout-border-width`       |
 * | `--vaadin-master-detail-layout-detail-background`  |
 * | `--vaadin-master-detail-layout-detail-shadow`      |
 * | `--vaadin-overlay-backdrop-background`             |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} backdrop-click - Fired when the user clicks the backdrop in the overlay mode.
 * @fires {CustomEvent} detail-escape-press - Fired when the user presses Escape in the detail area.
 *
 * @customElement vaadin-master-detail-layout
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes SlotStylesMixin
 */
class MasterDetailLayout extends SlotStylesMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-master-detail-layout';
  }

  static get styles() {
    return masterDetailLayoutStyles;
  }

  static get properties() {
    return {
      /**
       * Size (in CSS length units) to be set on the detail area in
       * the CSS grid layout. If there is not enough space to show
       * master and detail areas next to each other, the detail area
       * is shown as an overlay. Defaults to 15em.
       *
       * @attr {string} detail-size
       */
      detailSize: {
        type: String,
        sync: true,
        observer: '__detailSizeChanged',
      },

      /**
       * Size (in CSS length units) to be set on the master area in
       * the CSS grid layout. If there is not enough space to show
       * master and detail areas next to each other, the detail area
       * is shown as an overlay. Defaults to 30em.
       *
       * @attr {string} master-size
       */
      masterSize: {
        type: String,
        sync: true,
        observer: '__masterSizeChanged',
      },

      /**
       * Size (in CSS length units) for the detail area when shown as an
       * overlay. When not set, falls back to `detailSize`. Set to `100%`
       * to make the detail cover the full layout.
       *
       * @attr {string} overlay-size
       */
      overlaySize: {
        type: String,
        sync: true,
        observer: '__overlaySizeChanged',
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
        sync: true,
      },

      /**
       * Defines the containment of the detail area when the layout is in
       * overlay mode. When set to `layout`, the overlay is confined to the
       * layout. When set to `viewport`, the overlay is confined to the
       * browser's viewport. Defaults to `layout`.
       *
       * @attr {string} overlay-containment
       */
      overlayContainment: {
        type: String,
        value: 'layout',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * Controls which column(s) expand to fill available space.
       * Possible values: `'master'`, `'detail'`, `'both'`.
       * Defaults to `'both'`.
       */
      expand: {
        type: String,
        value: 'both',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, disables view transitions.
       * @attr {boolean} no-animation
       */
      noAnimation: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get experimental() {
    return true;
  }

  /** @return {!Array<!CSSResult>} */
  get slotStyles() {
    return [masterDetailLayoutTransitionStyles];
  }

  /** @protected */
  render() {
    const isOverlay = this.hasAttribute('has-detail') && this.hasAttribute('overflow');
    const isViewport = isOverlay && this.overlayContainment === 'viewport';
    const isLayoutContained = isOverlay && !isViewport;

    return html`
      <div part="backdrop" @click="${this.__onBackdropClick}"></div>
      <div id="master" part="master" ?inert="${isLayoutContained}">
        <slot @slotchange="${this.__onSlotChange}"></slot>
      </div>
      <div
        id="detail"
        part="detail"
        role="${isOverlay ? 'dialog' : nothing}"
        aria-modal="${isViewport ? 'true' : nothing}"
        @keydown="${this.__onDetailKeydown}"
      >
        <slot name="detail" @slotchange="${this.__onSlotChange}"></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__initResizeObserver();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__resizeObserver.disconnect();
    cancelAnimationFrame(this.__resizeRaf);
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);
  }

  /** @private */
  __overlaySizeChanged(size, oldSize) {
    this.__updateStyleProperty('overlay-size', size, oldSize);
  }

  /** @private */
  __updateStyleProperty(prop, size, oldSize) {
    if (size) {
      this.style.setProperty(`--_${prop}`, size);
    } else if (oldSize) {
      this.style.removeProperty(`--_${prop}`);
    }
  }

  /** @private */
  __onSlotChange() {
    this.__initResizeObserver();
  }

  /** @private */
  __initResizeObserver() {
    this.__resizeObserver = this.__resizeObserver || new ResizeObserver(() => this.__onResize());
    this.__resizeObserver.disconnect();

    const children = this.querySelectorAll(':scope > [slot="detail"], :scope >:not([slot])');
    [this, this.$.master, this.$.detail, ...children].forEach((node) => {
      this.__resizeObserver.observe(node);
    });
  }

  /**
   * Called by the ResizeObserver. Reads layout state synchronously (no forced
   * reflow since layout is already computed), then defers writes to rAF.
   * Cancels any pending rAF so the write phase always uses the latest state.
   * @private
   */
  __onResize() {
    const state = this.__computeLayoutState();
    cancelAnimationFrame(this.__resizeRaf);
    this.__resizeRaf = requestAnimationFrame(() => this.__applyLayoutState(state));
  }

  /**
   * Reads DOM/style state needed for layout detection. Safe to call in
   * ResizeObserver callback where layout is already computed (no forced reflow).
   * @private
   */
  __computeLayoutState() {
    const detailContent = this.querySelector('[slot="detail"]');
    const hadDetail = this.hasAttribute('has-detail');
    const hasDetail = detailContent != null && detailContent.checkVisibility();
    const hasOverflow = hasDetail && this.__checkOverflow();
    const focusTarget = !hadDetail && hasDetail && hasOverflow ? getFocusableElements(detailContent)[0] : null;
    return { hadDetail, hasDetail, hasOverflow, focusTarget };
  }

  /**
   * Applies layout state to DOM attributes. Pure writes, no reads.
   * @private
   */
  __applyLayoutState({ hadDetail, hasDetail, hasOverflow, focusTarget }) {
    // Set preserve-master-width when detail first appears with overflow
    // to prevent master width from jumping.
    if (!hadDetail && hasDetail && hasOverflow) {
      this.setAttribute('preserve-master-width', '');
    } else if (!hasDetail || !hasOverflow) {
      this.removeAttribute('preserve-master-width');
    }

    this.toggleAttribute('has-detail', hasDetail);
    this.toggleAttribute('overflow', hasOverflow);

    // Re-render to update ARIA attributes (role, aria-modal, inert)
    // which depend on has-detail and overflow state.
    this.requestUpdate();

    if (focusTarget) {
      focusTarget.focus();
    }
  }

  /** @private */
  __checkOverflow() {
    const isVertical = this.orientation === 'vertical';
    const computedStyle = getComputedStyle(this);

    const hostSize = parseFloat(computedStyle[isVertical ? 'height' : 'width']);
    const [masterSize, masterExtra, detailSize] = parseTrackSizes(
      computedStyle[isVertical ? 'gridTemplateRows' : 'gridTemplateColumns'],
    );

    if (Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)) {
      return false;
    }
    if (Math.floor(masterExtra) >= Math.floor(detailSize)) {
      return false;
    }
    return true;
  }

  /** @private */
  __onBackdropClick() {
    this.dispatchEvent(new CustomEvent('backdrop-click'));
  }

  /** @private */
  __onDetailKeydown(event) {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      // Prevent firing on parent layout when using nested layouts
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('detail-escape-press'));
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
    // Detect layout mode before resolving the transition, so the browser's
    // "new" snapshot includes the correct overlay state. The microtask runs
    // before the Promise resolution propagates to startViewTransition.
    queueMicrotask(() => {
      const state = this.__computeLayoutState();
      this.__applyLayoutState(state);
    });

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
   * Fired when the user clicks the backdrop in the overlay mode.
   */

  /**
   * @event detail-escape-press
   * Fired when the user presses Escape in the detail area.
   */
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };
