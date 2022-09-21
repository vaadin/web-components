/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tooltip-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { isKeyboardActive } from '@vaadin/component-base/src/focus-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

const DEFAULT_DELAY = 0;

let defaultFocusDelay = DEFAULT_DELAY;
let defaultHoverDelay = DEFAULT_DELAY;
let defaultHideDelay = DEFAULT_DELAY;

const closing = new Set();

let warmedUp = false;
let warmUpTimeout = null;
let cooldownTimeout = null;

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 *
 * ```html
 * <button id="confirm">Confirm</button>
 * <vaadin-tooltip text="Click to save changes" for="confirm"></vaadin-tooltip>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-tooltip>` uses `<vaadin-tooltip-overlay>` internal
 * themable component as the actual visible overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation
 * for `<vaadin-tooltip-overlay>` parts.
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * Note: the `theme` attribute value set on `<vaadin-tooltip>` is
 * propagated to the internal `<vaadin-tooltip-overlay>` component.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-tooltip>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-tooltip-offset-top`    | Used as an offset when the tooltip is aligned vertically below the target
 * `--vaadin-tooltip-offset-bottom` | Used as an offset when the tooltip is aligned vertically above the target
 * `--vaadin-tooltip-offset-start`  | Used as an offset when the tooltip is aligned horizontally after the target
 * `--vaadin-tooltip-offset-end`    | Used as an offset when the tooltip is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemePropertyMixin
 */
class Tooltip extends ThemePropertyMixin(ElementMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-tooltip';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <vaadin-tooltip-overlay
        id="[[_uniqueId]]"
        role="tooltip"
        renderer="[[_renderer]]"
        theme$="[[_theme]]"
        opened="[[__computeOpened(manual, opened, _autoOpened)]]"
        position-target="[[target]]"
        position="[[position]]"
        no-horizontal-overlap$="[[__computeNoHorizontalOverlap(position)]]"
        no-vertical-overlap$="[[__computeNoVerticalOverlap(position)]]"
        horizontal-align="[[__computeHorizontalAlign(position)]]"
        vertical-align="[[__computeVerticalAlign(position)]]"
        on-mouseleave="__onOverlayMouseLeave"
        modeless
      ></vaadin-tooltip-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * Object with properties passed to `generator` and
       * `shouldShow` functions for generating tooltip text
       * or detecting whether to show the tooltip or not.
       */
      context: {
        type: Object,
        value: () => {
          return {};
        },
      },

      /**
       * The delay in milliseconds before the tooltip
       * is opened on focus, when not in manual mode.
       * @attr {number} focus-delay
       */
      focusDelay: {
        type: Number,
      },

      /**
       * The id of the element used as a tooltip trigger.
       * The element should be in the DOM by the time when
       * the attribute is set, otherwise a warning is shown.
       */
      for: {
        type: String,
        observer: '__forChanged',
      },

      /**
       * The delay in milliseconds before the tooltip
       * is closed on losing hover, when not in manual mode.
       * On blur, the tooltip is closed immediately.
       * @attr {number} hide-delay
       */
      hideDelay: {
        type: Number,
      },

      /**
       * The delay in milliseconds before the tooltip
       * is opened on hover, when not in manual mode.
       * @attr {number} hover-delay
       */
      hoverDelay: {
        type: Number,
      },

      /**
       * When true, the tooltip is controlled programmatically
       * instead of reacting to focus and mouse events.
       */
      manual: {
        type: Boolean,
        value: false,
      },

      /**
       * When true, the tooltip is opened programmatically.
       * Only works if `manual` is set to `true`.
       */
      opened: {
        type: Boolean,
        value: false,
      },

      /**
       * Position of the tooltip with respect to its target.
       * Supported values: `top-start`, `top`, `top-end`,
       * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
       * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
       */
      position: {
        type: String,
        value: 'bottom',
      },

      /**
       * Function used to detect whether to show the tooltip based on a condition,
       * called every time the tooltip is about to be shown on hover and focus.
       * The function takes two parameters: `target` and `context`, which contain
       * values of the corresponding tooltip properties at the time of calling.
       * The tooltip is only shown when the function invocation returns `true`.
       */
      shouldShow: {
        type: Object,
        value: () => {
          return (_target, _context) => true;
        },
      },

      /**
       * Reference to the element used as a tooltip trigger.
       * The target must be placed in the same shadow scope.
       * Defaults to an element referenced with `for`.
       */
      target: {
        type: Object,
        observer: '__targetChanged',
      },

      /**
       * String used as a tooltip content.
       */
      text: {
        type: String,
        observer: '__textChanged',
      },

      /**
       * Function used to generate the tooltip content.
       * When provided, it overrides the `text` property.
       * Use the `context` property to provide argument
       * that can be passed to the generator function.
       */
      generator: {
        type: Object,
      },

      /**
       * Set to true when the overlay is opened using auto-added
       * event listeners: mouseenter and focusin (keyboard only).
       * @protected
       */
      _autoOpened: {
        type: Boolean,
        observer: '__autoOpenedChanged',
      },

      /** @protected */
      _overlayElement: Object,

      /** @private */
      __isTargetHidden: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return ['__generatorChanged(_overlayElement, generator, context)'];
  }

  /**
   * Sets the default focus delay to be used by all tooltip instances,
   * except for those that have focus delay configured using property.
   *
   * @param {number} delay
   */
  static setDefaultFocusDelay(focusDelay) {
    defaultFocusDelay = focusDelay != null && focusDelay >= 0 ? focusDelay : DEFAULT_DELAY;
  }

  /**
   * Sets the default hide delay to be used by all tooltip instances,
   * except for those that have hide delay configured using property.
   *
   * @param {number} hideDelay
   */
  static setDefaultHideDelay(hideDelay) {
    defaultHideDelay = hideDelay != null && hideDelay >= 0 ? hideDelay : DEFAULT_DELAY;
  }

  /**
   * Sets the default hover delay to be used by all tooltip instances,
   * except for those that have hover delay configured using property.
   *
   * @param {number} delay
   */
  static setDefaultHoverDelay(hoverDelay) {
    defaultHoverDelay = hoverDelay != null && hoverDelay >= 0 ? hoverDelay : DEFAULT_DELAY;
  }

  constructor() {
    super();

    this._uniqueId = `vaadin-tooltip-${generateUniqueId()}`;
    this._renderer = this.__tooltipRenderer.bind(this);

    this.__onFocusin = this.__onFocusin.bind(this);
    this.__onFocusout = this.__onFocusout.bind(this);
    this.__onMouseDown = this.__onMouseDown.bind(this);
    this.__onMouseEnter = this.__onMouseEnter.bind(this);
    this.__onMouseLeave = this.__onMouseLeave.bind(this);
    this.__onKeyDown = this.__onKeyDown.bind(this);

    this.__targetVisibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.__onTargetVisibilityChange(entry.isIntersecting);
      },
      { threshold: 1 },
    );
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._autoOpened) {
      this._close(true);
    }
  }

  /** @private */
  __computeHorizontalAlign(position) {
    return ['top-end', 'bottom-end', 'start-top', 'start', 'start-bottom'].includes(position) ? 'end' : 'start';
  }

  /** @private */
  __computeNoHorizontalOverlap(position) {
    return ['start-top', 'start', 'start-bottom', 'end-top', 'end', 'end-bottom'].includes(position);
  }

  /** @private */
  __computeNoVerticalOverlap(position) {
    return ['top-start', 'top-end', 'top', 'bottom-start', 'bottom', 'bottom-end'].includes(position);
  }

  /** @private */
  __computeVerticalAlign(position) {
    return ['top-start', 'top-end', 'top', 'start-bottom', 'end-bottom'].includes(position) ? 'bottom' : 'top';
  }

  /** @private */
  __computeOpened(manual, opened, autoOpened) {
    return manual ? opened : autoOpened;
  }

  /** @private */
  __tooltipRenderer(root) {
    root.textContent = typeof this.generator === 'function' ? this.generator(this.context) : this.text;
  }

  /** @private */
  __autoOpenedChanged(opened, oldOpened) {
    if (opened) {
      document.addEventListener('keydown', this.__onKeyDown, true);
    } else if (oldOpened) {
      document.removeEventListener('keydown', this.__onKeyDown, true);
    }
  }

  /** @private */
  __forChanged(forId) {
    if (forId) {
      const target = this.getRootNode().getElementById(forId);

      if (target) {
        this.target = target;
      } else {
        console.warn(`No element with id="${forId}" found to show tooltip.`);
      }
    }
  }

  /** @private */
  __targetChanged(target, oldTarget) {
    if (oldTarget) {
      oldTarget.removeEventListener('mouseenter', this.__onMouseEnter);
      oldTarget.removeEventListener('mouseleave', this.__onMouseLeave);
      oldTarget.removeEventListener('focusin', this.__onFocusin);
      oldTarget.removeEventListener('focusout', this.__onFocusout);
      oldTarget.removeEventListener('mousedown', this.__onMouseDown);

      this.__targetVisibilityObserver.unobserve(oldTarget);

      removeValueFromAttribute(oldTarget, 'aria-describedby', this._uniqueId);
    }

    if (target) {
      target.addEventListener('mouseenter', this.__onMouseEnter);
      target.addEventListener('mouseleave', this.__onMouseLeave);
      target.addEventListener('focusin', this.__onFocusin);
      target.addEventListener('focusout', this.__onFocusout);
      target.addEventListener('mousedown', this.__onMouseDown);

      // Wait before observing to avoid Chrome issue.
      requestAnimationFrame(() => {
        this.__targetVisibilityObserver.observe(target);
      });

      addValueToAttribute(target, 'aria-describedby', this._uniqueId);
    }
  }

  /** @private */
  __onFocusin(event) {
    if (this.manual) {
      return;
    }

    // Only open on keyboard focus.
    if (!isKeyboardActive()) {
      return;
    }

    // Do not re-open while focused if closed on Esc or mousedown.
    if (this.target.contains(event.relatedTarget)) {
      return;
    }

    if (!this.__isShouldShow()) {
      return;
    }

    this.__focusInside = true;

    if (!this.__isTargetHidden && (!this.__hoverInside || !this._autoOpened)) {
      this._open({ focus: true });
    }
  }

  /** @private */
  __onFocusout(event) {
    if (this.manual) {
      return;
    }

    // Do not close when moving focus within a component.
    if (this.target.contains(event.relatedTarget)) {
      return;
    }

    this.__focusInside = false;

    if (!this.__hoverInside) {
      this._close(true);
    }
  }

  /** @private */
  __onKeyDown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this._close(true);
    }
  }

  /** @private */
  __onMouseDown() {
    this._close(true);
  }

  /** @private */
  __onMouseEnter() {
    if (this.manual) {
      return;
    }

    if (!this.__isShouldShow()) {
      return;
    }

    if (this.__hoverInside) {
      // Already hovering inside the element, do nothing.
      return;
    }

    this.__hoverInside = true;

    if (!this.__isTargetHidden && (!this.__focusInside || !this._autoOpened)) {
      this._open({ hover: true });
    }
  }

  /** @private */
  __onMouseLeave(event) {
    if (event.relatedTarget !== this._overlayElement) {
      this.__handleMouseLeave();
    }
  }

  /** @private */
  __onOverlayMouseLeave(event) {
    if (event.relatedTarget !== this.target) {
      this.__handleMouseLeave();
    }
  }

  /** @private */
  __handleMouseLeave() {
    if (this.manual) {
      return;
    }

    this.__hoverInside = false;

    if (!this.__focusInside) {
      this._close();
    }
  }

  /** @private */
  __onTargetVisibilityChange(isVisible) {
    const oldHidden = this.__isTargetHidden;
    this.__isTargetHidden = !isVisible;

    // Open the overlay when the target becomes visible and has focus or hover.
    if (oldHidden && isVisible && (this.__focusInside || this.__hoverInside)) {
      this._open(true);
      return;
    }

    // Close the overlay when the target is no longer fully visible.
    if (!isVisible && this._autoOpened) {
      this._close(true);
    }
  }

  /** @private */
  __isShouldShow() {
    if (typeof this.shouldShow === 'function' && this.shouldShow(this.target, this.context) !== true) {
      return false;
    }

    return true;
  }

  /**
   * Schedule opening the tooltip.
   * @param {boolean} immediate
   * @protected
   */
  _open(options = { immediate: false }) {
    const { immediate, hover, focus } = options;
    const isHover = hover && this.__getHoverDelay() > 0;
    const isFocus = focus && this.__getFocusDelay() > 0;

    if (!immediate && (isHover || isFocus) && !this.__closeTimeout) {
      this.__warmupTooltip(isFocus);
    } else {
      this.__showTooltip();
    }
  }

  /**
   * Schedule closing the tooltip.
   * @param {boolean} immediate
   * @protected
   */
  _close(immediate) {
    if (!immediate && this.__getHideDelay() > 0) {
      this.__scheduleClose();
    } else {
      this.__abortClose();
      this._autoOpened = false;
    }

    this.__abortWarmUp();

    if (warmedUp) {
      // Re-start cooldown timer on each tooltip closing.
      this.__abortCooldown();
      this.__scheduleCooldown();
    }
  }

  /** @private */
  __getFocusDelay() {
    return this.focusDelay != null && this.focusDelay > 0 ? this.focusDelay : defaultFocusDelay;
  }

  /** @private */
  __getHoverDelay() {
    return this.hoverDelay != null && this.hoverDelay > 0 ? this.hoverDelay : defaultHoverDelay;
  }

  /** @private */
  __getHideDelay() {
    return this.hideDelay != null && this.hideDelay > 0 ? this.hideDelay : defaultHideDelay;
  }

  /** @private */
  __flushClosingTooltips() {
    closing.forEach((tooltip) => {
      tooltip._close(true);
      closing.delete(tooltip);
    });
  }

  /** @private */
  __showTooltip() {
    this.__abortClose();
    this.__flushClosingTooltips();

    this._autoOpened = true;
    warmedUp = true;

    // Abort previously scheduled timers.
    this.__abortWarmUp();
    this.__abortCooldown();
  }

  /** @private */
  __warmupTooltip(isFocus) {
    if (!this._autoOpened) {
      // First tooltip is opened, warm up.
      if (!warmedUp) {
        this.__scheduleWarmUp(isFocus);
      } else {
        // Warmed up, show another tooltip.
        this.__showTooltip();
      }
    }
  }

  /** @private */
  __abortClose() {
    if (this.__closeTimeout) {
      clearTimeout(this.__closeTimeout);
      this.__closeTimeout = null;
    }
  }

  /** @private */
  __abortCooldown() {
    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout);
      cooldownTimeout = null;
    }
  }

  /** @private */
  __abortWarmUp() {
    if (warmUpTimeout) {
      clearTimeout(warmUpTimeout);
      warmUpTimeout = null;
    }
  }

  /** @private */
  __scheduleClose() {
    if (this._autoOpened) {
      closing.add(this);

      this.__closeTimeout = setTimeout(() => {
        closing.delete(this);
        this.__closeTimeout = null;
        this._autoOpened = false;
      }, this.__getHideDelay());
    }
  }

  /** @private */
  __scheduleCooldown() {
    cooldownTimeout = setTimeout(() => {
      cooldownTimeout = null;
      warmedUp = false;
    }, this.__getHideDelay());
  }

  /** @private */
  __scheduleWarmUp(isFocus) {
    const delay = isFocus ? this.__getFocusDelay() : this.__getHoverDelay();
    warmUpTimeout = setTimeout(() => {
      warmUpTimeout = null;
      warmedUp = true;
      this.__showTooltip();
    }, delay);
  }

  /** @private */
  __textChanged(text, oldText) {
    if (this._overlayElement && (text || oldText)) {
      this._overlayElement.requestContentUpdate();
    }
  }

  /** @private */
  __generatorChanged(overlayElement, generator, context) {
    if (overlayElement) {
      if (generator !== this.__oldTextGenerator || context !== this.__oldContext) {
        overlayElement.requestContentUpdate();
      }

      this.__oldTextGenerator = generator;
      this.__oldContext = context;
    }
  }
}

customElements.define(Tooltip.is, Tooltip);

export { Tooltip };
