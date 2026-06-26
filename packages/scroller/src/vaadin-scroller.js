/**
 * @license
 * Copyright (c) 2020 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { scrollerStyles } from './styles/vaadin-scroller-base-styles.js';
import { ScrollerMixin } from './vaadin-scroller-mixin.js';

/**
 * `<vaadin-scroller>` provides a simple way to enable scrolling when its content is overflowing.
 *
 * ```html
 * <vaadin-scroller>
 *   <div>Content</div>
 * </vaadin-scroller>
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 * `overflow`   | Set to `top`, `bottom`, `start`, `end`, all of them, or none.
 *
 * ### Built-in Theme Variants
 *
 * `<vaadin-scroller>` supports the following theme variants:
 *
 * Theme variant                            | Description
 * -----------------------------------------|---------------
 * `theme="overflow-indicators"`            | Shows visual indicators at the top and bottom when the content is scrolled
 * `theme="overflow-indicator-top"`         | Shows the visual indicator at the top when the content is scrolled
 * `theme="overflow-indicator-top-bottom"`  | Shows the visual indicator at the bottom when the content is scrolled
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                            |
 * :----------------------------------------------|
 * `--vaadin-scroller-overflow-indicator-color`   |
 * `--vaadin-scroller-overflow-indicator-height`  |
 * `--vaadin-scroller-padding-block`              |
 * `--vaadin-scroller-padding-inline`             |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-scroller
 * @extends HTMLElement
 */
class Scroller extends ScrollerMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-scroller';
  }

  static get styles() {
    return scrollerStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @protected */
  ready() {
    super.ready();

    this.__overflowController = new OverflowController(this);
    this.addController(this.__overflowController);
  }
}

defineCustomElement(Scroller);

export { Scroller };
