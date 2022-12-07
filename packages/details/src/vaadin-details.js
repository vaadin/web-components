/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-details-summary.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixin } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DetailsMixin } from './vaadin-details-mixin.js';

class SummaryController extends SlotController {
  constructor(host) {
    super(host, 'summary', 'vaadin-details-summary', {
      useUniqueId: true,
      initializer: (node, host) => {
        host._toggleElement = node;
        host._setFocusElement(node);
        host.stateTarget = node;
      },
    });
  }
}

/**
 * `<vaadin-details>` is a Web Component which the creates an
 * expandable panel similar to `<details>` HTML element.
 *
 * ```
 * <vaadin-details>
 *   <vaadin-details-summary slot="summary">Expandable Details</vaadin-details-summary>
 *   <div>
 *     Toggle using mouse, Enter and Space keys.
 *   </div>
 * </vaadin-details>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `summary`        | The element used to open and close collapsible content.
 * `toggle`         | The element used as indicator, can represent an icon.
 * `summary-content`| The wrapper for the slotted summary content.
 * `content`        | The wrapper for the collapsible details content.
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
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Details extends DetailsMixin(
  DelegateStateMixin(DelegateFocusMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))))),
) {
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

  static get is() {
    return 'vaadin-details';
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

    // TODO: Generate unique IDs for a summary and a content panel when added to the slot,
    // and use them to set `aria-controls` and `aria-labelledby` attributes, respectively.

    this._collapsible = this.shadowRoot.querySelector('[part="content"]');

    this.addController(new SummaryController(this));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);

    this._tooltipController.setTarget(this._toggleElement);
    this._tooltipController.setPosition('bottom-start');
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
}

customElements.define(Details.is, Details);

export { Details };
