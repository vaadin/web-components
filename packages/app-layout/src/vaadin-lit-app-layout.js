/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './detect-ios-navbar.js';
import './safe-area-inset.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AppLayoutMixin } from './vaadin-app-layout-mixin.js';
import { appLayoutStyles } from './vaadin-app-layout-styles.js';

/**
 * LitElement based version of `<vaadin-app-layout>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class AppLayout extends AppLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-app-layout';
  }

  static get styles() {
    return appLayoutStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="navbar" id="navbarTop">
        <slot name="navbar" @slotchange="${this._updateTouchOptimizedMode}"></slot>
      </div>
      <div part="backdrop" @click="${this._onBackdropClick}" @touchend="${this._onBackdropTouchend}"></div>
      <div part="drawer" id="drawer">
        <slot name="drawer" id="drawerSlot" @slotchange="${this._updateDrawerSize}"></slot>
      </div>
      <div content>
        <slot></slot>
      </div>
      <div part="navbar" id="navbarBottom" bottom hidden>
        <slot name="navbar-bottom"></slot>
      </div>
      <div hidden>
        <slot id="touchSlot" name="navbar touch-optimized" @slotchange="${this._updateTouchOptimizedMode}"></slot>
      </div>
    `;
  }
}

defineCustomElement(AppLayout);

export { AppLayout };
