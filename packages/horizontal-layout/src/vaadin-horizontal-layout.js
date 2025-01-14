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

        :host(:not([has-middle-children])) ::slotted([last-start-child]) {
          margin-inline-end: auto;
        }

        ::slotted([slot='middle'][first-middle-child]) {
          margin-inline-start: auto;
        }

        ::slotted([slot='middle'][last-middle-child]) {
          margin-inline-end: auto;
        }

        :host(:not([has-middle-children])) ::slotted([slot='end'][first-end-child]) {
          margin-inline-start: auto;
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

    const startSlot = this.shadowRoot.querySelector('slot:not([name])');
    this.__startSlotObserver = new SlotObserver(startSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const firstEnd = removedNodes.find((el) => el.hasAttribute('last-start-child'));
        if (firstEnd) {
          firstEnd.removeAttribute('last-start-child');
        }
      }

      const children = currentNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);

      if (children.length) {
        children[children.length - 1].setAttribute('last-start-child', '');
      }

      this.toggleAttribute('has-start-children', children.length > 0);
    });

    const endSlot = this.shadowRoot.querySelector('[name="end"]');
    this.__endSlotObserver = new SlotObserver(endSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const firstEnd = removedNodes.find((el) => el.hasAttribute('first-end-child'));
        if (firstEnd) {
          firstEnd.removeAttribute('first-end-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[0].setAttribute('first-end-child', '');
      }

      this.toggleAttribute('has-end-children', currentNodes.length > 0);
    });

    const middleSlot = this.shadowRoot.querySelector('[name="middle"]');
    this.__middleSlotObserver = new SlotObserver(middleSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const firstCenter = removedNodes.find((el) => el.hasAttribute('first-middle-child'));
        if (firstCenter) {
          firstCenter.removeAttribute('first-middle-child');
        }

        const lastCenter = removedNodes.find((el) => el.hasAttribute('last-middle-child'));
        if (lastCenter) {
          lastCenter.removeAttribute('last-middle-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[0].setAttribute('first-middle-child', '');
        currentNodes[currentNodes.length - 1].setAttribute('last-middle-child', '');
      }

      this.toggleAttribute('has-middle-children', currentNodes.length > 0);
    });
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
