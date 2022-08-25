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

const instances = new Set();

let warmedUp = false;
let warmUpTimeout = null;
let cooldownTimeout = null;

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
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
        value: () => defaultDelay,
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
        value: () => defaultHideDelay,
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
    };
  }

  static get observers() {
    return ['__textGeneratorChanged(_overlayElement, textGenerator, context)'];
  }

  /**
   * Sets the default delay to be used by all tooltip instances.
   * This method should be called before creating any tooltips.
   * It does not change the default for existing tooltips.
   *
   * @param {number} delay
   */
  static setDefaultDelay(delay) {
    defaultDelay = delay != null && delay >= 0 ? delay : DEFAULT_DELAY;
  }

  /**
   * Sets the default hide delay to be used by all tooltip instances.
   * This method should be called before creating any tooltips.
   * It does not change the default for existing tooltips.
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

      removeValueFromAttribute(oldTarget, 'aria-describedby', this._uniqueId);
    }

    if (target) {
      target.addEventListener('mouseenter', this.__onMouseEnter);
      target.addEventListener('mouseleave', this.__onMouseLeave);
      target.addEventListener('focusin', this.__onFocusin);
      target.addEventListener('focusout', this.__onFocusout);
      target.addEventListener('mousedown', this.__onMouseDown);

      addValueToAttribute(target, 'aria-describedby', this._uniqueId);
    }
  }

  /** @private */
  __onFocusin() {
    // Only open on keyboard focus.
    if (!isKeyboardActive()) {
      return;
    }

    this.__focusInside = true;

    if (!this.__hoverInside || !this._autoOpened) {
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
      event.stopImmediatePropagation();
      this._close(true);
    }
  }

  /** @private */
  __onMouseDown() {
    this._close(true);
  }

  /** @private */
  __onMouseEnter() {
    this.__hoverInside = true;

    if (!this.__focusInside || !this._autoOpened) {
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

  /**
   * Schedule opening the tooltip.
   * @param {boolean} immediate
   * @protected
   */
  _open(immediate) {
    if (!immediate && this.delay > 0 && !this.__closeTimeout) {
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
    if (!immediate && this.hideDelay > 0) {
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
  __closeOtherTooltips() {
    instances.forEach((tooltip) => {
      if (tooltip !== this) {
        tooltip._close(true);
        instances.delete(tooltip);
      }
    });

    instances.add(this);
  }

  /** @private */
  __showTooltip() {
    this.__abortClose();
    this.__closeOtherTooltips();

    this._autoOpened = true;
    warmedUp = true;

    // Abort previously scheduled timers.
    this.__abortWarmUp();
    this.__abortCooldown();
  }

  /** @private */
  __warmupTooltip() {
    this.__closeOtherTooltips();

    if (!this._autoOpened) {
      // First tooltip is opened, warm up.
      if (!warmUpTimeout && !warmedUp) {
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
      this.__closeTimeout = setTimeout(() => {
        this.__closeTimeout = null;
        this._autoOpened = false;
      }, this.hideDelay);
    }
  }

  /** @private */
  __scheduleCooldown() {
    cooldownTimeout = setTimeout(() => {
      instances.delete(this);
      cooldownTimeout = null;
      warmedUp = false;
    }, this.hideDelay);
  }

  /** @private */
  __scheduleWarmUp() {
    warmUpTimeout = setTimeout(() => {
      warmUpTimeout = null;
      warmedUp = true;
      this.__showTooltip();
    }, this.delay);
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
