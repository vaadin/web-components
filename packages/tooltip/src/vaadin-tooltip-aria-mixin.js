/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addAriaElementReference, removeAriaElementReference } from '@vaadin/a11y-base/src/aria-element-reference.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * A mixin providing linking of the tooltip content to the tooltip target
 * elements using the `aria-describedby` or `aria-labelledby` attribute.
 *
 * Targets in the same root as the tooltip are linked by the content element
 * ID. ID references only resolve within a single tree scope, so targets in
 * other roots are linked with ARIA element references instead.
 */
export const TooltipAriaMixin = (superClass) =>
  class TooltipAriaMixinClass extends superClass {
    #ariaReferences = [];

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
    connectedCallback() {
      super.connectedCallback();
      this.#addAriaReferences();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.#removeAriaReferences();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('_effectiveAriaTarget') || props.has('ariaLinkMode')) {
        this.#updateAriaReferences();
      }
    }

    #addAriaReferences() {
      const mode = this.ariaLinkMode;
      const targets = this._effectiveAriaTarget;
      const contentNode = this.__contentNode;
      if (!contentNode || !targets || !mode || mode === 'none') {
        return;
      }

      [targets].flat().forEach((target) => {
        const byReference = target.getRootNode() !== this.getRootNode();
        if (byReference) {
          addAriaElementReference(target, mode, contentNode);
        } else {
          addValueToAttribute(target, mode, contentNode.id);
        }

        this.#ariaReferences.push({ target, mode, byReference });
      });
    }

    #removeAriaReferences() {
      const contentNode = this.__contentNode;

      this.#ariaReferences.forEach(({ target, mode, byReference }) => {
        if (byReference) {
          removeAriaElementReference(target, mode, contentNode);
        } else {
          removeValueFromAttribute(target, mode, contentNode.id);
        }
      });
      this.#ariaReferences = [];
    }

    #updateAriaReferences() {
      this.#removeAriaReferences();
      this.#addAriaReferences();
    }

    /** @private */
    __computeAriaTarget(ariaTarget, target) {
      const isElementNode = (el) => el?.nodeType === Node.ELEMENT_NODE;
      const isAriaTargetSet = Array.isArray(ariaTarget) ? ariaTarget.some(isElementNode) : ariaTarget;
      return ariaTarget === null || isAriaTargetSet ? ariaTarget : target;
    }
  };
