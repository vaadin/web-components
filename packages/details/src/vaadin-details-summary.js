/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { detailsSummary } from './styles/vaadin-details-summary-base-styles.js';

/**
 * The details summary element.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name  | Description
 * -----------|-------------------
 * `toggle`   | The icon element
 * `content`  | The content wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `active`     | Set when the element is pressed down, either with mouse, touch or the keyboard.
 * `opened`     | Set when the element is expanded and related collapsible content is visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                        |
 * :------------------------------------------|
 * | `--vaadin-details-summary-background`    |
 * | `--vaadin-details-summary-border-color`  |
 * | `--vaadin-details-summary-border-radius` |
 * | `--vaadin-details-summary-border-width`  |
 * | `--vaadin-details-summary-font-size`     |
 * | `--vaadin-details-summary-font-weight`   |
 * | `--vaadin-details-summary-gap`           |
 * | `--vaadin-details-summary-height`        |
 * | `--vaadin-details-summary-padding`       |
 * | `--vaadin-details-summary-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 */
class DetailsSummary extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-details-summary';
  }

  static get styles() {
    return detailsSummary();
  }

  static get properties() {
    return {
      /**
       * When true, the element is opened.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <span part="toggle" aria-hidden="true"></span>
      <div part="content"><slot></slot></div>
    `;
  }
}

defineCustomElement(DetailsSummary);

export { DetailsSummary };
