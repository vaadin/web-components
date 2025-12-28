/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tab.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { tabsStyles } from './styles/vaadin-tabs-base-styles.js';
import { TabsMixin } from './vaadin-tabs-mixin.js';

/**
 * `<vaadin-tabs>` is a Web Component for organizing and grouping content into sections.
 *
 * ```html
 * <vaadin-tabs selected="4">
 *   <vaadin-tab>Page 1</vaadin-tab>
 *   <vaadin-tab>Page 2</vaadin-tab>
 *   <vaadin-tab>Page 3</vaadin-tab>
 *   <vaadin-tab>Page 4</vaadin-tab>
 * </vaadin-tabs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|--------------------------------------
 * `back-button`     | Button for moving the scroll back
 * `tabs`            | The tabs container
 * `forward-button`  | Button for moving the scroll forward
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|--------------------------------------
 * `orientation`  | Tabs disposition, valid values are `horizontal` and `vertical`
 * `overflow`     | It's set to `start`, `end`, none or both.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property              |
 * :--------------------------------|
 * | `--vaadin-tabs-background`     |
 * | `--vaadin-tabs-border-color`   |
 * | `--vaadin-tabs-border-radius`  |
 * | `--vaadin-tabs-border-width`   |
 * | `--vaadin-tabs-font-size`      |
 * | `--vaadin-tabs-font-weight`    |
 * | `--vaadin-tabs-gap`            |
 * | `--vaadin-tabs-padding`        |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes TabsMixin
 * @mixes ThemableMixin
 */
class Tabs extends TabsMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-tabs';
  }

  static get styles() {
    return tabsStyles;
  }

  /** @protected */
  render() {
    return html`
      <div @click="${this._scrollBack}" part="back-button" aria-hidden="true"></div>

      <div id="scroll" part="tabs">
        <slot></slot>
      </div>

      <div @click="${this._scrollForward}" part="forward-button" aria-hidden="true"></div>
    `;
  }
}

defineCustomElement(Tabs);

export { Tabs };
