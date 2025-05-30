import '../../vaadin-app-layout.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  AppLayoutDrawerOpenedChangedEvent,
  AppLayoutI18n,
  AppLayoutOverlayChangedEvent,
  AppLayoutPrimarySectionChangedEvent,
} from '../../vaadin-app-layout.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const layout = document.createElement('vaadin-app-layout');

// Mixins
assertType<ElementMixinClass>(layout);
assertType<I18nMixinClass<AppLayoutI18n>>(layout);
assertType<ThemableMixinClass>(layout);

// Properties
assertType<'drawer' | 'navbar'>(layout.primarySection);
assertType<boolean>(layout.drawerOpened);
assertType<boolean>(layout.overlay);
assertType<string>(layout.closeDrawerOn);
assertType<AppLayoutI18n>(layout.i18n);

// I18n
assertType<AppLayoutI18n>({});
assertType<AppLayoutI18n>({ drawer: 'drawer' });

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
