/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/scroller/src/vaadin-scroller.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { navigationLayoutStyles } from './styles/vaadin-navigation-layout-base-styles.js';

/**
 * `<vaadin-navigation-layout>` is a layout for navigation content, with optional
 * fixed areas at the start and end, and a scrollable area in between.
 *
 * ```html
 * <vaadin-navigation-layout>
 *   <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
 *   <vaadin-side-nav>...</vaadin-side-nav>
 *   <div slot="end">Footer</div>
 * </vaadin-navigation-layout>
 * ```
 *
 * When the `collapsed` attribute is set, the layout sets the
 * `--vaadin-navigation-layout-collapsed` custom property to `1` (otherwise `0`),
 * which descendants can use in container style queries:
 *
 * ```css
 * @container style(--vaadin-navigation-layout-collapsed: 1) {
 *   .label {
 *     display: none;
 *   }
 * }
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------
 * `start`   | The container wrapping the `start` slot
 * `content` | The scroller wrapping the default slot
 * `end`     | The container wrapping the `end` slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|------------
 * `collapsed` | Set when the layout is collapsed
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                     |
 * :---------------------------------------|
 * `--vaadin-navigation-layout-collapsed`  |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-navigation-layout
 * @extends HTMLElement
 */
class NavigationLayout extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-navigation-layout';
  }

  static get styles() {
    return navigationLayoutStyles;
  }

  static get properties() {
    return {
      /**
       * When true, the layout is collapsed.
       */
      collapsed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  constructor() {
    super();

    this.addEventListener('navigation-layout-toggle-click', (e) => {
      // Only toggle the closest layout when layouts are nested
      e.stopPropagation();
      this.collapsed = !this.collapsed;
    });
  }

  /** @protected */
  render() {
    return html`
      <div part="start">
        <slot name="start"></slot>
      </div>
      <vaadin-scroller part="content">
        <slot></slot>
      </vaadin-scroller>
      <div part="end">
        <slot name="end"></slot>
      </div>
    `;
  }
}

defineCustomElement(NavigationLayout);

export { NavigationLayout };
