/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { horizontalLayoutStyles } from './vaadin-horizontal-layout-styles.js';

registerStyles('vaadin-horizontal-layout', horizontalLayoutStyles, { moduleId: 'vaadin-horizontal-layout-styles' });

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
        const last = removedNodes.find(
          (node) => node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('last-start-child'),
        );
        if (last) {
          last.removeAttribute('last-start-child');
        }
      }

      const children = currentNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);

      if (children.length) {
        children[children.length - 1].setAttribute('last-start-child', '');
      }

      const nodes = currentNodes.filter((node) => !isEmptyTextNode(node));
      this.toggleAttribute('has-start', nodes.length > 0);
    });

    const endSlot = this.shadowRoot.querySelector('[name="end"]');
    this.__endSlotObserver = new SlotObserver(endSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const first = removedNodes.find((el) => el.hasAttribute('first-end-child'));
        if (first) {
          first.removeAttribute('first-end-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[0].setAttribute('first-end-child', '');
      }

      this.toggleAttribute('has-end', currentNodes.length > 0);
    });

    const middleSlot = this.shadowRoot.querySelector('[name="middle"]');
    this.__middleSlotObserver = new SlotObserver(middleSlot, ({ currentNodes, removedNodes }) => {
      if (removedNodes.length) {
        const first = removedNodes.find((el) => el.hasAttribute('first-middle-child'));
        if (first) {
          first.removeAttribute('first-middle-child');
        }

        const last = removedNodes.find((el) => el.hasAttribute('last-middle-child'));
        if (last) {
          last.removeAttribute('last-middle-child');
        }
      }

      if (currentNodes.length) {
        currentNodes[0].setAttribute('first-middle-child', '');
        currentNodes[currentNodes.length - 1].setAttribute('last-middle-child', '');
      }

      this.toggleAttribute('has-middle', currentNodes.length > 0);
    });
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
