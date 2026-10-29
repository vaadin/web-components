/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller for the slot of a built-in toolbar button. It creates the
 * default button and sets its icon, tooltip and disabled state. A custom
 * component in the slot keeps its own content and state, and gets only the
 * click action.
 */
export class PdfViewerButtonController extends SlotController {
  /** @type {() => void} */
  #onClick;

  /**
   * The tooltip that the controller added to the default button.
   * @type {HTMLElement | null}
   */
  #tooltip = null;

  /**
   * The default button and the disabled state that the controller set on
   * it last, so that it sets the state only when it changes.
   * @type {{ button: HTMLElement | null, disabled: boolean }}
   */
  #applied = { button: null, disabled: false };

  /**
   * @param {HTMLElement} host
   * @param {string} slotName
   * @param {string} icon the icon of the default button
   * @param {() => void} onClick called on a click on the slotted component
   */
  constructor(host, slotName, icon, onClick) {
    super(host, slotName, 'vaadin-pdf-viewer-button');
    this.icon = icon;
    this.#onClick = onClick;
  }

  /**
   * Override method from `SlotController` to set the icon and the tooltip
   * on the default button.
   * @param {HTMLElement} button
   * @protected
   * @override
   */
  initNode(button) {
    // The Flow counterpart creates its own default button, so that it can return it.
    if (button._isDefault) {
      this.defaultNode = button;
    }

    button.addEventListener('click', this.#onClick);

    this.#tooltip = null;
    if (button === this.defaultNode) {
      if (!button.hasAttribute('icon')) {
        button.setAttribute('icon', this.icon);
      }
      if (!button.hasAttribute('theme')) {
        button.setAttribute('theme', 'tertiary icon');
      }
      if (!button.querySelector(':scope > [slot="tooltip"]')) {
        this.#tooltip = document.createElement('vaadin-tooltip');
        this.#tooltip.slot = 'tooltip';
        button.append(this.#tooltip);
      }
    }
    this.host.requestUpdate();
  }

  /**
   * Override method from `SlotController` to remove the click listener
   * from a component that left the slot.
   * @param {HTMLElement} button
   * @protected
   * @override
   */
  teardownNode(button) {
    button.removeEventListener('click', this.#onClick);
  }

  /**
   * Updates the disabled state and the tooltip text of the default button.
   * The disabled state is set only when it changes, so that a state that the
   * Flow counterpart sets on its own default button stays until then.
   * @param {boolean} disabled
   * @param {string} tooltipText
   */
  updateButton(disabled, tooltipText) {
    const button = this.node === this.defaultNode ? this.node : null;
    if (button && (button !== this.#applied.button || disabled !== this.#applied.disabled)) {
      button.disabled = disabled;
    }
    this.#applied = { button, disabled };
    if (this.#tooltip) {
      this.#tooltip.text = tooltipText;
    }
  }
}
