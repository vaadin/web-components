/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addListener } from '@vaadin/component-base/src/gestures.js';

/**
 * @polymerMixin
 */
export const SplitLayoutMixin = (superClass) =>
  class SplitLayoutMixin extends superClass {
    static get properties() {
      return {
        /**
         * The split layout's orientation. Possible values are: `horizontal|vertical`.
         * @type {string}
         */
        orientation: {
          type: String,
          reflectToAttribute: true,
          value: 'horizontal',
        },

        /** @private */
        _previousPrimaryPointerEvents: String,

        /** @private */
        _previousSecondaryPointerEvents: String,
      };
    }

    /** @protected */
    ready() {
      super.ready();

      this._processChildren();

      this.__observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          this._cleanupNodes(mutation.removedNodes);
        });

        this._processChildren();
      });

      this.__observer.observe(this, { childList: true });

      const splitter = this.$.splitter;
      addListener(splitter, 'track', this._onHandleTrack.bind(this));
      addListener(splitter, 'down', this._setPointerEventsNone.bind(this));
      addListener(splitter, 'up', this._restorePointerEvents.bind(this));
    }

    /** @private */
    _cleanupNodes(nodes) {
      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && !(node.parentElement instanceof this.constructor)) {
          const slot = node.getAttribute('slot');
          if (slot) {
            this[`_${slot}Child`] = null;
            node.removeAttribute('slot');
          }
        }
      });
    }

    /** @private */
    _processChildren() {
      const children = [...this.children];

      children.filter((child) => child.hasAttribute('slot')).forEach((child) => this._processChildWithSlot(child));

      children
        .filter((child) => !child.hasAttribute('slot'))
        .forEach((child, i) => this._processChildWithoutSlot(child, i));
    }

    /** @private */
    _processChildWithSlot(child) {
      const slot = child.getAttribute('slot');
      if (child.__autoSlotted) {
        this[`_${slot}Child`] = null;
        child.removeAttribute('slot');
      } else {
        this[`_${slot}Child`] = child;
      }
    }

    /** @private */
    _processChildWithoutSlot(child, idx) {
      let slotName;
      if (this._primaryChild || this._secondaryChild) {
        slotName = this._primaryChild ? 'secondary' : 'primary';
      } else {
        slotName = idx === 0 ? 'primary' : 'secondary';
      }

      this[`_${slotName}Child`] = child;
      child.setAttribute('slot', slotName);
      child.__autoSlotted = true;
    }

    /** @private */
    _setFlexBasis(element, flexBasis, containerSize) {
      flexBasis = Math.max(0, Math.min(flexBasis, containerSize));
      if (flexBasis === 0) {
        // Pure zero does not play well in Safari
        flexBasis = 0.000001;
      }
      element.style.flex = `1 1 ${flexBasis}px`;
    }

    /** @private */
    _setPointerEventsNone(event) {
      if (!this._primaryChild || !this._secondaryChild) {
        return;
      }
      this._previousPrimaryPointerEvents = this._primaryChild.style.pointerEvents;
      this._previousSecondaryPointerEvents = this._secondaryChild.style.pointerEvents;
      this._primaryChild.style.pointerEvents = 'none';
      this._secondaryChild.style.pointerEvents = 'none';

      event.preventDefault();
    }

    /** @private */
    _restorePointerEvents() {
      if (!this._primaryChild || !this._secondaryChild) {
        return;
      }
      this._primaryChild.style.pointerEvents = this._previousPrimaryPointerEvents;
      this._secondaryChild.style.pointerEvents = this._previousSecondaryPointerEvents;
    }

    /** @private */
    _onHandleTrack(event) {
      if (!this._primaryChild || !this._secondaryChild) {
        return;
      }

      const size = this.orientation === 'vertical' ? 'height' : 'width';
      if (event.detail.state === 'start') {
        this._startSize = {
          container: this.getBoundingClientRect()[size] - this.$.splitter.getBoundingClientRect()[size],
          primary: this._primaryChild.getBoundingClientRect()[size],
          secondary: this._secondaryChild.getBoundingClientRect()[size],
        };

        return;
      }

      const distance = this.orientation === 'vertical' ? event.detail.dy : event.detail.dx;
      const isRtl = this.orientation !== 'vertical' && this.__isRTL;
      const dirDistance = isRtl ? -distance : distance;

      this._setFlexBasis(this._primaryChild, this._startSize.primary + dirDistance, this._startSize.container);
      this._setFlexBasis(this._secondaryChild, this._startSize.secondary - dirDistance, this._startSize.container);

      if (event.detail.state === 'end') {
        this.dispatchEvent(new CustomEvent('splitter-dragend'));

        delete this._startSize;
      }
    }
  };
