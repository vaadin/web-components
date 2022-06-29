import '../../vaadin-login-form.js';
import type { LoginFormLoginEvent } from '../../vaadin-login-form.js';
import type { LoginOverlayLoginEvent } from '../../vaadin-login-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-login-overlay');

overlay.addEventListener('login', (event) => {
  assertType<LoginOverlayLoginEvent>(event);
  assertType<string>(event.detail.username);
  assertType<string>(event.detail.password);
});

const form = document.createElement('vaadin-login-form');

form.addEventListener('login', (event) => {
  assertType<LoginFormLoginEvent>(event);
  assertType<string>(event.detail.username);
  assertType<string>(event.detail.password);
});
