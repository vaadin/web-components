import '../../vaadin-login-form.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type {
  LoginFormDisabledChangedEvent,
  LoginFormErrorChangedEvent,
  LoginFormLoginEvent,
  LoginI18n,
} from '../../vaadin-login-form.js';
import type {
  LoginOverlayClosedEvent,
  LoginOverlayDescriptionChangedEvent,
  LoginOverlayDisabledChangedEvent,
  LoginOverlayErrorChangedEvent,
  LoginOverlayLoginEvent,
} from '../../vaadin-login-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-login-overlay');

assertType<ElementMixinClass>(overlay);
assertType<OverlayClassMixinClass>(overlay);

assertType<number>(overlay.headingLevel);
assertType<LoginI18n>(overlay.i18n);

overlay.addEventListener('login', (event) => {
  assertType<LoginOverlayLoginEvent>(event);
  assertType<string>(event.detail.username);
  assertType<string>(event.detail.password);
  assertType<Record<string, unknown> | undefined>(event.detail.custom);
});

overlay.addEventListener('error-changed', (event) => {
  assertType<LoginOverlayDisabledChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

overlay.addEventListener('disabled-changed', (event) => {
  assertType<LoginOverlayErrorChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

overlay.addEventListener('description-changed', (event) => {
  assertType<LoginOverlayDescriptionChangedEvent>(event);
  assertType<string>(event.detail.value);
});

overlay.addEventListener('closed', (event) => {
  assertType<LoginOverlayClosedEvent>(event);
});

const form = document.createElement('vaadin-login-form');

assertType<number>(form.headingLevel);
assertType<LoginI18n>(form.i18n);

form.addEventListener('login', (event) => {
  assertType<LoginFormLoginEvent>(event);
  assertType<string>(event.detail.username);
  assertType<string>(event.detail.password);
});

form.addEventListener('error-changed', (event) => {
  assertType<LoginFormErrorChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

form.addEventListener('disabled-changed', (event) => {
  assertType<LoginFormDisabledChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

// I18n
assertType<LoginI18n>({});
assertType<LoginI18n>({ additionalInformation: 'additionalInformation' });
assertType<LoginI18n>({ form: { title: 'formTitle' } });
