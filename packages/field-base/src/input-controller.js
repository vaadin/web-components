/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

export class InputController extends SlotController {
  constructor(host) {
    super(host, [
      'input',
      () => document.createElement('input'),
      (host, node) => {
        const value = host.getAttribute('value');
        if (value) {
          node.setAttribute('value', value);
        }
        const name = host.getAttribute('name');
        if (name) {
          node.setAttribute('name', name);
        }
        if (host.type) {
          node.setAttribute('type', host.type);
        }

        // Ensure every instance has unique ID
        const uniqueId = (InputController._uniqueInputId = 1 + InputController._uniqueInputId || 0);
        host._inputId = `${host.localName}-${uniqueId}`;
        node.id = host._inputId;

        // TODO: find a better approach to initialize mixins.
        // Copying this to every component seems redundant.

        // InputMixin
        host.inputElement = node;

        // DelegateFocusMixin
        host._setFocusElement && host._setFocusElement(node);

        // DelegateStateMixin
        host.stateTarget = node;

        // FieldAriaMixin
        host.ariaTarget = node;
      }
    ]);
  }
}
