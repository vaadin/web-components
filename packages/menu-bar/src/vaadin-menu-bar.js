/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-menu-bar-submenu.js';
import './vaadin-menu-bar-button.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { menuBarStyles } from './styles/vaadin-menu-bar-core-styles.js';
import { MenuBarMixin } from './vaadin-menu-bar-mixin.js';

/**
 * `<vaadin-menu-bar>` is a Web Component providing a set of horizontally stacked buttons offering
 * the user quick access to a consistent set of commands. Each button can toggle a submenu with
 * support for additional levels of nested menus.
 *
 * To create the menu bar, first add the component to the page:
 *
 * ```html
 * <vaadin-menu-bar></vaadin-menu-bar>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-menu-bar#property-items) property to initialize the structure:
 *
 * ```js
 * document.querySelector('vaadin-menu-bar').items = [{text: 'File'}, {text: 'Edit'}];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `container`       | The container wrapping menu bar buttons.
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|----------------------------------
 * `disabled`          | Set when the menu bar is disabled
 * `has-single-button` | Set when there is only one button visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-menu-bar>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-menu-bar-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - `<vaadin-menu-bar-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-menu-bar-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-menu-bar-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 *
 * The `<vaadin-menu-bar-item>` sub-menu elements have the following additional state attributes
 * on top of the built-in `<vaadin-item>` state attributes:
 *
 * Attribute  | Description
 * ---------- |-------------
 * `expanded` | Expanded parent item.
 *
 * Note: the `theme` attribute value set on `<vaadin-menu-bar>` is
 * propagated to the internal components listed above.
 *
 * @fires {CustomEvent<boolean>} item-selected - Fired when a submenu item or menu bar button without children is clicked.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes MenuBarMixin
 * @mixes ThemableMixin
 */
class MenuBar extends MenuBarMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-menu-bar';
  }

  static get styles() {
    return menuBarStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="container" @click="${this.__onButtonClick}" @mouseover="${this._onMouseOver}">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>

      <slot name="submenu"></slot>

      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setManual(true);
    this.addController(this._tooltipController);
  }

  /**
   * Fired when either a submenu item or menu bar button without nested children is clicked.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu bar item
   */
}

defineCustomElement(MenuBar);

export { MenuBar };
