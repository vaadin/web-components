import '../../vaadin-message-input.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { MessageInputSubmitEvent } from '../../vaadin-message-input.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const input = document.createElement('vaadin-message-input');

assertType<ControllerMixinClass>(input);

input.addEventListener('submit', (event) => {
  assertType<MessageInputSubmitEvent>(event);
  assertType<string>(event.detail.value);
});
