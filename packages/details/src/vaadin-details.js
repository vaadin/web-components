/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-details-summary.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CollapsibleMixin } from './collapsible-mixin.js';
import { SummaryController } from './summary-controller.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes CollapsibleMixin
 * @mixes ControllerMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Details extends CollapsibleMixin(
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
        }

        :host([opened]) [part='content'] {
          display: block;
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

  static get delegateAttrs() {
    return ['theme'];
  }

  static get delegateProps() {
    return ['disabled', 'opened'];
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
}

customElements.define(Details.is, Details);

export { Details };
