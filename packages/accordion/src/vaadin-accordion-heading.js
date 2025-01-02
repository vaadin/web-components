/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { accordionHeading } from './vaadin-accordion-heading-styles.js';

registerStyles('vaadin-accordion-heading', accordionHeading, { moduleId: 'vaadin-accordion-heading-styles' });

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ActiveMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 */
class AccordionHeading extends ActiveMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-accordion-heading';
  }

  static get template() {
    return html`
      <button id="button" part="content" disabled$="[[disabled]]" aria-expanded$="[[__updateAriaExpanded(opened)]]">
        <span part="toggle" aria-hidden="true"></span>
        <slot></slot>
      </button>
    `;
  }

  static get properties() {
    return {
      /**
       * When true, the element is opened.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },
    };
  }

  /**
   * @param {DocumentFragment} dom
   * @return {null}
   * @protected
   * @override
   */
  _attachDom(dom) {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.appendChild(dom);
    return root;
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

  /** @private */
  __updateAriaExpanded(opened) {
    return opened ? 'true' : 'false';
  }
}

defineCustomElement(AccordionHeading);

export { AccordionHeading };
