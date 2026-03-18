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
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { masterDetailLayoutStyles } from './styles/vaadin-master-detail-layout-base-styles.js';

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
 */
class MasterDetailLayout extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
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
       * When true, the layout does not use animated transitions for the detail area.
       *
       * @attr {boolean} no-animation
       */
      noAnimation: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  static get experimental() {
    return true;
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
      <div id="detail-outgoing" part="detail detail-outgoing" inert hidden></div>
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
      focusTarget.focus({ preventScroll: true });
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
   * Sets the detail element to be displayed in the detail area and starts an
   * animated transition for adding, replacing or removing the detail area.
   * The element is added to the DOM and assigned to the `detail` slot. Any
   * previous detail element is removed. When passing null as the element,
   * the current detail element is removed.
   *
   * The transition can be skipped using the `skipTransition` parameter or
   * the `noAnimation` property.
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

    if (skipTransition || this.noAnimation) {
      updateSlot();
      queueMicrotask(() => {
        const state = this.__computeLayoutState();
        this.__applyLayoutState(state);
      });
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
   * Starts a CSS transition for adding, replacing or removing the detail
   * area. The `[transition]` attribute is set on the host, and CSS
   * transitions on `translate` animate the detail panel.
   *
   * For 'remove' transitions, the DOM update is deferred until the
   * transition completes. For 'add'/'replace', the DOM is updated
   * immediately and the transition plays on the new content.
   *
   * CSS transitions are interruptible: starting a new transition while
   * one is in progress causes the browser to reverse from the current
   * position.
   *
   * If the `noAnimation` property is set, the update callback is called
   * immediately without starting a transition.
   *
   * @param transitionType
   * @param updateCallback
   * @returns {Promise<void>}
   * @protected
   */
  _startTransition(transitionType, updateCallback) {
    if (this.noAnimation) {
      updateCallback();
      return Promise.resolve();
    }

    // If a previous transition is pending, resolve it and invalidate its listeners
    if (this.__transitionResolve) {
      this.__transitionResolve();
      this.__transitionResolve = null;
    }
    this.__transitionVersion = (this.__transitionVersion || 0) + 1;
    this.__clearOutgoing();

    // For 'replace': snapshot old content into outgoing container before DOM update
    if (transitionType === 'replace') {
      this.__snapshotOutgoing();
    }

    this.setAttribute('transition', transitionType);

    // For 'remove', keep the element in the DOM during the slide-out.
    // For 'add'/'replace', update DOM immediately so the new element is in the slot.
    if (transitionType !== 'remove') {
      updateCallback();
    } else {
      // Store the callback to run after the slide-out completes
      this.__pendingRemoveCallback = updateCallback;
    }

    // For 'replace', start the outgoing slide after the reflow
    if (transitionType === 'replace') {
      this.__startOutgoingSlide();
    }

    // Listen for the transition to complete
    this.__awaitTransition(transitionType);

    return new Promise((resolve) => {
      this.__transitionResolve = resolve;
    });
  }

  /**
   * Finishes the current transition by detecting and applying the layout
   * state. The forced reflow via `getComputedStyle()` establishes the
   * "before" translate value, then `__applyLayoutState()` sets `has-detail`
   * which changes translate — triggering the CSS transition.
   *
   * @protected
   */
  _finishTransition() {
    // Force style resolution so the browser sees the "before" translate value
    // before we change has-detail (which triggers the CSS transition).
    const state = this.__computeLayoutState();
    this.__applyLayoutState(state);
  }

  /**
   * Listens for the `transitionend` event on the detail element to
   * clean up after the transition completes.
   * @private
   */
  __awaitTransition(transitionType) {
    this.__transitionVersion = (this.__transitionVersion || 0) + 1;
    const version = this.__transitionVersion;
    const target = this.$.detail;

    const handler = (event) => {
      if (event.target !== target || event.propertyName !== 'translate') {
        return;
      }
      target.removeEventListener('transitionend', handler);
      if (this.__transitionVersion === version) {
        this.__onTransitionEnd(transitionType);
      }
    };
    target.addEventListener('transitionend', handler);

    // Fallback: if no CSS transition plays (e.g., not in overlay mode,
    // or duration is 0), resolve immediately via getAnimations() check
    requestAnimationFrame(() => {
      if (this.__transitionVersion !== version) {
        return;
      }
      const animations = target.getAnimations();
      if (animations.length === 0) {
        target.removeEventListener('transitionend', handler);
        this.__onTransitionEnd(transitionType);
      }
    });
  }

  /**
   * Called when the detail's CSS transition completes.
   * @private
   */
  __onTransitionEnd(transitionType) {
    if (transitionType === 'remove' && this.__pendingRemoveCallback) {
      // Now safe to remove the detail element — slide-out is done
      this.__pendingRemoveCallback();
      this.__pendingRemoveCallback = null;
    }

    this.removeAttribute('transition');
    this.__clearOutgoing();

    if (this.__transitionResolve) {
      this.__transitionResolve();
      this.__transitionResolve = null;
    }
  }

  /**
   * Moves the current detail content into the outgoing container so it
   * can slide out while the new content slides in.
   * @private
   */
  __snapshotOutgoing() {
    const outgoing = this.$['detail-outgoing'];
    const currentDetail = this.querySelector('[slot="detail"]');
    if (!currentDetail || !outgoing) {
      return;
    }
    // Move old element into shadow DOM outgoing container
    currentDetail.removeAttribute('slot');
    outgoing.appendChild(currentDetail);
    // Position it on-screen (matching current detail position)
    outgoing.style.translate = 'none';
    outgoing.style.visibility = 'visible';
    outgoing.removeAttribute('hidden');
  }

  /**
   * Triggers the slide-out transition on the outgoing container.
   * @private
   */
  __startOutgoingSlide() {
    const outgoing = this.$['detail-outgoing'];
    if (!outgoing || outgoing.hidden) {
      return;
    }
    // Force reflow so the browser captures the on-screen position
    getComputedStyle(outgoing).getPropertyValue('translate');
    // Remove inline styles — CSS defaults (off-screen translate) kick in → transition plays
    outgoing.style.translate = '';
    outgoing.style.visibility = '';
  }

  /**
   * Clears the outgoing container after the replace transition completes.
   * @private
   */
  __clearOutgoing() {
    const outgoing = this.$['detail-outgoing'];
    if (!outgoing) {
      return;
    }
    // Move any children back before removing (in case they need cleanup)
    while (outgoing.firstChild) {
      outgoing.firstChild.remove();
    }
    outgoing.removeAttribute('style');
    outgoing.setAttribute('hidden', '');
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
