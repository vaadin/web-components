/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';

/**
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const HorizontalLayoutMixin = (superClass) =>
  class extends ResizeMixin(superClass) {
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

        this.__updateRowState();
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

        this.__updateRowState();
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

        this.__updateRowState();
      });
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this.__updateRowState();
    }

    /** @private */
    __updateRowState() {
      const children = this.children;
      let previousOffset = 0;
      for (const child of children) {
        if (child.offsetTop > previousOffset) {
          previousOffset = child.offsetTop;
          child.setAttribute('first-in-row', '');
        } else {
          child.removeAttribute('first-in-row');
        }
      }
    }
  };
