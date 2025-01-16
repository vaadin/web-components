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
          this.__clearAttribute(removedNodes, 'last-start-child');
          this.__clearAttribute(removedNodes, 'first-in-row');
        }

        const children = currentNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);

        children.forEach((child, idx) => {
          if (idx === children.length - 1) {
            child.setAttribute('last-start-child', '');
          } else if (child.hasAttribute('last-start-child')) {
            child.removeAttribute('last-start-child');
          }
        });

        const nodes = currentNodes.filter((node) => !isEmptyTextNode(node));
        this.toggleAttribute('has-start', nodes.length > 0);

        this.__updateRowState();
      });

      const endSlot = this.shadowRoot.querySelector('[name="end"]');
      this.__endSlotObserver = new SlotObserver(endSlot, ({ currentNodes, removedNodes }) => {
        if (removedNodes.length) {
          this.__clearAttribute(removedNodes, 'first-end-child');
          this.__clearAttribute(removedNodes, 'first-in-row');
        }

        currentNodes.forEach((child, idx) => {
          if (idx === 0) {
            child.setAttribute('first-end-child', '');
          } else if (child.hasAttribute('first-end-child')) {
            child.removeAttribute('first-end-child');
          }
        });

        this.toggleAttribute('has-end', currentNodes.length > 0);

        this.__updateRowState();
      });

      const middleSlot = this.shadowRoot.querySelector('[name="middle"]');
      this.__middleSlotObserver = new SlotObserver(middleSlot, ({ currentNodes, removedNodes }) => {
        if (removedNodes.length) {
          this.__clearAttribute(removedNodes, 'first-middle-child');
          this.__clearAttribute(removedNodes, 'last-middle-child');
          this.__clearAttribute(removedNodes, 'first-in-row');
        }

        currentNodes.forEach((child, idx) => {
          if (idx === 0) {
            child.setAttribute('first-middle-child', '');
          } else if (child.hasAttribute('first-middle-child')) {
            child.removeAttribute('first-middle-child');
          }

          if (idx === currentNodes.length - 1) {
            child.setAttribute('last-middle-child', '');
          } else if (child.hasAttribute('last-middle-child')) {
            child.removeAttribute('last-middle-child');
          }
        });

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
    __clearAttribute(nodes, attr) {
      const el = nodes.find((node) => node.nodeType === Node.ELEMENT_NODE && node.hasAttribute(attr));
      if (el) {
        el.removeAttribute(attr);
      }
    }

    /** @private */
    __updateRowState() {
      let offset = 0;
      for (const child of this.children) {
        if (child.offsetTop > offset) {
          offset = child.offsetTop;
          child.setAttribute('first-in-row', '');
        } else {
          child.removeAttribute('first-in-row');
        }
      }
    }
  };
