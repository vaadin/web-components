/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tooltip-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

let defaultDelay = 0;
let defaultHideDelay = 0;

const tooltips = new Set();

let warmedUp = false;
let warmUpTimeout = null;
let cooldownTimeout = null;

function addTooltip(tooltip) {
  tooltips.add(tooltip);
}

function deleteTooltip(tooltip) {
  tooltips.delete(tooltip);
}

function closeOpenTooltips() {
  tooltips.forEach((tooltip) => {
    tooltip._close(true);
    tooltips.delete(tooltip);
  });
}

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
        theme$="[[_theme]]"
        opened="[[__computeOpened(manual, opened, _autoOpened)]]"
        position-target="[[target]]"
        renderer="[[_renderer]]"
        modeless
        position="[[position]]"
        horizontal-align="[[__computeHorizontalAlign(position)]]"
        vertical-align="[[__computeVerticalAlign(position)]]"
        no-horizontal-overlap="[[__computeNoHorizontalOverlap(position)]]"
        no-vertical-overlap="[[__computeNoVerticalOverlap(position)]]"
      ></vaadin-tooltip-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * The delay in milliseconds before the tooltip
       * is opened, when not using manual mode.
       * This only applies to `mouseenter` listener.
       * On focus, the tooltip is opened immediately.
       */
      delay: {
        type: Number,
        value: () => defaultDelay,
      },

      /**
       * An id of the target element.
       */
      for: {
        type: String,
        observer: '__forChanged',
      },

      /**
       * The delay in milliseconds before the tooltip
       * is closed, when not using manual mode.
       * This only applies to `mouseleave` listener.
       * On blur, the tooltip is closed immediately.
       * @attr {number} hide-delay
       */
      hideDelay: {
        type: Number,
        value: () => defaultHideDelay,
      },

      /**
       * When true, the tooltip is controlled manually
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
      },

      /**
       * Position of the tooltip with respect to its target.
       * Supported values: `top`, `bottom`, `start`, `end`.
       */
      position: {
        type: String,
        value: 'top',
      },

      /**
       * An HTML element to attach the tooltip to.
       * The target must be placed in the same shadow scope.
       * Defaults to an element referenced with `targetId`.
       */
      target: {
        type: Object,
        observer: '__targetChanged',
      },

      /**
       * String used for a tooltip content.
       */
      text: {
        type: String,
        observer: '__textChanged',
      },

      /**
       * When true, the tooltip is opened
       * by using its auto-added listeners.
       */
      _autoOpened: {
        type: Boolean,
      },

      /**
       * A function for rendering tooltip content.
       * @protected
       */
      _renderer: {
        type: Object,
      },
    };
  }

  /**
   * Sets the default delay to use for all tooltip instances.
   * This method should be called before creating any tooltips.
   * It does not affect the default for existing tooltips.
   *
   * @param {number} delay
   */
  static setDefaultDelay(delay) {
    defaultDelay = delay;
  }

  /**
   * Sets the default hide delay to use for all tooltip instances.
   * This method should be called before creating any tooltips.
   * It does not affect the default for existing tooltips.
   *
   * @param {number} hideDelay
   */
  static setDefaultHideDelay(hideDelay) {
    defaultHideDelay = hideDelay;
  }

  constructor() {
    super();

    this._renderer = this.__defaultRenderer.bind(this);
    this._uniqueId = `vaadin-tooltip-${generateUniqueId()}`;

    this.__boundOnMouseEnter = this.__onMouseEnter.bind(this);
    this.__boundOnMouseLeave = this.__onMouseLeave.bind(this);
    this.__boundOnFocusin = this.__onFocusin.bind(this);
    this.__boundOnFocusout = this.__onFocusout.bind(this);
    this.__boundOnKeydown = this.__onKeydown.bind(this);
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
      this._autoOpened = false;
    }
  }

  /** @private */
  __computeHorizontalAlign(position) {
    return position === 'start' ? 'end' : 'start';
  }

  /** @private */
  __computeNoHorizontalOverlap(position) {
    return position === 'start' || position === 'end';
  }

  /** @private */
  __computeNoVerticalOverlap(position) {
    return position === 'bottom' || position === 'top';
  }

  /** @private */
  __computeOpened(manual, opened, autoOpened) {
    return manual ? opened : autoOpened;
  }

  /** @private */
  __computeVerticalAlign(position) {
    return position === 'bottom' ? 'top' : 'bottom';
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
      oldTarget.removeEventListener('mouseenter', this.__boundOnMouseEnter);
      oldTarget.removeEventListener('mouseleave', this.__boundOnMouseLeave);
      oldTarget.removeEventListener('focusin', this.__boundOnFocusin);
      oldTarget.removeEventListener('focusout', this.__boundOnFocusout);
      oldTarget.removeEventListener('keydown', this.__boundOnKeydown);

      removeValueFromAttribute(oldTarget, 'aria-describedby', this._uniqueId);
    }

    if (target) {
      target.addEventListener('mouseenter', this.__boundOnMouseEnter);
      target.addEventListener('mouseleave', this.__boundOnMouseLeave);
      target.addEventListener('focusin', this.__boundOnFocusin);
      target.addEventListener('focusout', this.__boundOnFocusout);
      target.addEventListener('keydown', this.__boundOnKeydown);

      addValueToAttribute(target, 'aria-describedby', this._uniqueId);
    }
  }

  /** @private */
  __textChanged(text, oldText) {
    if (this._overlayElement && (text || oldText)) {
      this._overlayElement.requestContentUpdate();
    }
  }

  /** @private */
  __defaultRenderer(root) {
    root.textContent = this.text;
  }

  /** @private */
  __onFocusin() {
    this.__focusInside = true;

    if (!this.__hoverInside || !this._autoOpened) {
      // Open immediately on focus.
      this._open(true);
    }
  }

  /** @private */
  __onFocusout() {
    this.__focusInside = false;

    if (!this.__hoverInside) {
      // Close immediately on blur.
      this._close(true);
    }
  }

  /** @private */
  __onKeydown(event) {
    if (event.key === 'Escape') {
      this._close(true);
    }
  }

  /** @private */
  __onMouseEnter() {
    this.__hoverInside = true;

    if (!this.__focusInside || !this._autoOpened) {
      // Open after a delay on hover.
      this._open();
    }
  }

  /** @private */
  __onMouseLeave() {
    this.__hoverInside = false;

    if (!this.__focusInside) {
      // Close after a hide delay.
      this._close();
    }
  }

  /** @protected */
  _open(immediate) {
    if (!immediate && this.delay > 0 && !this.__closeTimeout) {
      this.__warmupTooltip();
    } else {
      this.__showTooltip();
    }
  }

  /** @protected */
  _close(immediate) {
    if (immediate) {
      clearTimeout(this.__closeTimeout);
      this.__finishClose();
    } else if (!this.__closeTimeout) {
      this.__closeTimeout = setTimeout(() => {
        this.__finishClose();
      }, this.hideDelay);
    }

    if (warmUpTimeout) {
      clearTimeout(warmUpTimeout);
      warmUpTimeout = null;
    }

    if (warmedUp) {
      if (cooldownTimeout) {
        clearTimeout(cooldownTimeout);
      }

      cooldownTimeout = setTimeout(() => {
        deleteTooltip(this);
        cooldownTimeout = null;
        warmedUp = false;
      }, this.hideDelay);
    }
  }

  /** @private */
  __finishClose() {
    this.__closeTimeout = null;
    this._autoOpened = false;
  }

  /** @private */
  __showTooltip() {
    clearTimeout(this.__closeTimeout);
    this.__closeTimeout = null;

    closeOpenTooltips();
    addTooltip(this);

    warmedUp = true;

    this._autoOpened = true;

    if (warmUpTimeout) {
      clearTimeout(warmUpTimeout);
      warmUpTimeout = null;
    }

    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout);
      cooldownTimeout = null;
    }
  }

  /** @private */
  __warmupTooltip() {
    closeOpenTooltips();
    addTooltip(this);

    if (!this._autoOpened) {
      // First tooltip is opened, warm up.
      if (!warmUpTimeout && !warmedUp) {
        warmUpTimeout = setTimeout(() => {
          warmUpTimeout = null;
          warmedUp = true;
          this.__showTooltip();
        }, this.delay);
      } else {
        // Warmed up, show another tooltip.
        this.__showTooltip();
      }
    }
  }
}

customElements.define(Tooltip.is, Tooltip);

export { Tooltip };
