/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```
 * <vaadin-horizontal-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-horizontal-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-horizontal-layout>` supports the following theme variations:
 *
 * Theme variation | Description
 * ---|---
 * `theme="margin"` | Applies the default amount of CSS margin for the host element (specified by the theme)
 * `theme="padding"` | Applies the default amount of CSS padding for the host element (specified by the theme)
 * `theme="spacing"` | Applies the default amount of CSS margin between items (specified by the theme)
 * `theme="wrap"` | Items wrap to the next row when they exceed the layout width
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class HorizontalLayout extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          box-sizing: border-box;
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Theme variations */
        :host([theme~='margin']) {
          margin: 1em;
        }

        :host([theme~='padding']) {
          padding: 1em;
        }

        :host([theme~='spacing']) {
          gap: 1em;
        }

        slot[name='middle']:before {
          content: '';
          display: block;
          margin-inline-start: auto;
        }

        :host([theme~='spacing']) slot[name='middle']:before {
          margin-inline-end: -1em;
        }

        slot[name='end']:before {
          content: '';
          display: block;
          margin-inline-start: auto;
        }

        :host([theme~='spacing']) slot[name='end']:before {
          margin-inline-end: -1em;
        }

        :host([has-end-children]) {
          justify-content: flex-end;
        }
      </style>

      <slot></slot>

      <slot name="middle"></slot>

      <slot name="end"></slot>
    `;
  }

  static get is() {
    return 'vaadin-horizontal-layout';
  }

  /** @protected */
  ready() {
    super.ready();

    const endSlot = this.shadowRoot.querySelector('[name="end"]');
    this.__endSlotObserver = new SlotObserver(endSlot, ({ currentNodes }) => {
      this.toggleAttribute('has-end-children', currentNodes.length > 0);
    });
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
