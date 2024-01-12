/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-contextmenu-event.js';
import './vaadin-lit-context-menu-item.js';
import './vaadin-lit-context-menu-list-box.js';
import './vaadin-lit-context-menu-overlay.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { ContextMenuMixin } from './vaadin-context-menu-mixin.js';

/**
 * LitElement based version of `<vaadin-context-menu>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class ContextMenu extends ContextMenuMixin(
  OverlayClassMixin(ElementMixin(ThemePropertyMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-context-menu';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot id="slot"></slot>`;
  }

  /** @protected */
  ready() {
    super.ready();

    processTemplates(this);
  }

  /**
   * @protected
   * @override
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.appendChild(this._overlayElement);
    return root;
  }

  /**
   * Fired when an item is selected when the context menu is populated using the `items` API.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu item
   */
}

defineCustomElement(ContextMenu);
export { ContextMenu };
