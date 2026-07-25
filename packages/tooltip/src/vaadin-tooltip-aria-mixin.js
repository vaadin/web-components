/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * A mixin providing linking of the tooltip content to the tooltip target
 * elements using the `aria-describedby` or `aria-labelledby` attribute.
 */
export const TooltipAriaMixin = (superClass) =>
  class TooltipAriaMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Element used to link with the ARIA attribute controlled by the
         * `ariaLinkMode` property. Supports array of multiple elements.
         * When not set, defaults to `target`.
         */
        ariaTarget: {
          type: Object,
        },

        /**
         * Controls which ARIA attribute is used to link the target element(s)
         * with the tooltip content. Supported values:
         *
         * - `aria-describedby` - links the tooltip as a description.
         * - `aria-labelledby` - links the tooltip as an accessible name.
         * - `none` - does not add any ARIA linking attribute.
         *
         * Defaults to `aria-describedby`.
         *
         * @attr {string} aria-link-mode
         */
        ariaLinkMode: {
          type: String,
          value: 'aria-describedby',
        },

        /**
         * Element used to link with the `aria-describedby`
         * attribute. When not set, defaults to `target`.
         * @protected
         */
        _effectiveAriaTarget: {
          type: Object,
          computed: '__computeAriaTarget(ariaTarget, target)',
        },
      };
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      const ariaTargetChanged = props.has('_effectiveAriaTarget');
      const ariaLinkModeChanged = props.has('ariaLinkMode');

      if (ariaTargetChanged || ariaLinkModeChanged) {
        const oldTarget = ariaTargetChanged ? props.get('_effectiveAriaTarget') : this._effectiveAriaTarget;
        const oldMode = ariaLinkModeChanged ? props.get('ariaLinkMode') : this.ariaLinkMode;
        this.#removeAriaReferences(oldTarget, oldMode);

        const newTarget = this._effectiveAriaTarget;
        const newMode = this.ariaLinkMode;
        this.#addAriaReferences(newTarget, newMode);
      }
    }

    #addAriaReferences(target, mode) {
      if (!target || !mode || mode === 'none') {
        return;
      }

      [target].flat().forEach((el) => {
        addValueToAttribute(el, mode, this._uniqueId);
      });
    }

    #removeAriaReferences(target, mode) {
      if (!target || !mode || mode === 'none') {
        return;
      }

      [target].flat().forEach((el) => {
        removeValueFromAttribute(el, mode, this._uniqueId);
      });
    }

    /** @private */
    __computeAriaTarget(ariaTarget, target) {
      const isElementNode = (el) => el?.nodeType === Node.ELEMENT_NODE;
      const isAriaTargetSet = Array.isArray(ariaTarget) ? ariaTarget.some(isElementNode) : ariaTarget;
      return ariaTarget === null || isAriaTargetSet ? ariaTarget : target;
    }
  };
