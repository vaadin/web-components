/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { dropdownMenuOverlayStyles } from './styles/vaadin-dropdown-menu-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-dropdown-menu>`. Not intended to be used separately.
 *
 * @customElement vaadin-dropdown-menu-overlay
 * @extends HTMLElement
 * @protected
 */
class DropdownMenuOverlay extends MenuOverlayMixin(
  OverlayMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-dropdown-menu-overlay';
  }

  static get properties() {
    return {
      /**
       * Position of the overlay with respect to the target.
       */
      position: {
        type: String,
        reflectToAttribute: true,
      },
    };
  }

  static get styles() {
    return dropdownMenuOverlayStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  willUpdate(props) {
    super.willUpdate(props);

    // Update width here so that `PositionMixin` uses correct width in `updated()`.
    if ((props.has('opened') || props.has('positionTarget')) && this.opened && this.positionTarget) {
      this.style.setProperty('--_vaadin-dropdown-menu-overlay-default-width', `${this.positionTarget.offsetWidth}px`);
    }
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="-1">
        <div part="content" id="content">
          <slot></slot>
          <slot name="submenu"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Override method from `MenuOverlayMixin` to not close the menu on a click
   * on the dropdown button, which toggles the menu itself.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldCloseOnOutsideClick(event) {
    if (event.composedPath().includes(this.owner.listenOn)) {
      return false;
    }

    return super._shouldCloseOnOutsideClick(event);
  }

  /**
   * Override method from `MenuOverlayMixin` to also treat the overlay part
   * as contained, so that focus is restored when it had focus on close.
   *
   * @param {Node} node
   * @return {boolean}
   * @protected
   * @override
   */
  _deepContains(node) {
    return node === this.$.overlay || super._deepContains(node);
  }
}

defineCustomElement(DropdownMenuOverlay);

export { DropdownMenuOverlay };
