/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
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
      <style>
        :host {
          display: block;
          outline: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        :host([hidden]) {
          display: none !important;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: inherit;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: initial;
          color: inherit;
          border: initial;
          outline: none;
          font: inherit;
          text-align: inherit;
        }
      </style>
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

customElements.define(AccordionHeading.is, AccordionHeading);

export { AccordionHeading };
