/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-heading.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { DetailsMixin } from '@vaadin/details/src/vaadin-details-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixin } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class SummaryController extends SlotController {
  constructor(host) {
    super(host, 'summary', 'vaadin-accordion-heading', {
      useUniqueId: true,
      initializer: (node, host) => {
        host._setFocusElement(node);
        host.stateTarget = node;
      },
    });
  }
}

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
class AccordionPanel extends DetailsMixin(
  DelegateFocusMixin(DelegateStateMixin(ThemableMixin(ControllerMixin(PolymerElement)))),
) {
  static get is() {
    return 'vaadin-accordion-panel';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='content'] {
          display: none;
          overflow: hidden;
        }

        :host([opened]) [part='content'] {
          display: block;
          overflow: visible;
        }
      </style>

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
       * A content element.
       *
       * @protected
       */
      _collapsible: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['_openedOrCollapsibleChanged(opened, _collapsible)'];
  }

  static get delegateProps() {
    return ['disabled', 'opened'];
  }

  /** @protected */
  ready() {
    super.ready();

    // TODO: Generate unique IDs for a heading and a content panel when added to the slot,
    // and use them to set `aria-controls` and `aria-labelledby` attributes, respectively.

    this._collapsible = this.shadowRoot.querySelector('[part="content"]');
    this.addController(new SummaryController(this));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);

    this._tooltipController.setTarget(this._toggleElement);
    this._tooltipController.setPosition('bottom-start');

    // Wait for heading element render to complete
    afterNextRender(this, () => {
      this._toggleElement = this.focusElement.$.button;
    });
  }
}

customElements.define(AccordionPanel.is, AccordionPanel);

export { AccordionPanel };
