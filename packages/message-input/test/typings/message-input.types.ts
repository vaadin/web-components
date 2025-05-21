import '../../vaadin-message-input.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { MessageInputI18n, MessageInputSubmitEvent } from '../../vaadin-message-input.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const input = document.createElement('vaadin-message-input');

assertType<I18nMixinClass<MessageInputI18n>>(input);

input.addEventListener('submit', (event) => {
  assertType<MessageInputSubmitEvent>(event);
  assertType<string>(event.detail.value);
});

// I18n
assertType<MessageInputI18n>({});
assertType<MessageInputI18n>({ message: 'message' });
