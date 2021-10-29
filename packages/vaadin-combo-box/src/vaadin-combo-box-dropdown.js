/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { DisableUpgradeMixin } from '@polymer/polymer/lib/mixins/disable-upgrade-mixin.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-combo-box-overlay',
  css`
    :host {
      width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
    }
  `,
  { moduleId: 'vaadin-combo-box-overlay-styles' }
);

const ONE_THIRD = 0.3;

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class ComboBoxOverlayElement extends OverlayElement {
  static get is() {
    return 'vaadin-combo-box-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.querySelector('[part~="overlay"]').removeAttribute('tabindex');
    }

    return memoizedTemplate;
  }

  connectedCallback() {
    super.connectedCallback();

    const dropdown = this.__dataHost;
    const comboBoxOverlay = dropdown.getRootNode().host;
    const comboBox = comboBoxOverlay && comboBoxOverlay.getRootNode().host;
    const hostDir = comboBox && comboBox.getAttribute('dir');
    if (hostDir) {
      this.setAttribute('dir', hostDir);
    }
  }

  ready() {
    super.ready();
    const loader = document.createElement('div');
    loader.setAttribute('part', 'loader');
    const content = this.shadowRoot.querySelector('[part~="content"]');
    content.parentNode.insertBefore(loader, content);
  }
}

