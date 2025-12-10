/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { accordionHeading } from './styles/vaadin-accordion-heading-base-styles.js';

/**
 * The accordion heading element.
 *
 * `vaadin-accordion-heading` is the element for the headings in the accordion.
 * As recommended by the WAI ARIA Best Practices, each heading needs to wrap a
 * `<button>`. This element puts that button in the Shadow DOM, as it is more
 * convenient to use and doesn't make styling of the heading more problematic.
 *
 * The WAI ARIA Best Practices also recommend setting `aria-level` depending
 * on what level the headings are. It is hard to determine the level of a heading
 * algorithmically, and setting it is not strictly required to have an accessible
 * accordion. To keep things easier to use, this element does not set `aria-level`
 * attribute but leaves that to the developer creating an accordion.
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
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * | `--vaadin-accordion-heading-background`    |
 * | `--vaadin-accordion-heading-border-color`  |
 * | `--vaadin-accordion-heading-border-radius` |
 * | `--vaadin-accordion-heading-border-width`  |
 * | `--vaadin-accordion-heading-font-size`     |
 * | `--vaadin-accordion-heading-font-weight`   |
 * | `--vaadin-accordion-heading-gap`           |
 * | `--vaadin-accordion-heading-height`        |
 * | `--vaadin-accordion-heading-padding`       |
 * | `--vaadin-accordion-heading-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ActiveMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 */
class AccordionHeading extends ActiveMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-accordion-heading';
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }

  static get styles() {
    return accordionHeading;
  }

  static get properties() {
    return {
      /**
       * When true, the element is opened.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: true,
        sync: true,
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <button id="button" part="content" ?disabled="${this.disabled}" aria-expanded="${this.opened ? 'true' : 'false'}">
        <span part="toggle" aria-hidden="true"></span>
        <slot></slot>
      </button>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "heading".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'heading');
    }
  }
}

defineCustomElement(AccordionHeading);

export { AccordionHeading };
