/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InternalSlotController } from '@vaadin/component-base/src/internal-slot-controller.js';

/**
 * A controller to manage the value button element.
 */
export class ButtonController extends InternalSlotController {
  constructor(host) {
    super(host, 'value', 'vaadin-select-value-button', (button, host) => {
      host._setFocusElement(button);
      host.ariaTarget = button;
      host.stateTarget = button;

      button.setAttribute('role', 'combobox');
      button.setAttribute('aria-haspopup', 'listbox');
    });
  }
}
