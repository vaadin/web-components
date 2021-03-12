import '../../src/vaadin-login-overlay';
import '../../src/vaadin-login-form';

const assert = <T>(value: T) => value;

const overlay = document.createElement('vaadin-login-overlay');

overlay.addEventListener('login', (event) => {
  assert<string>(event.detail.username);
  assert<string>(event.detail.password);
});

const form = document.createElement('vaadin-login-form');

form.addEventListener('login', (event) => {
  assert<string>(event.detail.username);
  assert<string>(event.detail.password);
});
