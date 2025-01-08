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

        ::slotted([slot='start'][last-start-child]) {
          margin-inline-end: auto;
        }

        :host(:not([has-start-children])) ::slotted([slot='center'][first-center-child]) {
          margin-inline-start: auto;
        }

        :host(:not([has-end-children])) ::slotted([slot='center'][last-center-child]) {
          margin-inline-end: auto;
        }

        ::slotted([slot='end'][first-end-child]) {
          margin-inline-start: auto;
        }
      </style>

      <slot name="start"></slot>

      <slot name="center"></slot>

      <slot name="end"></slot>
    `;
  }

  static get is() {
    return 'vaadin-horizontal-layout';
  }

  /** @protected */
  ready() {
    super.ready();

    const startSlot = this.shadowRoot.querySelector('[name="start"]');
    this.__endSlotObserver = new SlotObserver(startSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const firstEnd = removedNodes.find((el) => el.hasAttribute('last-start-child'));
        if (firstEnd) {
          firstEnd.removeAttribute('last-start-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[currentNodes.length - 1].setAttribute('last-start-child', '');
      }

      this.toggleAttribute('has-start-children', currentNodes.length > 0);
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

    const centerSlot = this.shadowRoot.querySelector('[name="center"]');
    this.__endSlotObserver = new SlotObserver(centerSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const firstCenter = removedNodes.find((el) => el.hasAttribute('first-center-child'));
        if (firstCenter) {
          firstCenter.removeAttribute('first-center-child');
        }

        const lastCenter = removedNodes.find((el) => el.hasAttribute('last-center-child'));
        if (lastCenter) {
          lastCenter.removeAttribute('last-center-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[0].setAttribute('first-center-child', '');
        currentNodes[currentNodes.length - 1].setAttribute('last-center-child', '');
      }
    });
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
