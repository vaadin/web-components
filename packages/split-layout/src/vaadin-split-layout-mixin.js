/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';

// Step in pixels used for resizing with the arrow keys.
const ARROW_STEP = 16;
// Fraction of the available size used for resizing with the Page Up / Page Down keys.
const PAGE_STEP = 0.1;

export const SplitLayoutMixin = (superClass) =>
  class SplitLayoutMixin extends superClass {
    static get properties() {
      return {
        /**
         * The split layout's orientation. Possible values are: `horizontal|vertical`.
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

        /**
         * The primary content element size as a percentage.
         * @private
         */
        __valueNow: {
          type: Number,
        },
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
        this.__updateValueNow();
      });

      this.__observer.observe(this, { childList: true });

      const splitter = this.$.splitter;
      addListener(splitter, 'track', this._onHandleTrack.bind(this));
      addListener(splitter, 'down', this._setPointerEventsNone.bind(this));
      addListener(splitter, 'up', this._restorePointerEvents.bind(this));
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('orientation')) {
        this.__updateValueNow();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.__dragEndDebouncer) {
        this.__dragEndDebouncer.cancel();
      }
    }

    /**
     * Override method inherited from `FocusMixin`
     * to only handle events from the splitter.
     *
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(event) {
      return event.composedPath()[0] === this.$.splitter;
    }

    /**
     * Override method inherited from `FocusMixin`
     * to only handle events from the splitter.
     *
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      return event.relatedTarget !== this.$.splitter;
    }

    /**
     * Override method inherited from `KeyboardMixin` to resize the layout when
     * the splitter is focused and an arrow, page or home/end key is pressed.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (event.composedPath()[0] !== this.$.splitter || !this._primaryChild || !this._secondaryChild) {
        return;
      }

      const vertical = this.orientation === 'vertical';
      const { container, primary } = this.__getSizes();
      const pageStep = container * PAGE_STEP;
      let newPrimary = primary;

      switch (event.key) {
        case 'ArrowRight':
          if (vertical) {
            return;
          }
          newPrimary += this.__isRTL ? -ARROW_STEP : ARROW_STEP;
          break;
        case 'ArrowLeft':
          if (vertical) {
            return;
          }
          newPrimary += this.__isRTL ? ARROW_STEP : -ARROW_STEP;
          break;
        case 'ArrowDown':
          if (!vertical) {
            return;
          }
          newPrimary += ARROW_STEP;
          break;
        case 'ArrowUp':
          if (!vertical) {
            return;
          }
          newPrimary -= ARROW_STEP;
          break;
        case 'PageUp':
          newPrimary += pageStep;
          break;
        case 'PageDown':
          newPrimary -= pageStep;
          break;
        case 'Home':
          newPrimary = 0;
          break;
        case 'End':
          newPrimary = container;
          break;
        default:
          return;
      }

      event.preventDefault();
      event.stopPropagation();

      this._setFlexBasis(this._primaryChild, newPrimary, container);
      this._setFlexBasis(this._secondaryChild, container - newPrimary, container);
      this.__updateValueNow();

      this.__dragEndDebouncer = Debouncer.debounce(this.__dragEndDebouncer, timeOut.after(200), () => {
        this.dispatchEvent(new CustomEvent('splitter-dragend'));
      });
    }

    /**
     * Returns the available container size and the current content element sizes
     * in pixels, measured along the resize axis. Sizes are read from the rendered
     * layout on every call so that CSS min/max limits are always respected.
     *
     * @return {{ container: number, primary: number, secondary: number }}
     * @private
     */
    __getSizes() {
      const size = this.orientation === 'vertical' ? 'height' : 'width';
      return {
        container: this.getBoundingClientRect()[size] - this.$.splitter.getBoundingClientRect()[size],
        primary: this._primaryChild.getBoundingClientRect()[size],
        secondary: this._secondaryChild.getBoundingClientRect()[size],
      };
    }

    /** @private */
    __updateValueNow() {
      if (!this._primaryChild || !this._secondaryChild) {
        return;
      }
      const { container, primary } = this.__getSizes();
      this.__valueNow = container > 0 ? Math.round((primary / container) * 100) : 0;
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

      if (event.detail.state === 'start') {
        this._startSize = this.__getSizes();

        return;
      }

      const distance = this.orientation === 'vertical' ? event.detail.dy : event.detail.dx;
      const isRtl = this.orientation !== 'vertical' && this.__isRTL;
      const dirDistance = isRtl ? -distance : distance;

      this._setFlexBasis(this._primaryChild, this._startSize.primary + dirDistance, this._startSize.container);
      this._setFlexBasis(this._secondaryChild, this._startSize.secondary - dirDistance, this._startSize.container);
      this.__updateValueNow();

      if (event.detail.state === 'end') {
        this.dispatchEvent(new CustomEvent('splitter-dragend'));

        delete this._startSize;
      }
    }
  };
