/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { CollapsibleMixin } from './collapsible-mixin.js';
import { SummaryController } from './summary-controller.js';

/**
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes CollapsibleMixin
 */
export const DetailsBaseMixin = (superClass) =>
  class DetailsBaseMixin extends CollapsibleMixin(DelegateFocusMixin(DelegateStateMixin(superClass))) {
    static get properties() {
      return {
        /**
         * A text that is displayed in the summary, if no
         * element is assigned to the `summary` slot.
         */
        summary: {
          type: String,
          observer: '_summaryChanged',
        },
      };
    }

    static get observers() {
      return ['__updateAriaControls(focusElement, _contentElements)', '__updateAriaExpanded(focusElement, opened)'];
    }

    static get delegateProps() {
      return ['disabled', 'opened', '_theme'];
    }

    constructor() {
      super();

      this._summaryController = new SummaryController(this, 'vaadin-details-summary');
      this._summaryController.addEventListener('slot-content-changed', (event) => {
        const { node } = event.target;

        this._setFocusElement(node);
        this.stateTarget = node;

        this._tooltipController.setTarget(node);
      });

      this._tooltipController = new TooltipController(this);
      this._tooltipController.setPosition('bottom-start');
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this._summaryController);
      this.addController(this._tooltipController);
    }

    /**
     * Override method from `DelegateStateMixin` to set delegate `theme`
     * using attribute instead of property (needed for the Lit version).
     * @protected
     * @override
     */
    _delegateProperty(name, value) {
      if (!this.stateTarget) {
        return;
      }

      if (name === '_theme') {
        this._delegateAttribute('theme', value);
        return;
      }

      super._delegateProperty(name, value);
    }

    /**
     * Override method inherited from `DisabledMixin`
     * to not set `aria-disabled` on the host element.
     *
     * @protected
     * @override
     */
    _setAriaDisabled() {
      // The `aria-disabled` is set on the details summary.
    }

    /** @private */
    _summaryChanged(summary) {
      this._summaryController.setSummary(summary);
    }

    /** @private */
    __updateAriaControls(summary, contentElements) {
      if (summary && contentElements) {
        const node = contentElements[0];

        if (node && node.id) {
          summary.setAttribute('aria-controls', node.id);
        } else {
          summary.removeAttribute('aria-controls');
        }
      }
    }

    /** @private */
    __updateAriaExpanded(focusElement, opened) {
      if (focusElement) {
        focusElement.setAttribute('aria-expanded', opened ? 'true' : 'false');
      }
    }
  };
