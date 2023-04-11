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
 * A controller to create and initialize slotted `<textarea>` element.
 */
export class TextAreaController extends SlotController {
  constructor(host, callback) {
    super(
      host,
      'textarea',
      () => document.createElement('textarea'),
      (host, node) => {
        const value = host.getAttribute('value');
        if (value) {
          node.value = value;
        }

        const name = host.getAttribute('name');
        if (name) {
          node.setAttribute('name', name);
        }

        // Ensure every instance has unique ID
        const uniqueId = (TextAreaController._uniqueTextAreaId = 1 + TextAreaController._uniqueTextAreaId || 0);
        host._textareaId = `${host.localName}-${uniqueId}`;
        node.id = host._textareaId;

        if (typeof callback == 'function') {
          callback(node);
        }
      },
    );
  }
}
