/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
      },
    );
  }
}
