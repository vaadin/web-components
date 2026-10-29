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
 * default button and sets its icon and tooltip. A custom component in the
 * slot keeps its own content, but gets the click action and the disabled
 * state too.
 */
export class PdfViewerButtonController extends SlotController {
  /**
   * The tooltip that the controller added to the default button.
   * @type {HTMLElement | null}
   */
  #tooltip = null;

  /**
   * @param {HTMLElement} host
   * @param {string} slotName
   * @param {string} icon the icon of the default button
   * @param {() => void} onClick called on a click on the slotted component
   */
  constructor(host, slotName, icon, onClick) {
    super(host, slotName, 'vaadin-pdf-viewer-button');
    this.icon = icon;

    host.addEventListener('click', (event) => {
      if (this.node && event.composedPath().includes(this.node)) {
        onClick();
      }
    });
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
   * Updates the disabled state of the slotted component, and the text of
   * the tooltip of the default button.
   * @param {boolean} disabled
   * @param {string} tooltipText
   */
  updateButton(disabled, tooltipText) {
    if (this.node) {
      this.node.disabled = disabled;
    }
    if (this.#tooltip) {
      this.#tooltip.text = tooltipText;
    }
  }
}