customElements.define(ComboBoxOverlayElement.is, ComboBoxOverlayElement);

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
class ComboBoxDropdownElement extends DisableUpgradeMixin(mixinBehaviors(IronResizableBehavior, PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host > #overlay {
          display: none;
        }
      </style>
      <vaadin-combo-box-overlay
        id="overlay"
        hidden$="[[hidden]]"
        opened="[[opened]]"
        style="align-items: stretch; margin: 0;"
        theme$="[[theme]]"
      >
        <slot></slot>
      </vaadin-combo-box-overlay>
    `;
  }

  static get is() {
    return 'vaadin-combo-box-dropdown';
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        observer: '_openedChanged'
      },

      /**
       * The element to position/align the dropdown by.
       */
      positionTarget: {
        type: Object
      },

      /**
       * If `true`, overlay is aligned above the `positionTarget`
       */
      alignedAbove: {
        type: Boolean,
        value: false
      },

      /**
       * Used to propagate the `theme` attribute from the host element.
       */
      theme: String
    };
  }

  constructor() {
    super();
    this._boundSetPosition = this._setPosition.bind(this);
    this._boundOutsideClickListener = this._outsideClickListener.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('iron-resize', this._boundSetPosition);
  }

  ready() {
    super.ready();

    // Preventing the default modal behaviour of the overlay on input clicking
    this.$.overlay.addEventListener('vaadin-overlay-outside-click', (e) => {
      e.preventDefault();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('iron-resize', this._boundSetPosition);

    // Making sure the overlay is closed and removed from DOM after detaching the dropdown.
    this.opened = false;
  }

  notifyResize() {
    super.notifyResize();

    if (this.positionTarget && this.opened) {
      this._setPosition();
      // Schedule another position update (to cover virtual keyboard opening for example)
      requestAnimationFrame(this._setPosition.bind(this));
    }
  }

  /**
   * Fired after the `vaadin-combo-box-dropdown` opens.
   *
   * @event vaadin-combo-box-dropdown-opened
   */
  /**
   * Fired after the `vaadin-combo-box-dropdown` closes.
   *
   * @event vaadin-combo-box-dropdown-closed
   */

  _openedChanged(opened, oldValue) {
    if (!!opened === !!oldValue) {
      return;
    }

    if (opened) {
      this.$.overlay.style.position = this._isPositionFixed(this.positionTarget) ? 'fixed' : 'absolute';
      this._setPosition();

      window.addEventListener('scroll', this._boundSetPosition, true);
      document.addEventListener('click', this._boundOutsideClickListener, true);
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-opened', { bubbles: true, composed: true }));
    } else if (!this.__emptyItems) {
      window.removeEventListener('scroll', this._boundSetPosition, true);
      document.removeEventListener('click', this._boundOutsideClickListener, true);
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-closed', { bubbles: true, composed: true }));
    }
  }

  // We need to listen on 'click' event and capture it and close the overlay before
  // propagating the event to the listener in the button. Otherwise, if the clicked button would call
  // open(), this would happen: https://www.youtube.com/watch?v=Z86V_ICUCD4
  _outsideClickListener(event) {
    const eventPath = event.composedPath();
    if (eventPath.indexOf(this.positionTarget) < 0 && eventPath.indexOf(this.$.overlay) < 0) {
      this.opened = false;
    }
  }

  _isPositionFixed(element) {
    const offsetParent = this._getOffsetParent(element);

    return (
      window.getComputedStyle(element).position === 'fixed' || (offsetParent && this._isPositionFixed(offsetParent))
    );
  }

  _getOffsetParent(element) {
    if (element.assignedSlot) {
      return element.assignedSlot.parentElement;
    } else if (element.parentElement) {
      return element.offsetParent;
    }

    const parent = element.parentNode;

    if (parent && parent.nodeType === 11 && parent.host) {
      return parent.host; // parent is #shadowRoot
    }
  }

  _verticalOffset(overlayRect, targetRect) {
    return this.alignedAbove ? -overlayRect.height : targetRect.height;
  }

  _shouldAlignLeft(targetRect) {
    const spaceRight = (window.innerWidth - targetRect.right) / window.innerWidth;

    return spaceRight < ONE_THIRD;
  }

  _shouldAlignAbove(targetRect) {
    const spaceBelow =
      (window.innerHeight - targetRect.bottom - Math.min(document.body.scrollTop, 0)) / window.innerHeight;

    return spaceBelow < ONE_THIRD;
  }

  _setOverlayWidth() {
    const inputWidth = this.positionTarget.clientWidth + 'px';
    const customWidth = getComputedStyle(this).getPropertyValue('--vaadin-combo-box-overlay-width');

    this.$.overlay.style.setProperty('--_vaadin-combo-box-overlay-default-width', inputWidth);

    if (customWidth === '') {
      this.$.overlay.style.removeProperty('--vaadin-combo-box-overlay-width');
    } else {
      this.$.overlay.style.setProperty('--vaadin-combo-box-overlay-width', customWidth);
    }
  }

  _setPosition(e) {
    if (this.hidden) {
      return;
    }
    if (e && e.target) {
      const target = e.target === document ? document.body : e.target;
      const parent = this.$.overlay.parentElement;
      if (!(target.contains(this.$.overlay) || target.contains(this.positionTarget)) || parent !== document.body) {
        return;
      }
    }

    const targetRect = this.positionTarget.getBoundingClientRect();
    const alignedLeft = this._shouldAlignLeft(targetRect);
    this.alignedAbove = this._shouldAlignAbove(targetRect);

    const overlayRect = this.$.overlay.getBoundingClientRect();
    this._translateX = alignedLeft
      ? targetRect.right - overlayRect.right + (this._translateX || 0)
      : targetRect.left - overlayRect.left + (this._translateX || 0);
    this._translateY =
      targetRect.top - overlayRect.top + (this._translateY || 0) + this._verticalOffset(overlayRect, targetRect);

    const _devicePixelRatio = window.devicePixelRatio || 1;
    this._translateX = Math.round(this._translateX * _devicePixelRatio) / _devicePixelRatio;
    this._translateY = Math.round(this._translateY * _devicePixelRatio) / _devicePixelRatio;
    this.$.overlay.style.transform = `translate3d(${this._translateX}px, ${this._translateY}px, 0)`;

    this.$.overlay.style.justifyContent = this.alignedAbove ? 'flex-end' : 'flex-start';

    this._setOverlayWidth();

    // TODO: fire only when position actually changes changes
    this.dispatchEvent(new CustomEvent('position-changed'));
  }
}

customElements.define(ComboBoxDropdownElement.is, ComboBoxDropdownElement);
