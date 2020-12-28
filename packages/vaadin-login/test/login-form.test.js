import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { focus, pressEnter, tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { fillUsernameAndPassword } from './helpers.js';
import '../vaadin-login-form.js';

registerStyles(
  'vaadin-login-form-wrapper',
  css`
    :host([theme='green']) [part='form-title'],
    :host([theme='green']) [part='error-message-title'],
    :host([theme='green']) [part='error-message-description'] {
      color: rgb(0, 128, 0);
    }
  `
);

describe('login form', () => {
  var login, formWrapper;

  beforeEach(() => {
    login = fixtureSync('<vaadin-login-form></vaadin-login-form>');
    formWrapper = login.querySelector('[part="vaadin-login-native-form-wrapper"]');
  });

  it('should have a valid version number', () => {
    expect(login.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('should display default strings', () => {
    const formTitleElement = formWrapper.shadowRoot.querySelector('[part="form"] h2');
    const errorTitleElement = formWrapper.shadowRoot.querySelector('[part="error-message"] h5');
    const errorMessageElement = formWrapper.shadowRoot.querySelector('[part="error-message"] p');

    const usernameElement = login.querySelector('#vaadinLoginUsername');
    const passwordElement = login.querySelector('#vaadinLoginPassword');
    const submitElement = login.querySelector('vaadin-button[part="vaadin-login-submit"]');
    const forgotElement = formWrapper.shadowRoot.querySelector('#forgotPasswordButton');

    const footerElement = formWrapper.shadowRoot.querySelector('[part="footer"] p');

    expect(formTitleElement.textContent).to.be.equal(login.i18n.form.title);
    expect(errorTitleElement.textContent).to.be.equal(login.i18n.errorMessage.title);
    expect(errorMessageElement.textContent).to.be.equal(login.i18n.errorMessage.message);

    expect(usernameElement.label).to.be.equal(login.i18n.form.username);
    expect(passwordElement.label).to.be.equal(login.i18n.form.password);
    expect(submitElement.textContent).to.be.equal(login.i18n.form.submit);
    expect(forgotElement.textContent).to.be.equal(login.i18n.form.forgotPassword);

    expect(footerElement.textContent).to.be.equal('');
    expect(login.i18n.additionalInformation).to.be.undefined;
  });

  it('should show forgot password button', () => {
    expect(formWrapper.$.forgotPasswordButton.hidden).to.be.false;
  });

  it('should emit forgot password event', () => {
    var eventWasCaught = false;
    login.addEventListener('forgot-password', () => {
      eventWasCaught = true;
    });

    formWrapper.$.forgotPasswordButton.click();
    expect(eventWasCaught).to.be.true;
  });

  it('should be able to internationalize via `i18n` property', () => {
    const additionalInformation = formWrapper.shadowRoot.querySelector('[part="footer"] p');
    expect(additionalInformation.textContent).to.be.equal('');
    expect(formWrapper.$.forgotPasswordButton.textContent).to.be.equal(login.i18n.form.forgotPassword);

    const i18n = Object.assign({}, login.i18n, {
      additionalInformation: 'Mais informações',
      form: { forgotPassword: 'Esqueci a senha' }
    });
    login.i18n = i18n;
    expect(additionalInformation.textContent).to.be.equal(login.i18n.additionalInformation);
    expect(formWrapper.$.forgotPasswordButton.textContent).to.be.equal(login.i18n.form.forgotPassword);
  });

  it('should mark only username as invalid if user hits ENTER when field is empty', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.false;

    pressEnter(vaadinLoginUsername);
    expect(vaadinLoginUsername.invalid).to.be.true;
    expect(vaadinLoginPassword.invalid).to.be.false;
  });

  it('should change focus to password if username is filled and user hits ENTER (password is empty)', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;
    vaadinLoginUsername.value = 'username';

    pressEnter(vaadinLoginUsername);
    expect(vaadinLoginPassword.hasAttribute('focused')).to.be.true;
  });

  it('should mark password as invalid if user hits ENTER when field is empty', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.false;

    pressEnter(vaadinLoginPassword);

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.true;
  });

  it('should change focus to username if password is filled and user hits ENTER (username is empty)', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    focus(vaadinLoginPassword);
    vaadinLoginPassword.value = 'password';
    pressEnter(vaadinLoginPassword);
    expect(vaadinLoginUsername.hasAttribute('focused')).to.be.true;
  });

  it('should trigger submit if both username and password are filled', () => {
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);
    const submitSpy = sinon.spy(login, 'submit');
    pressEnter(vaadinLoginPassword);
    expect(submitSpy.called).to.be.true;
  });

  it('should disable button after submitting form', () => {
    const submit = login.querySelector('vaadin-button[part="vaadin-login-submit"]');
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);
    pressEnter(vaadinLoginPassword);
    expect(submit.disabled).to.be.true;
  });

  it('should prevent submit call when login is disabled', () => {
    const loginForm = login.querySelector('[part="vaadin-login-native-form"]');
    const submit = login.querySelector('vaadin-button[part="vaadin-login-submit"]');
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);

    const submitSpy = sinon.spy(loginForm, 'submit');

    login.setAttribute('disabled', 'disabled');
    pressEnter(vaadinLoginPassword);
    expect(submitSpy.called).to.be.false;

    tap(submit);
    expect(submitSpy.called).to.be.false;
  });

  it('should not disable button on button click if form is invalid', () => {
    const submit = login.querySelector('vaadin-button[part="vaadin-login-submit"]');
    expect(submit.disabled).to.not.be.true;
    tap(submit);
    expect(submit.disabled).to.not.be.true;
  });

  it('should disable button on button click if form is valid', () => {
    const submit = login.querySelector('vaadin-button[part="vaadin-login-submit"]');
    fillUsernameAndPassword(login);
    tap(submit);
    expect(submit.disabled).to.be.true;
  });

  it('should trigger `login` event if no action is defined', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = fillUsernameAndPassword(login);
    const loginEventSpy = sinon.spy();

    login.addEventListener('login', loginEventSpy);
    pressEnter(vaadinLoginPassword);

    const event = loginEventSpy.args[0][0];

    expect(event.detail.username).to.equal(vaadinLoginUsername.value);
    expect(event.detail.password).to.equal(vaadinLoginPassword.value);
  });

  it('error should be hidden by default', () => {
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.offsetWidth).to.equal(0);
    expect(errorPart.offsetHeight).to.equal(0);
  });

  it('should be possible to set error attribute', () => {
    expect(login.error).to.be.false;
    login.error = true;
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.offsetWidth).not.to.equal(0);
    expect(errorPart.offsetHeight).not.to.equal(0);
  });

  it('should enable button when error is set to true', () => {
    expect(login.error).to.be.false;
    login.setAttribute('disabled', 'disabled');
    expect(login.disabled).to.be.true;
    login.error = true;
    expect(login.disabled).to.be.false;

    login.error = false;
    expect(login.error).to.be.false;
    expect(login.disabled).to.be.false;
  });

  it('should not enable button when error is set to true and _preventAutoEnable', () => {
    expect(login.error).to.be.false;
    login.disabled = true;
    login._preventAutoEnable = true;
    expect(login.disabled).to.be.true;
    login.error = true;
    expect(login.disabled).to.be.true;

    login.error = false;
    expect(login.error).to.be.false;
    expect(login.disabled).to.be.true;
  });
});

