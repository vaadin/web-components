/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { menuBarOverlayStyles } from './styles/vaadin-menu-bar-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-menu-bar-overlay
 * @extends HTMLElement
 * @protected
 */
class MenuBarOverlay extends MenuOverlayMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-menu-bar-overlay';
  }

  static get styles() {
    return menuBarOverlayStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /**
   * Override method from `MenuOverlayMixin` to prevent closing the menu on
   * a click on the menu-bar button that opened it: the same click would
   * otherwise first close the menu here and then toggle it open again in
   * the menu-bar click handler. The button is the `listenOn` target of the
   * root sub-menu, so consult the root overlay's owner: this must also
   * apply when a nested sub-menu overlay is the topmost one.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldCloseOnOutsideClick(event) {
    if (event.composedPath().includes(this.__rootOverlay.owner.listenOn)) {
      return false;
    }

    return super._shouldCloseOnOutsideClick(event);
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
          <slot name="submenu"></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(MenuBarOverlay);

export { MenuBarOverlay };
