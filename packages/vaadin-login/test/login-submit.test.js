import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { fillUsernameAndPassword } from './helpers.js';
import '../vaadin-login-overlay.js';
import '../vaadin-login-form.js';

describe('login form submit', () => {
  let login, iframe;

  function testFormSubmitValues(preventDefault, expectation, done) {
    fillUsernameAndPassword(login);

    const loginForm = login.querySelector('[part="vaadin-login-native-form"]');
    loginForm.setAttribute('method', 'GET');
    loginForm.setAttribute('target', iframe.getAttribute('name'));

    const submitSpy = sinon.spy(loginForm, 'submit');
    preventDefault && login.addEventListener('login', (e) => e.preventDefault());

    iframe.onload = () => {
      expect(iframe.contentWindow.location.href).to.include('login-action?username=username&password=password');
      done();
    };

    login.querySelector('vaadin-button[part="vaadin-login-submit"]').click();
    expect(submitSpy.called).to.equal(expectation);

    if (preventDefault) {
      done();
    }
  }

  function testTab(done, element) {
    const input = element.querySelector('input');
    keyUpOn(input, 9, [], 'Tab');
    setTimeout(() => {
      const selected = input.selectionEnd - input.selectionStart == input.value.length;
      expect(selected).to.be.true;
      done();
    }, 1);
  }

  before(() => {
    iframe = document.createElement('iframe');
    iframe.setAttribute('name', 'loginFrame');
    document.body.appendChild(iframe);
  });

  describe('default', () => {
    beforeEach(() => {
      login = fixtureSync('<vaadin-login-form action="login-action"></vaadin-login-form>');
    });

    it('should submit form values from login element', (done) => {
      testFormSubmitValues(false, true, done);
    });

    it('should not submit form if action is defined and event was default prevented', (done) => {
      testFormSubmitValues(true, false, done);
    });

    it('should select username field on tab navigation', (done) => {
      const { vaadinLoginUsername } = fillUsernameAndPassword(login);
      testTab(done, vaadinLoginUsername);
    });

    it('should select password field on tab navigation', (done) => {
      const { vaadinLoginPassword } = fillUsernameAndPassword(login);
      testTab(done, vaadinLoginPassword);
    });
  });

  describe('overlay', () => {
    let overlay;

    beforeEach(() => {
      overlay = fixtureSync('<vaadin-login-overlay action="login-action" opened></vaadin-login-overlay>');
      login = overlay.$.vaadinLoginForm;
    });

    it('should submit form values from overlay element', (done) => {
      testFormSubmitValues(false, true, done);
    });
  });
});
