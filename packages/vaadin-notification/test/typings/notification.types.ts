import '../../vaadin-notification.js';

import { NotificationOpenedChangedEvent } from '../../vaadin-notification.js';

const assertType = <TExpected>(value: TExpected) => value;

const notification = document.createElement('vaadin-notification');

notification.addEventListener('opened-changed', (event) => {
  assertType<NotificationOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
