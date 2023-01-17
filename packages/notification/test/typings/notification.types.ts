import '../../vaadin-notification.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type {
  NotificationOpenedChangedEvent,
  NotificationPosition,
  NotificationRenderer,
} from '../../vaadin-notification.js';
import { Notification } from '../../vaadin-notification.js';

const assertType = <TExpected>(value: TExpected) => value;

const notification = document.createElement('vaadin-notification');

// Mixins
assertType<ElementMixinClass>(notification);

assertType<OverlayClassMixinClass>(notification);

assertType<ThemePropertyMixinClass>(notification);

// Properties
assertType<number>(notification.duration);
assertType<boolean>(notification.opened);
assertType<NotificationPosition>(notification.position);
assertType<NotificationRenderer | undefined>(notification.renderer);
assertType<string>(notification.overlayClass);

// Events
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
