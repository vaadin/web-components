/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { getFocusableElements, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { getClosestElement } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { masterDetailLayoutStyles } from './styles/vaadin-master-detail-layout-base-styles.js';
import {
  animateIn,
  animateOut,
  cancelAnimations,
  detectOverflow,
  getCurrentAnimationProgress,
  parseTrackSizes,
} from './vaadin-master-detail-layout-helpers.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * ### Slots
 *
 * The component has two main content areas: the master area (default slot)
 * and the detail area (`detail` slot). When the detail doesn't fit next to
 * the master, it is shown as an overlay on top of the master area:
 *
 * ```html
 * <vaadin-master-detail-layout>
 *   <div>Master content</div>
 *   <div slot="detail">Detail content</div>
 * </vaadin-master-detail-layout>
 * ```
 *
 * The component also supports a `detail-placeholder` slot for content shown
 * in the detail area when no detail is selected. Unlike the `detail` slot,
 * the placeholder is simply hidden when it doesn't fit next to the master area,
 * rather than shown as an overlay:
 *
 * ```html
 * <vaadin-master-detail-layout>
 *   <div>Master content</div>
 *   <div slot="detail-placeholder">Select an item</div>
 * </vaadin-master-detail-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name             | Description
 * ----------------------|----------------------
 * `backdrop`            | Backdrop covering the master area in the overlay mode
 * `master`              | The master area
 * `detail`              | The detail area
 * `detail-placeholder`  | The detail placeholder area
 *
 * The following state attributes are available for styling:
 *
 * Attribute                 | Description
 * --------------------------|----------------------
 * `expand`                  | Set to `master`, `detail`, or `both`.
 * `orientation`             | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`              | Set when the detail content is provided and visible.
 * `has-detail-placeholder`  | Set when the detail placeholder content is provided.
 * `overlay`                 | Set when columns don't fit and the detail is shown as an overlay.
 * `overlay-containment`     | Set to `layout` or `viewport`.
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
       * the CSS grid layout. When there is not enough space to show
       * master and detail areas next to each other, the detail area
       * is shown as an overlay.
       * <p>
       * If not specified, the size is determined automatically by measuring
       * the detail content in a `min-content` CSS grid column when it first
       * becomes visible, and then caching the resulting intrinsic size. To
       * recalculate the cached intrinsic size, use the `recalculateLayout`
       * method.
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
        observer: '__orientationChanged',
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
       * Defaults to `'master'`.
       */
      expand: {
        type: String,
        value: 'master',
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

      /** @private */
      __detailCachedSize: {
        type: String,
        observer: '__detailCachedSizeChanged',
        sync: true,
      },
    };
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    const isOverlay = this.hasAttribute('has-detail') && this.hasAttribute('overlay');
    const isViewport = isOverlay && this.overlayContainment === 'viewport';
    const isLayoutContained = isOverlay && !isViewport;

    return html`
      <div id="backdrop" part="backdrop" @click="${this.__onBackdropClick}"></div>
      <div id="master" part="master" ?inert="${isLayoutContained}">
        <slot @slotchange="${this.__onSlotChange}"></slot>
      </div>
      <div id="detailOutgoing" inert>
        <slot name="detail-outgoing"></slot>
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
      <div id="detailPlaceholder" part="detail-placeholder">
        <slot name="detail-placeholder" @slotchange="${this.__onSlotChange}"></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__initResizeObserver();

    const ancestorLayouts = this.__ancestorLayouts;
    if (ancestorLayouts.length > 0) {
      ancestorLayouts.forEach((layout) => {
        cancelAnimationFrame(layout.__initialRaf);
      });

      this.__initialRaf = requestAnimationFrame(() => {
        this.recalculateLayout();
      });
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__resizeObserver.disconnect();
    cancelAnimationFrame(this.__resizeRaf);
    cancelAnimationFrame(this.__initialRaf);
    cancelAnimations(this);
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.style.setProperty('--_master-size', size);

    if (oldSize != null) {
      this.recalculateLayout();
    }
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.style.setProperty('--_detail-size', size);

    if (oldSize != null) {
      this.recalculateLayout();
    }
  }

  /** @private */
  __orientationChanged(_orientation, oldOrientation) {
    if (oldOrientation != null) {
      this.recalculateLayout();
    }
  }

  /** @private */
  __overlaySizeChanged(size) {
    this.style.setProperty('--_overlay-size', size);
  }

  /** @private */
  __detailCachedSizeChanged(size) {
    this.style.setProperty('--_detail-cached-size', size);
  }

  /** @private */
  __onSlotChange() {
    this.__initResizeObserver();
  }

  /** @private */
  __initResizeObserver() {
    this.__resizeObserver = this.__resizeObserver || new ResizeObserver(() => this.__onResize());
    this.__resizeObserver.disconnect();

    [this, this.$.master, this.$.detail, this.__slottedMaster, this.__slottedDetail].forEach((node) => {
      if (node) {
        this.__resizeObserver.observe(node);
      }
    });
  }

  /**
   * Called by the ResizeObserver. Reads layout state synchronously (no forced
   * reflow since layout is already computed), then defers writes to rAF.
   * Cancels any pending rAF so the write phase always uses the latest state.
   * @private
   */
  __onResize() {
    const state = this.__readLayoutState();
    cancelAnimationFrame(this.__resizeRaf);
    this.__resizeRaf = requestAnimationFrame(() => this.__writeLayoutState(state));
  }

  /**
   * Reads DOM/style state needed for layout detection. Safe to call in
   * ResizeObserver callback where layout is already computed (no forced reflow).
   * @private
   */
  __readLayoutState() {
    const isVertical = this.orientation === 'vertical';

    const slottedMaster = this.__slottedMaster;
    const slottedDetail = this.__slottedDetail;
    const slottedDetailPlaceholder = this.__slottedDetailPlaceholder;

    const hasMaster = !!slottedMaster;
    const hadDetail = this.hasAttribute('has-detail');
    const hasDetail = slottedDetail != null && slottedDetail.checkVisibility();
    const hasDetailPlaceholder = !!slottedDetailPlaceholder;

    const computedStyle = getComputedStyle(this);
    const hostSizeProp = isVertical ? 'height' : 'width';
    const hostSize = parseFloat(computedStyle[hostSizeProp]);

    const trackSizesProp = isVertical ? 'gridTemplateRows' : 'gridTemplateColumns';
    const trackSizes = parseTrackSizes(computedStyle[trackSizesProp]);

    const hasOverflow = (hasDetail || hasDetailPlaceholder) && detectOverflow(hostSize, trackSizes);
    const focusTarget = !hadDetail && hasDetail && hasOverflow ? getFocusableElements(slottedDetail)[0] : null;

    return {
      hasMaster,
      hadDetail,
      hasDetail,
      hasDetailPlaceholder,
      hasOverflow,
      focusTarget,
      hostSize,
      trackSizes,
    };
  }

  /**
   * Applies layout state to DOM attributes. Pure writes, no reads.
   * @private
   */
  __writeLayoutState({ hasMaster, hadDetail, hasDetail, hasDetailPlaceholder, hasOverflow, focusTarget, trackSizes }) {
    const [_masterSize, _masterExtra, detailSize] = trackSizes;

    // If no detailSize is explicitily set, cache the intrinsic size (min-content) of
    // the slotted detail content to use as a fallback for the detail column size
    // while the detail content is rendered in an overlay.
    if ((hasDetail || hasDetailPlaceholder) && this.__isDetailAutoSized && detailSize > 0) {
      this.__detailCachedSize = this.__detailCachedSize || `${Math.ceil(detailSize)}px`;
    } else {
      this.__detailCachedSize = null;
    }

    // Force the detail column offscreen when it first appears and overflow
    // is already detected. This prevents unnecessary master column shrinking,
    // as the detail content is rendered in an overlay anyway.
    if (!hadDetail && hasDetail && hasOverflow) {
      this.setAttribute('keep-detail-column-offscreen', '');
    } else if (!hasDetail || !hasOverflow) {
      this.removeAttribute('keep-detail-column-offscreen');
    }

    this.toggleAttribute('overlay', hasOverflow);
    this.toggleAttribute('has-master', hasMaster);
    this.toggleAttribute('has-detail', hasDetail);
    this.toggleAttribute('has-detail-placeholder', hasDetailPlaceholder);

    // Re-render to update ARIA attributes (role, aria-modal, inert)
    // which depend on has-detail and overlay state.
    this.requestUpdate();

    if (focusTarget) {
      focusTarget.focus({ preventScroll: true, focusVisible: isKeyboardActive() });
    }
  }

  /**
   * When `detailSize` is not explicitly set, re-measures the cached intrinsic size of
   * the detail content by placing it in a min-content CSS grid column, then repeats
   * this process for ancestor master-detail layouts without an explicit `detailSize`,
   * if any, so that their detail areas also adapt.
   *
   * Call this method after changing the detail content in a way that affects its intrinsic
   * size — for example, when opening a detail in a nested master-detail layout that was
   * not previously visible.
   *
   * NOTE: This method can be expensive in large layouts as it triggers consecutive
   * synchronous DOM reads and writes.
   */
  recalculateLayout() {
    const invalidatedLayouts = [...this.__ancestorLayouts, this];

    // Write
    invalidatedLayouts.forEach((layout) => {
      // Cancel any pending ResizeObserver rAF to prevent it from potentially
      // overriding the layout state with stale measurements.
      cancelAnimationFrame(layout.__resizeRaf);

      layout.__detailCachedSize = null;

      if (layout.__isDetailAutoSized) {
        layout.removeAttribute('overlay');
        layout.toggleAttribute('recalculating-detail-size', true);
      }
    });

    // Read/Write
    invalidatedLayouts.forEach((layout) => {
      const state = layout.__readLayoutState();
      layout.__writeLayoutState(state);
    });

    // Write
    invalidatedLayouts.forEach((layout) => {
      if (layout.__isDetailAutoSized) {
        layout.toggleAttribute('recalculating-detail-size', false);
      }
    });
  }

  /** @private */
  get __isDetailAutoSized() {
    return this.detailSize == null;
  }

  /** @private */
  get __ancestorLayouts() {
    const parent = getClosestElement(this.constructor.is, this.parentNode);
    return parent ? [...parent.__ancestorLayouts, parent] : [];
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
   * @return {Promise<void>}
   * @protected
   */
  async _setDetail(newDetail, skipTransition) {
    // Don't start a transition if detail didn't change
    const oldDetail = this.__slottedDetail;
    if (oldDetail === (newDetail || null)) {
      return;
    }

    const updateSlot = async () => {
      if (oldDetail && oldDetail.slot === 'detail') {
        oldDetail.remove();
      }

      if (newDetail) {
        newDetail.setAttribute('slot', 'detail');
        this.appendChild(newDetail);
      }

      // Wait for Lit elements to render
      await Promise.resolve();

      this.recalculateLayout();
    };

    if (skipTransition || this.noAnimation) {
      await updateSlot();
      return;
    }

    const hasPlaceholder = !!this.__slottedDetailPlaceholder;
    if ((oldDetail && newDetail) || (hasPlaceholder && !this.hasAttribute('overlay'))) {
      await this._startTransition('replace', updateSlot);
    } else if (!oldDetail && newDetail) {
      await this._startTransition('add', updateSlot);
    } else if (oldDetail && !newDetail) {
      await this._startTransition('remove', updateSlot);
    }
  }

  /**
   * Starts an animated transition for adding, replacing or removing the
   * detail area using the Web Animations API.
   *
   * For 'add'/'replace': DOM is updated immediately, then animation
   * starts after a microtask (so Lit elements render and layout is
   * recalculated before animation params are read).
   *
   * For 'remove': animation plays first, then DOM is updated after
   * the slide-out completes.
   *
   * Interruptible: a new transition cancels any in-progress animation
   * and picks up from the interrupted position.
   *
   * @param transitionType
   * @param updateSlot
   * @return {Promise<void>}
   * @protected
   */
  async _startTransition(transitionType, updateSlot) {
    if (this.noAnimation) {
      await updateSlot();
      return;
    }

    try {
      this.setAttribute('transition', transitionType);

      switch (transitionType) {
        case 'add':
          await this.__addTransition(updateSlot);
          break;
        case 'remove':
          await this.__removeTransition(updateSlot);
          break;
        default:
          await this.__replaceTransition(updateSlot);
          break;
      }

      this.removeAttribute('transition');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return; // Animation was cancelled
      }
      throw e;
    }
  }

  /** @private */
  async __addTransition(updateSlot) {
    await updateSlot();

    const progress = getCurrentAnimationProgress(this.$.detail);
    await Promise.all([
      animateIn(this.$.detail, ['fade', 'slide'], progress),
      animateIn(this.$.backdrop, ['fade'], this.hasAttribute('overlay') ? progress : 1),
    ]);
  }

  /** @private */
  async __replaceTransition(updateSlot) {
    const oldDetail = this.__slottedDetail;
    if (oldDetail) {
      oldDetail.slot = 'detail-outgoing';
    }

    try {
      this.$.detailOutgoing.style.width = this.__detailCachedSize;

      await updateSlot();

      const progress = getCurrentAnimationProgress(this.$.detail);
      await Promise.all([
        animateIn(this.$.detail, ['fade', 'slide'], progress),
        animateOut(this.$.detailOutgoing, ['fade', 'slide'], progress),
      ]);
    } finally {
      // Skip removal if the slot was reassigned during the transition.
      // The React component does this to let React handle the removal.
      if (oldDetail && oldDetail.slot === 'detail-outgoing') {
        oldDetail.remove();
      }
    }
  }

  /** @private */
  async __removeTransition(updateSlot) {
    const progress = getCurrentAnimationProgress(this.$.detail);
    await Promise.all([
      animateOut(this.$.detail, ['fade', 'slide'], progress),
      animateOut(this.$.backdrop, ['fade'], this.hasAttribute('overlay') ? progress : 1),
    ]);

    await updateSlot();
  }

  /** @private */
  get __slottedMaster() {
    return this.querySelector(':scope > :is([slot=""], :not([slot]))');
  }

  /** @private */
  get __slottedDetail() {
    return this.querySelector(':scope > [slot="detail"]');
  }

  /** @private */
  get __slottedDetailPlaceholder() {
    return this.querySelector(':scope > [slot="detail-placeholder"]');
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
