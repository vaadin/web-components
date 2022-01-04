/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to create and initialize slotted `<input>` element.
 */
export class InputController extends SlotController {
  constructor(host, callback) {
    super(
      host,
      'input',
      () => document.createElement('input'),
      (host, node) => {
        if (host.value) {
          node.setAttribute('value', host.value);
        }
        if (host.type) {
          node.setAttribute('type', host.type);
        }

        // Ensure every instance has unique ID
        const uniqueId = (InputController._uniqueInputId = 1 + InputController._uniqueInputId || 0);
        host._inputId = `${host.localName}-${uniqueId}`;
        node.id = host._inputId;

        if (typeof callback == 'function') {
          callback(node);
        }
      }
    );
  }
}
