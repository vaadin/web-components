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

let defaultDelay = DEFAULT_DELAY;
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
        modeless
      ></vaadin-tooltip-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * Object with properties passed to `textGenerator`
       * function to be used for generating tooltip text.
       */
      context: {
        type: Object,
        value: () => {
          return {};
        },
      },

      /**
       * The delay in milliseconds before the tooltip
       * is opened on hover, when not in manual mode.
       * On focus, the tooltip is opened immediately.
       */
      delay: {
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
       * The function accepts a reference to the target element as a parameter.
       * The tooltip is only shown when the function invocation returns `true`.
       */
      shouldShow: {
        type: Object,
        value: () => {
          return (_target) => true;
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
      textGenerator: {
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
    return ['__textGeneratorChanged(_overlayElement, textGenerator, context)'];
  }

  /**
   * Sets the default delay to be used by all tooltip instances,
   * except for those that have delay configured using property.
   *
   * @param {number} delay
   */
  static setDefaultDelay(delay) {
    defaultDelay = delay != null && delay >= 0 ? delay : DEFAULT_DELAY;
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
  ready() {
    super.ready();

    this._overlayElement = this.shadowRoot.querySelector('vaadin-tooltip-overlay');
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
    root.textContent = typeof this.textGenerator === 'function' ? this.textGenerator(this.context) : this.text;
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

      this.__targetVisibilityObserver.observe(target);

      addValueToAttribute(target, 'aria-describedby', this._uniqueId);
    }
  }

  /** @private */
  __onFocusin() {
    // Only open on keyboard focus.
    if (!isKeyboardActive()) {
      return;
    }

    if (typeof this.shouldShow === 'function' && this.shouldShow(this.target) !== true) {
      return;
    }

    this.__focusInside = true;

    if (!this.__isTargetHidden && (!this.__hoverInside || !this._autoOpened)) {
      this._open(true);
    }
  }

  /** @private */
  __onFocusout() {
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
    if (typeof this.shouldShow === 'function' && this.shouldShow(this.target) !== true) {
      return;
    }

    if (this.__hoverInside) {
      // Already hovering inside the element, do nothing.
      return;
    }

    this.__hoverInside = true;

    if (!this.__isTargetHidden && (!this.__focusInside || !this._autoOpened)) {
      this._open();
    }
  }

  /** @private */
  __onMouseLeave() {
    this.__hoverInside = false;

    if (!this.__focusInside) {
      this._close();
    }
  }

  /** @private */
  __onTargetVisibilityChange(isVisible) {
    this.__isTargetHidden = !isVisible;

    // Open the overlay when the target is visible and has focus or hover.
    if (isVisible && (this.__focusInside || this.__hoverInside)) {
      this._open(true);
      return;
    }

    // Close the overlay when the target is no longer fully visible.
    if (!isVisible && this._autoOpened) {
      this._close(true);
    }
  }

  /**
   * Schedule opening the tooltip.
   * @param {boolean} immediate
   * @protected
   */
  _open(immediate) {
    if (!immediate && this.__getDelay() > 0 && !this.__closeTimeout) {
      this.__warmupTooltip();
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
  __getDelay() {
    return this.delay != null && this.delay > 0 ? this.delay : defaultDelay;
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
  __warmupTooltip() {
    if (!this._autoOpened) {
      // First tooltip is opened, warm up.
      if (!warmedUp) {
        this.__scheduleWarmUp();
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
  __scheduleWarmUp() {
    warmUpTimeout = setTimeout(() => {
      warmUpTimeout = null;
      warmedUp = true;
      this.__showTooltip();
    }, this.__getDelay());
  }

  /** @private */
  __textChanged(text, oldText) {
    if (this._overlayElement && (text || oldText)) {
      this._overlayElement.requestContentUpdate();
    }
  }

  /** @private */
  __textGeneratorChanged(overlayElement, textGenerator, context) {
    if (overlayElement) {
      if (textGenerator !== this.__oldTextGenerator || context !== this.__oldContext) {
        overlayElement.requestContentUpdate();
      }

      this.__oldTextGenerator = textGenerator;
      this.__oldContext = context;
    }
  }
}

customElements.define(Tooltip.is, Tooltip);

export { Tooltip };
