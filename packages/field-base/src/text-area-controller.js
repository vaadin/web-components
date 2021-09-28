import { SlotController } from './slot-controller.js';

export class TextAreaController extends SlotController {
  constructor(host) {
    super(host, [
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
        const uniqueId = (TextAreaController._uniqueTextAreaId = 1 + TextAreaController._uniqueInputId || 0);
        host._textareaId = `${host.localName}-${uniqueId}`;
        node.id = host._textareaId;

        // TODO: find a better approach to initialize mixins. We do it here because we can no longer
        // rely on `ready()` as we add controller after `ready()` for all mixins has been called.

        // InputMixin
        host.inputElement = node;

        // DelegateFocusMixin
        host.focusElement = node;

        // DelegateStateMixin
        host.stateTarget = node;

        // FieldAriaMixin
        host.ariaTarget = node;
      }
    ]);
  }
}
