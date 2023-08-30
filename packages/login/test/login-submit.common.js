import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextRender, tabKeyUp } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { fillUsernameAndPassword } from './helpers.js';

describe('login form submit', () => {
  let login, iframe;

  function testFormSubmitValues(preventDefault, expectation, done) {
    fillUsernameAndPassword(login);

    const loginForm = login.querySelector('form');
    loginForm.setAttribute('method', 'GET');
    loginForm.setAttribute('target', iframe.getAttribute('name'));

    const submitSpy = sinon.spy(loginForm, 'submit');
    if (preventDefault) {
      login.addEventListener('login', (e) => e.preventDefault());
    }

    iframe.onload = () => {
      expect(iframe.contentWindow.location.href).to.include('login-action?username=username&password=password');
      done();
    };

    login.querySelector('vaadin-button').click();
    expect(submitSpy.called).to.equal(expectation);

    if (preventDefault) {
      done();
    }
  }

  function testTab(done, element) {
    const input = element.querySelector('input');
    tabKeyUp(input);
    setTimeout(() => {
      const selected = input.selectionEnd - input.selectionStart === input.value.length;
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
    beforeEach(async () => {
      login = fixtureSync('<vaadin-login-form action="login-action"></vaadin-login-form>');
      await nextRender();
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

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-login-overlay action="login-action" opened></vaadin-login-overlay>');
      await nextRender();
      login = overlay.$.vaadinLoginForm;
    });

    it('should submit form values from overlay element', (done) => {
      testFormSubmitValues(false, true, done);
    });
  });

  describe('custom fields', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-login-overlay opened>
          <input name="foo" value="bar" slot="custom-fields">
          <vaadin-text-field name="code" value="1234" slot="custom-fields"></vaadin-text-field>
        </vaadin-login-overlay>
      `);
      await nextRender();
      login = overlay.$.vaadinLoginForm;
    });

    it('should add custom fields values to the login event detail', () => {
      const loginSpy = sinon.spy();

      overlay.addEventListener('login', loginSpy);

      const { vaadinLoginUsername } = fillUsernameAndPassword(login);

      enter(vaadinLoginUsername);
      expect(loginSpy.called).to.be.true;

      const { detail } = loginSpy.firstCall.args[0];
      expect(detail.custom.foo).to.be.equal('bar');
      expect(detail.custom.code).to.be.equal('1234');
    });
  });
});