describe('no forgot password', () => {
  let login;

  beforeEach(() => {
    login = fixtureSync('<vaadin-login-form no-forgot-password></vaadin-login-form>');
  });

  it('should hide forgot password button', () => {
    const formWrapper = login.querySelector('[part="vaadin-login-native-form-wrapper"]');
    expect(formWrapper.$.forgotPasswordButton.hidden).to.be.true;
  });
});

describe('error message', () => {
  let login, formWrapper;

  beforeEach(() => {
    login = fixtureSync('<vaadin-login-form error></vaadin-login-form>');
    formWrapper = login.querySelector('[part="vaadin-login-native-form-wrapper"]');
  });

  it('should show error message if the error attribute is set', () => {
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.hidden).to.be.false;
    expect(errorPart.offsetWidth).not.to.equal(0);
    expect(errorPart.offsetHeight).not.to.equal(0);
  });

  it('should be possible to unset the error', () => {
    expect(login.error).to.be.true;
    login.error = false;
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.hidden).to.be.true;
    expect(errorPart.offsetWidth).to.equal(0);
    expect(errorPart.offsetHeight).to.equal(0);
  });
});

describe('stylable parts', () => {
  let login, formWrapper;

  beforeEach(() => {
    login = fixtureSync('<vaadin-login-form theme="green"></vaadin-login-form>');
    formWrapper = login.querySelector('[part="vaadin-login-native-form-wrapper"]');
  });

  it('should be possible to style parts', () => {
    const color = 'rgb(0, 128, 0)';

    const formTitle = formWrapper.shadowRoot.querySelector('[part="form-title"]');
    expect(getComputedStyle(formTitle).color).to.equal(color);

    const errorTitle = formWrapper.shadowRoot.querySelector('[part="error-message-title"]');
    expect(getComputedStyle(errorTitle).color).to.equal(color);

    const errorMessage = formWrapper.shadowRoot.querySelector('[part="error-message-description"]');
    expect(getComputedStyle(errorMessage).color).to.equal(color);
  });
});
