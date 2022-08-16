/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tooltip-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

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
        id="overlay"
        role="tooltip"
        theme$="[[_theme]]"
        opened="[[__computeOpened(manual, opened, _autoOpened)]]"
        position-target="[[target]]"
        renderer="[[_renderer]]"
        modeless
        no-vertical-overlap
      ></vaadin-tooltip-overlay>
    `;
  }

  static get properties() {
    return {
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
       * An HTML element to attach the tooltip to.
       * The target must be placed in the same shadow scope.
       * Defaults to an element referenced with `targetId`.
       */
      target: {
        type: Object,
        observer: '__targetChanged',
      },

      /**
       * An id of the target element.
       * @attr {string} target-id
       */
      targetId: {
        type: String,
        observer: '__targetIdChanged',
      },

      /**
       * String used for a tooltip content.
       */
      text: {
        type: String,
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

  constructor() {
    super();

    this._renderer = this.__defaultRenderer.bind(this);

    this.__boundOnMouseEnter = this.__onMouseEnter.bind(this);
    this.__boundOnMouseLeave = this.__onMouseLeave.bind(this);
    this.__boundOnFocusin = this.__onFocusin.bind(this);
    this.__boundOnFocusout = this.__onFocusout.bind(this);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._autoOpened) {
      this._autoOpened = false;
    }
  }

  /** @private */
  __computeOpened(manual, opened, autoOpened) {
    return manual ? opened : autoOpened;
  }

  /** @private */
  __targetChanged(target, oldTarget) {
    if (oldTarget) {
      oldTarget.removeEventListener('mouseenter', this.__boundOnMouseEnter);
      oldTarget.removeEventListener('mouseleave', this.__boundOnMouseLeave);
      oldTarget.removeEventListener('focusin', this.__boundOnFocusin);
      oldTarget.removeEventListener('focusout', this.__boundOnFocusout);
    }

    if (target) {
      target.addEventListener('mouseenter', this.__boundOnMouseEnter);
      target.addEventListener('mouseleave', this.__boundOnMouseLeave);
      target.addEventListener('focusin', this.__boundOnFocusin);
      target.addEventListener('focusout', this.__boundOnFocusout);
    }
  }

  /** @private */
  __targetIdChanged(targetId) {
    if (targetId) {
      const target = this.getRootNode().getElementById(targetId);

      if (target) {
        this.target = target;
      } else {
        console.warn(`No element with id="${targetId}" found to show tooltip.`);
      }
    }
  }

  /** @private */
  __defaultRenderer(root) {
    root.textContent = this.text;
  }

  /** @private */
  __onFocusin() {
    this.__focusInside = true;

    if (!this.__mouseInside) {
      this._autoOpened = true;
    }
  }

  /** @private */
  __onFocusout() {
    this.__focusInside = false;

    if (!this.__mouseInside) {
      this._autoOpened = false;
    }
  }

  /** @private */
  __onMouseEnter() {
    this.__mouseInside = true;

    if (!this.__focusInside) {
      this._autoOpened = true;
    }
  }

  /** @private */
  __onMouseLeave() {
    this.__mouseInside = false;

    if (!this.__focusInside) {
      this._autoOpened = false;
    }
  }
}

customElements.define(Tooltip.is, Tooltip);

export { Tooltip };
