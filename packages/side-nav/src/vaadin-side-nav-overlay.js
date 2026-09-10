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
