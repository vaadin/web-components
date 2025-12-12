/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { tabStyles } from './styles/vaadin-tab-base-styles.js';

/**
 * `<vaadin-tab>` is a Web Component providing an accessible and customizable tab.
 *
 * ```html
 * <vaadin-tab>Tab 1</vaadin-tab>
 * ```
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|---------------------------------
 * `disabled`     | Set when the element is disabled
 * `focused`      | Set when the element is focused
 * `focus-ring`   | Set when the element is keyboard focused
 * `selected`     | Set when the tab is selected
 * `active`       | Set when mousedown or enter/spacebar pressed
 * `orientation`  | Set to `horizontal` or `vertical` depending on the direction of items
 * `has-tooltip`  | Set when the tab has a slotted tooltip
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property            |
 * :------------------------------|
 * | `--vaadin-tab-background`    |
 * | `--vaadin-tab-border-color`  |
 * | `--vaadin-tab-border-width`  |
 * | `--vaadin-tab-font-size`     |
 * | `--vaadin-tab-font-weight`   |
 * | `--vaadin-tab-gap`           |
 * | `--vaadin-tab-padding`       |
 * | `--vaadin-tab-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 */
class Tab extends ItemMixin(ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-tab';
  }

  static get styles() {
    return tabStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>
      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'tab');

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  /**
   * Override an event listener from `KeyboardMixin`
   * to handle clicking anchors inside the tabs.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyUp(event) {
    const willClick = this.hasAttribute('active');

    super._onKeyUp(event);

    if (willClick) {
      const anchor = this.querySelector('a');
      if (anchor) {
        anchor.click();
      }
    }
  }
}

defineCustomElement(Tab);

export { Tab };
