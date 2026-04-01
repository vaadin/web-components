/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { getFocusableElements } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { getClosestElement } from '@vaadin/component-base/src/dom-utils.js';
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

function detectOverflow(hostSize, trackSizes) {
  const [masterSize, masterExtra, detailSize] = trackSizes;

  if (Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)) {
    return false;
  }
  if (Math.floor(masterExtra) >= Math.floor(detailSize)) {
    return false;
  }
  return true;
}

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
      __replacing: {
        type: Boolean,
        sync: true,
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
      <div id="outgoing" inert ?hidden="${!this.__replacing}">
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
      <div id="detail-placeholder" part="detail-placeholder">
        <slot name="detail-placeholder" @slotchange="${this.__onSlotChange}"></slot>
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
    this.__cancelActiveAnimations();
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);

    if (oldSize != null) {
      this.recalculateLayout();
    }
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);

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
  __overlaySizeChanged(size, oldSize) {
    this.__updateStyleProperty('overlay-size', size, oldSize);
  }

  /** @private */
  __detailCachedSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-cached-size', size, oldSize);
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

    const detailContent = this.querySelector(':scope > [slot="detail"]');
    const detailPlaceholder = this.querySelector(':scope > [slot="detail-placeholder"]');

    const hadDetail = this.hasAttribute('has-detail');
    const hasDetail = detailContent != null && detailContent.checkVisibility();
    const hasDetailPlaceholder = !!detailPlaceholder;

    const computedStyle = getComputedStyle(this);
    const hostSizeProp = isVertical ? 'height' : 'width';
    const hostSize = parseFloat(computedStyle[hostSizeProp]);

    const trackSizesProp = isVertical ? 'gridTemplateRows' : 'gridTemplateColumns';
    const trackSizes = parseTrackSizes(computedStyle[trackSizesProp]);

    const hasOverflow = (hasDetail || hasDetailPlaceholder) && detectOverflow(hostSize, trackSizes);
    const focusTarget = !hadDetail && hasDetail && hasOverflow ? getFocusableElements(detailContent)[0] : null;

    return {
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
  __writeLayoutState({ hadDetail, hasDetail, hasDetailPlaceholder, hasOverflow, focusTarget, trackSizes }) {
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
    this.toggleAttribute('has-detail', hasDetail);
    this.toggleAttribute('has-detail-placeholder', hasDetailPlaceholder);

    // Re-render to update ARIA attributes (role, aria-modal, inert)
    // which depend on has-detail and overlay state.
    this.requestUpdate();

    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
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
    // Cancel any pending ResizeObserver rAF to prevent it from potentially
    // overriding the layout state with stale measurements.
    cancelAnimationFrame(this.__resizeRaf);

    const invalidatedLayouts = [...this.__ancestorLayouts.filter((layout) => layout.__isDetailAutoSized), this];

    // Write
    invalidatedLayouts.forEach((layout) => {
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
  _setDetail(newDetail, skipTransition) {
    // Don't start a transition if detail didn't change
    const oldDetail = this.querySelector('[slot="detail"]');
    if (oldDetail === (newDetail || null)) {
      return Promise.resolve();
    }

    const updateSlot = async () => {
      if (oldDetail) {
        oldDetail.remove();
      }

      if (newDetail) {
        newDetail.setAttribute('slot', 'detail');
        this.appendChild(newDetail);
      }

      await Promise.resolve();
      this.recalculateLayout();
    };

    if (skipTransition || this.noAnimation) {
      return updateSlot();
    }

    if (!oldDetail && newDetail) {
      return this._startTransition('add', updateSlot);
    } else if (oldDetail && !newDetail) {
      return this._startTransition('remove', updateSlot);
    } else if (oldDetail && newDetail) {
      return this._startTransition('replace', updateSlot);
    }
  }

  /** @protected */
  async _startTransition(transitionType, updateSlot) {
    const params = this.__getAnimationParams();

    this.__cancelActiveAnimations();

    try {
      this.setAttribute('transition', transitionType);

      switch (transitionType) {
        case 'add':
          await this.__addTransition(params, updateSlot);
          break;
        case 'remove':
          await this.__removeTransition(params, updateSlot);
          break;
        default:
          await this.__replaceTransition(params, updateSlot);
          break;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return; // Animation was cancelled
      }
      throw e;
    } finally {
      this.removeAttribute('transition');
    }
  }

  /** @private */
  async __addTransition(params, updateSlot) {
    await updateSlot();

    const animations = [this.__slide(this.$.detail, true, params).finished];

    if (this.hasAttribute('overlay')) {
      animations.push(
        this.$.backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: params.duration,
          easing: 'linear',
        }).finished,
      );
    }

    await Promise.all(animations);
  }

  /** @private */
  async __replaceTransition(params, updateSlot) {
    try {
      this.__snapshotOutgoing();

      await updateSlot();

      if (this.hasAttribute('overlay')) {
        await Promise.all([
          this.__slide(this.$.detail, true, params).finished,
          this.__slide(this.$.outgoing, false, params).finished,
        ]);
      }
    } finally {
      this.__clearOutgoing();
    }
  }

  /** @private */
  async __removeTransition(params, updateSlot) {
    const animations = [this.__slide(this.$.detail, false, params).finished];

    if (this.hasAttribute('overlay')) {
      animations.push(
        this.$.backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: params.duration,
          easing: 'linear',
        }).finished,
      );
    }

    await Promise.all(animations);
    await updateSlot();
  }

  __cancelActiveAnimations() {
    this.getAnimations()
      .filter((animation) => !animation.finished)
      .forEach((animation) => animation.cancel());
  }

  /**
   * Reads animation parameters from CSS custom properties. Called once
   * per transition so that animating stays free of layout reads.
   *
   * @return {{ offscreen: string, duration: number, easing: string }}
   * @private
   */
  __getAnimationParams() {
    const cs = getComputedStyle(this);
    const offscreen = cs.getPropertyValue('--_detail-offscreen').trim();
    const durationStr = cs.getPropertyValue('--_transition-duration').trim();
    const duration = durationStr.endsWith('ms') ? parseFloat(durationStr) : parseFloat(durationStr) * 1000;
    const easing = cs.getPropertyValue('--_transition-easing').trim();
    return { offscreen, duration, easing };
  }

  /**
   * Creates a slide animation on the element's `translate` property
   * using the Web Animations API. Returns a promise that resolves when
   * the animation finishes, or immediately if the duration is 0.
   *
   * @param {HTMLElement} element - The element to animate
   * @param {boolean} slideIn - If true, slide in (off-screen → on-screen);
   *   otherwise slide out (on-screen → off-screen)
   * @param {{ offscreen: string, duration: number, easing: string, overlay?: boolean }} opts
   *   Animation parameters.
   * @return {Promise<void>}
   * @private
   */
  __slide(element, slideIn, { offscreen, duration, easing }) {
    if (!offscreen || duration <= 0) {
      return Promise.resolve();
    }

    const defaultTranslate = slideIn ? offscreen : 'none';
    const defaultOpacity = slideIn ? 0 : 1;

    const start = defaultTranslate;
    const end = slideIn ? 'none' : offscreen;

    const opacityStart = defaultOpacity;
    const opacityEnd = !slideIn ? 0 : 1;

    return element.animate(
      [
        { translate: start, opacity: opacityStart },
        { translate: end, opacity: opacityEnd },
      ],
      { duration, easing },
    );
  }

  /**
   * Moves the current detail content to the outgoing slot so it can
   * slide out while the new content slides in. Keeps the element in
   * light DOM so light DOM styles continue to apply.
   * @private
   */
  __snapshotOutgoing() {
    const currentDetail = this.querySelector('[slot="detail"]');
    if (!currentDetail) {
      return;
    }
    currentDetail.setAttribute('slot', 'detail-outgoing');
    this.$.outgoing.style.width = this.__detailCachedSize;
    this.__replacing = true;
  }

  /**
   * Clears the outgoing container after the replace transition completes.
   * @private
   */
  __clearOutgoing() {
    this.querySelectorAll('[slot="detail-outgoing"]').forEach((el) => el.remove());
    this.$.outgoing.style.width = '';
    this.__replacing = false;
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
