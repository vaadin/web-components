import '../../vaadin-app-layout';
import {
  AppLayoutDrawerOpenedChangedEvent,
  AppLayoutOverlayChangedEvent,
  AppLayoutPrimarySectionChangedEvent
} from '../../vaadin-app-layout';

const assertType = <TExpected>(actual: TExpected) => actual;

const layout = document.createElement('vaadin-app-layout');

layout.addEventListener('drawer-opened-changed', (event) => {
  assertType<AppLayoutDrawerOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

layout.addEventListener('overlay-changed', (event) => {
  assertType<AppLayoutOverlayChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

layout.addEventListener('primary-section-changed', (event) => {
  assertType<AppLayoutPrimarySectionChangedEvent>(event);
  assertType<'navbar' | 'drawer'>(event.detail.value);
});
