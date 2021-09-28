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

        // TODO: find a better approach to initialize mixins. We do it here because we can no longer
        // rely on `ready()` as we add controller after `ready()` for all mixins has been called.

        // InputMixin
        host._setInputElement && host._setInputElement(node);

        // DelegateFocusMixin
        host._setFocusElement && host._setFocusElement(node);

        // DelegateStateMixin
        host._setStateTarget && host._setStateTarget(node);

        // FieldAriaMixin
        host._setAriaTarget && host._setAriaTarget(node);
      }
    ]);
  }
}
