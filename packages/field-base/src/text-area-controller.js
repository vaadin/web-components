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
