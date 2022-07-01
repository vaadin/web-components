import '../../vaadin-app-layout.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  AppLayoutDrawerOpenedChangedEvent,
  AppLayoutI18n,
  AppLayoutOverlayChangedEvent,
  AppLayoutPrimarySectionChangedEvent,
} from '../../vaadin-app-layout.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const layout = document.createElement('vaadin-app-layout');

// Mixins
assertType<ElementMixinClass>(layout);
assertType<ThemableMixinClass>(layout);
assertType<ControllerMixinClass>(layout);

// Properties
assertType<'drawer' | 'navbar'>(layout.primarySection);
assertType<boolean>(layout.drawerOpened);
assertType<boolean>(layout.overlay);
assertType<string>(layout.closeDrawerOn);
assertType<AppLayoutI18n>(layout.i18n);

// Events
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
  assertType<'drawer' | 'navbar'>(event.detail.value);
});
