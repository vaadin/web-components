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
        opened="[[_autoOpened]]"
        position-target="[[target]]"
        modeless
      ></vaadin-tooltip-overlay>
    `;
  }

  static get properties() {
    return {
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
       * Reference to the element used as a tooltip trigger.
       * The target must be placed in the same shadow scope.
       * Defaults to an element referenced with `for`.
       */
      target: {
        type: Object,
        observer: '__targetChanged',
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
    };
  }

  constructor() {
    super();

    this._uniqueId = `vaadin-tooltip-${generateUniqueId()}`;

    this.__boundOnFocusin = this.__onFocusin.bind(this);
    this.__boundOnFocusout = this.__onFocusout.bind(this);
    this.__boundOnMouseDown = this.__onMouseDown.bind(this);
    this.__boundOnMouseEnter = this.__onMouseEnter.bind(this);
    this.__boundOnMouseLeave = this.__onMouseLeave.bind(this);
    this.__boundOnKeydown = this.__onKeyDown.bind(this);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._autoOpened) {
      this._autoOpened = false;
    }
  }

  /** @private */
  __autoOpenedChanged(opened, oldOpened) {
    if (opened) {
      document.addEventListener('keydown', this.__boundOnKeydown, true);
    } else if (oldOpened) {
      document.removeEventListener('keydown', this.__boundOnKeydown, true);
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
      oldTarget.removeEventListener('mouseenter', this.__boundOnMouseEnter);
      oldTarget.removeEventListener('mouseleave', this.__boundOnMouseLeave);
      oldTarget.removeEventListener('focusin', this.__boundOnFocusin);
      oldTarget.removeEventListener('focusout', this.__boundOnFocusout);
      oldTarget.removeEventListener('mousedown', this.__boundOnMouseDown);

      removeValueFromAttribute(oldTarget, 'aria-describedby', this._uniqueId);
    }

    if (target) {
      target.addEventListener('mouseenter', this.__boundOnMouseEnter);
      target.addEventListener('mouseleave', this.__boundOnMouseLeave);
      target.addEventListener('focusin', this.__boundOnFocusin);
      target.addEventListener('focusout', this.__boundOnFocusout);
      target.addEventListener('mousedown', this.__boundOnMouseDown);

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
      this._open();
    }
  }

  /** @private */
  __onFocusout() {
    this.__focusInside = false;

    if (!this.__hoverInside) {
      this._close();
    }
  }

  /** @private */
  __onKeyDown(event) {
    if (event.key === 'Escape') {
      event.stopImmediatePropagation();
      this._close();
    }
  }

  /** @private */
  __onMouseDown() {
    this._close();
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

  /** @protected */
  _open() {
    this._autoOpened = true;
  }

  /** @protected */
  _close() {
    this._autoOpened = false;
  }
}

customElements.define(Tooltip.is, Tooltip);

export { Tooltip };
