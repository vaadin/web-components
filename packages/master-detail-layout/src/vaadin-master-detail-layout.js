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

  constructor() {
    super();
    /** @type {WeakSet<Element>} Elements added to the DOM by `_setDetail()` */
    this.__managedDetails = new WeakSet();
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
    this.__endTransition();
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
    const detailContent = this.querySelector(':scope > [slot="detail"]');
    const detailPlaceholder = this.querySelector(':scope > [slot="detail-placeholder"]');

    const hadDetail = this.hasAttribute('has-detail');
    const hasDetail = detailContent != null && this.__isDetailVisible(detailContent);
    const hasDetailPlaceholder = !!detailPlaceholder;
    const hasOverflow = (hasDetail || hasDetailPlaceholder) && this.__checkOverflow();

    const focusTarget = !hadDetail && hasDetail && hasOverflow ? getFocusableElements(detailContent)[0] : null;
    return { hadDetail, hasDetail, hasDetailPlaceholder, hasOverflow, focusTarget };
  }

  /**
   * Checks whether a detail element is visible. Handles `display: contents`
   * elements (used by framework wrappers like React) which don't generate a
   * CSS box and therefore return `false` from `checkVisibility()`.
   *
   * Note: dynamically adding children to a `display: contents` wrapper does
   * not trigger the ResizeObserver (no box to observe). Framework wrappers
   * must call `_startTransition`/`_setDetail` directly to manage transitions.
   *
   * @param {Element} element
   * @return {boolean}
   * @private
   */
  __isDetailVisible(element) {
    if (element.checkVisibility()) {
      return true;
    }
    // display:contents elements have no box, so checkVisibility returns false.
    // Treat them as visible when they contain at least one visible child.
    if (getComputedStyle(element).display === 'contents') {
      return [...element.children].some((child) => child.checkVisibility());
    }
    return false;
  }

  /**
   * Applies layout state to DOM attributes. Pure writes, no reads.
   * @private
   */
  __applyLayoutState({ hadDetail, hasDetail, hasDetailPlaceholder, hasOverflow, focusTarget }) {
    // Set keep-detail-column-offscreen when detail first appears with overlay
    // to prevent master width from jumping.
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
   * @return {Promise<void>}
   * @protected
   */
  _setDetail(element, skipTransition) {
    // Don't start a transition if detail didn't change
    const currentDetail = this.querySelector('[slot="detail"]');
    if ((element || null) === currentDetail) {
      return Promise.resolve();
    }

    const updateSlot = () => {
      // Remove old content (only elements owned by _setDetail)
      this.querySelectorAll('[slot="detail"]').forEach((oldElement) => {
        if (this.__managedDetails.has(oldElement)) {
          oldElement.remove();
        }
      });
      // Add new content
      if (element) {
        element.setAttribute('slot', 'detail');
        this.__managedDetails.add(element);
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

    const transitionType = this.__getTransitionType(currentDetail, element);

    return this._startTransition(transitionType, () => {
      // Update the DOM
      updateSlot();
      // Finish the transition
      this._finishTransition();
    });
  }

  /**
   * Determines the transition type for a detail change.
   *
   * Returns 'replace' in two cases:
   * - Swapping one detail for another (standard replace).
   * - Swapping between placeholder and detail in split mode,
   *   so the swap appears instant (replace has 0ms duration in split).
   *   In overlay mode, placeholder doesn't participate in transitions,
   *   so standard 'add'/'remove' are used instead.
   *
   * @param {Element | null} currentDetail
   * @param {Element | null} newDetail
   * @return {string}
   * @private
   */
  __getTransitionType(currentDetail, newDetail) {
    if (currentDetail && newDetail) {
      return 'replace';
    }

    const hasPlaceholder = !!this.querySelector('[slot="detail-placeholder"]');
    if (hasPlaceholder && !this.hasAttribute('overlay')) {
      return 'replace';
    }

    return currentDetail ? 'remove' : 'add';
  }

  /**
   * Starts an animated transition for adding, replacing or removing the
   * detail area using the Web Animations API.
   *
   * For 'remove', the DOM update is deferred until the slide-out completes.
   * For 'add'/'replace', the DOM is updated immediately and the slide-in
   * plays on the new content.
   *
   * Animations are interruptible: starting a new transition cancels any
   * in-progress animation and the new animation picks up from the
   * interrupted position (see `__captureDetailState`).
   *
   * @param transitionType
   * @param updateCallback
   * @return {Promise<void>}
   * @protected
   */
  _startTransition(transitionType, updateCallback) {
    if (this.noAnimation) {
      updateCallback();
      return Promise.resolve();
    }

    // Capture mid-flight state before cancelling active animations
    const interrupted = this.__captureDetailState();

    this.__endTransition();

    if (transitionType === 'replace') {
      this.__snapshotOutgoing();
    }

    this.setAttribute('transition', transitionType);

    if (transitionType !== 'remove') {
      updateCallback();
    }

    const opts = this.__getAnimationParams();
    opts.interrupted = interrupted;
    opts.overlay = this.hasAttribute('overlay');

    return this.__animateTransition(transitionType, opts, updateCallback);
  }

  /**
   * Creates slide animation(s) for the given transition type and returns
   * a promise that resolves when the primary animation completes.
   * A version counter prevents stale callbacks from executing after
   * a newer transition has started.
   *
   * @param {string} transitionType
   * @param {{ offscreen: string, duration: number, easing: string, interrupted?: { translate: string, opacity: string }, overlay?: boolean }} opts
   * @param {Function} updateCallback
   * @return {Promise<void>}
   * @private
   */
  __animateTransition(transitionType, opts, updateCallback) {
    const version = (this.__transitionVersion = (this.__transitionVersion || 0) + 1);

    return new Promise((resolve) => {
      this.__transitionResolve = resolve;

      const onFinish = (callback) => {
        if (this.__transitionVersion === version) {
          if (callback) {
            callback();
          }
          this.__endTransition();
        }
      };

      if (transitionType === 'remove') {
        this.__slide(this.$.detail, false, opts).then(() => onFinish(updateCallback));
      } else if (transitionType === 'replace') {
        // Outgoing slides out on top (z-index), revealing incoming underneath.
        // In overlay mode, the incoming also slides in simultaneously.
        this.__slide(this.$.outgoing, false, opts).then(() => onFinish());
        if (opts.overlay) {
          this.__slide(this.$.detail, true, { ...opts, interrupted: null });
        }
      } else {
        this.__slide(this.$.detail, true, opts).then(() => onFinish());
      }

      // Fade backdrop in/out for overlay add/remove (not replace — backdrop stays visible)
      if (opts.overlay && transitionType !== 'replace') {
        const fadeIn = transitionType !== 'remove';
        this.__animate(this.$.backdrop, [{ opacity: fadeIn ? 0 : 1 }, { opacity: fadeIn ? 1 : 0 }], {
          duration: opts.duration,
          easing: 'linear',
        });
      }
    });
  }

  /**
   * Finishes the current transition by detecting and applying the layout
   * state. This method should be called after the DOM has been updated.
   *
   * @protected
   */
  _finishTransition() {
    const state = this.__computeLayoutState();
    this.__applyLayoutState(state);
  }

  /**
   * Captures the detail panel's current animated state (translate and
   * opacity). Must be called BEFORE `animation.cancel()`, because
   * cancel removes the animation effect and the element reverts to
   * its CSS resting state.
   *
   * Returns null when there is no active animation.
   *
   * @return {{ translate: string, opacity: string } | null}
   * @private
   */
  __captureDetailState() {
    if (!this.__activeAnimations || this.__activeAnimations.length === 0) {
      return null;
    }
    const { translate, opacity } = getComputedStyle(this.$.detail);
    return { translate, opacity };
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
   * @param {{ offscreen: string, duration: number, easing: string, interrupted?: { translate: string, opacity: string }, overlay?: boolean }} opts
   *   Animation parameters. `interrupted` overrides the default starting
   *   keyframe for interrupted animations (captured mid-flight before cancel).
   * @return {Promise<void>}
   * @private
   */
  __slide(element, slideIn, { offscreen, duration, easing, interrupted, overlay }) {
    if (!offscreen || duration <= 0) {
      return Promise.resolve();
    }

    const defaultTranslate = slideIn ? offscreen : 'none';
    const defaultOpacity = !overlay && slideIn ? 0 : 1;

    const start = interrupted ? interrupted.translate : defaultTranslate;
    const end = slideIn ? 'none' : offscreen;

    const opacityStart = interrupted ? Number(interrupted.opacity) : defaultOpacity;
    const opacityEnd = !overlay && !slideIn ? 0 : 1;

    return this.__animate(
      element,
      [
        { translate: start, opacity: opacityStart },
        { translate: end, opacity: opacityEnd },
      ],
      { duration, easing },
    );
  }

  /**
   * Runs a Web Animation on the given element, tracks it for cancellation,
   * and returns a promise that resolves when finished (or swallows the
   * rejection if cancelled).
   *
   * @param {HTMLElement} element
   * @param {Keyframe[]} keyframes
   * @param {KeyframeAnimationOptions} options
   * @return {Promise<void>}
   * @private
   */
  __animate(element, keyframes, options) {
    const animation = element.animate(keyframes, options);

    this.__activeAnimations = this.__activeAnimations || [];
    this.__activeAnimations.push(animation);

    return animation.finished.catch(() => {});
  }

  /**
   * Cancels in-progress animations, cleans up state, and resolves the
   * pending transition promise.
   * @private
   */
  __endTransition() {
    if (this.__activeAnimations) {
      this.__activeAnimations.forEach((a) => a.cancel());
      this.__activeAnimations = null;
    }
    this.removeAttribute('transition');
    this.__clearOutgoing();
    if (this.__transitionResolve) {
      this.__transitionResolve();
      this.__transitionResolve = null;
    }
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
    this.__replacing = true;
  }

  /**
   * Clears the outgoing container after the replace transition completes.
   * Elements owned by `_setDetail` (tracked in `__managedDetails`) are removed.
   * Externally managed elements (e.g. framework wrappers) are re-slotted to
   * a hidden slot so the framework retains DOM ownership.
   * @private
   */
  __clearOutgoing() {
    this.querySelectorAll('[slot="detail-outgoing"]').forEach((el) => {
      if (this.__managedDetails.has(el)) {
        el.remove();
      } else {
        el.setAttribute('slot', 'detail-hidden');
      }
    });
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
