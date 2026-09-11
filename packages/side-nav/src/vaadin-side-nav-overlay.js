/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavOverlayStyles } from './styles/vaadin-side-nav-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-side-nav-item>` to render its child
 * items in a flyout next to the item. Not intended to be used separately.
 *
 * The element stays in the item's shadow tree and only uses the native popover
 * API to render in the top layer, so that the child items keep their position in
 * the document tab order and are not clipped by an ancestor's `overflow`.
 *
 * @customElement vaadin-side-nav-overlay
 * @extends HTMLElement
 * @private
 */
class SideNavOverlay extends PositionMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-side-nav-overlay';
  }

  static get properties() {
    return {
      /**
       * When enabled, the element renders as `display: contents` so that its
       * content participates in the owner's layout instead of in a flyout.
       *
       * The element is always rendered, in both modes, so that the owner's
       * `<slot>` is never replaced. Replacing it would leave the owner's
       * `SlotController` bound to a detached slot.
       *
       * @attr {boolean} inline
       */
      inline: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  static get styles() {
    return sideNavOverlayStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  constructor() {
    super();
    this.__boundOnGlobalKeyDown = this.__onGlobalKeyDown.bind(this);
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    if (props.has('opened')) {
      const method = this.opened ? 'addEventListener' : 'removeEventListener';
      document[method]('keydown', this.__boundOnGlobalKeyDown, true);
    }
  }

  /**
   * Close on Escape and keep the key from reaching ancestors. Without this, the
   * App Layout drawer holding the nav closes on the same key press, so one press
   * would dismiss the whole navigation rather than just the flyout.
   *
   * @private
   */
  __onGlobalKeyDown(event) {
    if (event.key === 'Escape' && this.opened && this._last) {
      event.stopPropagation();
      this.close(event);
    }
  }

  /**
   * @protected
   * @override
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    // `OverlayMixin` only removes the element from the global overlay stack while
    // closing, so an overlay that is detached while open would stay registered
    // there for the lifetime of the page, retaining the owner and its listeners.
    if (this.opened) {
      this.opened = false;
    }
    document.removeEventListener('keydown', this.__boundOnGlobalKeyDown, true);
  }

  /**
   * Override method from `PositionMixin` to close the flyout once its anchor is
   * no longer on screen. The anchor keeps a non-zero rect when the App Layout
   * drawer slides shut, so the base 0x0 check does not catch that case and the
   * flyout would be left floating over the page.
   *
   * @protected
   * @override
   */
  _updatePosition() {
    if (this.opened && this.positionTarget && !this.__isTargetOnScreen()) {
      this.close();
      return;
    }
    super._updatePosition();
  }

  /** @private */
  __isTargetOnScreen() {
    if (!this.positionTarget.checkVisibility({ visibilityProperty: true })) {
      return false;
    }
    const { top, right, bottom, left } = this.positionTarget.getBoundingClientRect();
    return right > 0 && bottom > 0 && left < window.innerWidth && top < window.innerHeight;
  }

  /**
   * Override method from `OverlayMixin` to always add the outside click
   * listener, since the flyout is modeless but still has to close when
   * clicking elsewhere on the page.
   *
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldAddGlobalListeners() {
    return true;
  }

  /**
   * Override method from `OverlayMixin` to not close on clicking the item that
   * the flyout belongs to, which the item handles as a toggle instead.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldCloseOnOutsideClick(event) {
    if (event.composedPath().includes(this.positionTarget)) {
      return false;
    }
    return super._shouldCloseOnOutsideClick(event);
  }
}

defineCustomElement(SideNavOverlay);
