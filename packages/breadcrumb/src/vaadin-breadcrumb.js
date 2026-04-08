/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a web component for displaying breadcrumb navigation.
 *
 * ```html
 * <vaadin-breadcrumb>Example</vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `focused`    | Set when the element is focused
 * `focus-ring` | Set when the element is keyboard focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumb
 * @extends HTMLElement
 * @mixes BreadcrumbMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Breadcrumb extends BreadcrumbMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get styles() {
    return breadcrumbStyles;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-breadcrumb-container">
        <span part="label">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
