import '../../vaadin-notification.js';
import { NotificationOpenedChangedEvent, NotificationRenderer } from '../../vaadin-notification.js';
import { Notification } from '../../vaadin-notification.js';

const assertType = <TExpected>(value: TExpected) => value;

const notification = document.createElement('vaadin-notification');

notification.addEventListener('opened-changed', (event) => {
  assertType<NotificationOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

Notification.show('Hello world', { position: 'middle', duration: 7000, theme: 'error' });

const renderer: NotificationRenderer = (root, owner) => {
  assertType<HTMLElement>(root);
  assertType<Notification>(owner);
};

notification.renderer = renderer;
