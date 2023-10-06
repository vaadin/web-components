/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-heading.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { CollapsibleMixin } from '@vaadin/details/src/collapsible-mixin.js';
import { SummaryController } from '@vaadin/details/src/summary-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { accordionPanel } from './vaadin-accordion-panel-styles.js';

registerStyles('vaadin-accordion-panel', accordionPanel, { moduleId: 'vaadin-accordion-panel-styles' });

/**
 * The accordion panel element.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `content`        | The wrapper for the collapsible panel content.
 *
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes CollapsibleMixin
 * @mixes ControllerMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes ThemableMixin
 */
class AccordionPanel extends CollapsibleMixin(
  DelegateFocusMixin(DelegateStateMixin(ThemableMixin(ControllerMixin(PolymerElement)))),
) {
  static get is() {
    return 'vaadin-accordion-panel';
  }

  static get template() {
    return html`
      <slot name="summary"></slot>

      <div part="content">
        <slot></slot>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * A text that is displayed in the heading, if no
       * element is assigned to the `summary` slot.
       */
      summary: {
        type: String,
        observer: '_summaryChanged',
      },
    };
  }

  static get observers() {
    return ['__updateAriaAttributes(focusElement, _contentElements)'];
  }

  static get delegateAttrs() {
    return ['theme'];
  }

  static get delegateProps() {
    return ['disabled', 'opened'];
  }

  constructor() {
    super();

    this._summaryController = new SummaryController(this, 'vaadin-accordion-heading');
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
  __updateAriaAttributes(focusElement, contentElements) {
    if (focusElement && contentElements) {
      const node = contentElements[0];

      if (node) {
        node.setAttribute('role', 'region');
        node.setAttribute('aria-labelledby', focusElement.id);
      }

      if (node && node.id) {
        focusElement.setAttribute('aria-controls', node.id);
      } else {
        focusElement.removeAttribute('aria-controls');
      }
    }
  }
}

defineCustomElement(AccordionPanel);

export { AccordionPanel };
