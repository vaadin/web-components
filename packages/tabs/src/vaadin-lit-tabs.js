/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-tab.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TabsMixin } from './vaadin-tabs-mixin.js';
import { tabsStyles } from './vaadin-tabs-styles.js';

/**
 * `<vaadin-tabs>` is a Web Component for organizing and grouping content into sections.
 *
 * ```
 *   <vaadin-tabs selected="4">
 *     <vaadin-tab>Page 1</vaadin-tab>
 *     <vaadin-tab>Page 2</vaadin-tab>
 *     <vaadin-tab>Page 3</vaadin-tab>
 *     <vaadin-tab>Page 4</vaadin-tab>
 *   </vaadin-tabs>
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
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `orientation` | Tabs disposition, valid values are `horizontal` and `vertical`. | :host
 * `overflow` | It's set to `start`, `end`, none or both. | :host
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
class Tabs extends TabsMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-tabs';
  }

  static get styles() {
    return [tabsStyles];
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
