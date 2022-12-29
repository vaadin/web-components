/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-heading.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DelegateFocusMixin } from '@vaadin/component-base/src/delegate-focus-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { DetailsMixin } from '@vaadin/details/src/vaadin-details-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class SummaryController extends SlotObserveController {
  constructor(host) {
    super(host, 'summary', 'vaadin-accordion-heading', {
      initializer: (node, host) => {
        host._setFocusElement(node);
        host.stateTarget = node;
      },
    });
  }
}

class ContentController extends SlotObserveController {
  /**
   * Override method from `SlotController` to change
   * the ID prefix for the default slot content.
   *
   * @param {HTMLElement} host
   * @return {string}
   * @protected
   * @override
   */
  static generateId(host) {
    return super.generateId(host, 'content');
  }

  constructor(host) {
    super(host, '', null, { multiple: true });
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
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes DetailsMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes ThemableMixin
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

  static get delegateAttrs() {
    return ['theme'];
  }

  static get delegateProps() {
    return ['disabled', 'opened'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._initSummary();
    this._initContent();
    this._initTooltip();
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
  _initSummary() {
    this._summaryController = new SummaryController(this);
    this.addController(this._summaryController);

    // Wait for heading element render to complete
    afterNextRender(this, () => {
      this._toggleElement = this.focusElement.$.button;
    });
  }

  /** @private */
  _initContent() {
    this._contentController = new ContentController(this);
    this._contentController.addEventListener('slot-content-changed', (event) => {
      // Store nodes to toggle `aria-hidden` attribute
      const content = event.target.nodes || [];
      this._contentElements = content;

      // See https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
      const node = content[0];
      if (node) {
        node.setAttribute('role', 'region');
        node.setAttribute('aria-labelledby', this.focusElement.id);
      }

      if (node && node.parentNode === this && node.id) {
        this.focusElement.setAttribute('aria-controls', node.id);
      } else {
        this.focusElement.removeAttribute('aria-controls');
      }
    });
    this.addController(this._contentController);
  }

  /** @private */
  _initTooltip() {
    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);

    this._tooltipController.setTarget(this.focusElement);
    this._tooltipController.setPosition('bottom-start');
  }
}

customElements.define(AccordionPanel.is, AccordionPanel);

export { AccordionPanel };
