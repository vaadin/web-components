import { expect } from '@vaadin/chai-plugins';
import { enter, fixtureSync, nextRender, nextUpdate, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { fillUsernameAndPassword } from './helpers.js';

describe('login form with csrf', () => {
  let loginForm, submitStub;

  before(() => {
    submitStub = sinon.stub(HTMLFormElement.prototype, 'submit');
  });

  after(() => {
    submitStub.restore();
  });

  beforeEach(async () => {
    loginForm = fixtureSync(`<vaadin-login-form action='login-action'></vaadin-login-form>
    <meta name="_csrf_parameter" content="_csrf" />
    <meta name="_csrf_header" content="X-CSRF-TOKEN" />
    <meta name="_csrf" content="28e4c684-fb5e-4c79-b8e2-a2177569edfa" />`);
    await nextRender();
  });

  afterEach(() => {
    submitStub.resetHistory();
  });

  it('should include CSRF in submit request', () => {
    const { vaadinLoginPassword } = fillUsernameAndPassword(loginForm);
    enter(vaadinLoginPassword);
    expect(submitStub.called).to.be.true;
    const csrfInput = loginForm.querySelector('#csrf');
    expect(csrfInput.name).to.equal('_csrf');
    expect(csrfInput.value).to.equal('28e4c684-fb5e-4c79-b8e2-a2177569edfa');
  });
});

describe('login form', () => {
  let login, formWrapper, submitStub;

  before(() => {
    submitStub = sinon.stub(HTMLFormElement.prototype, 'submit');
  });

  after(() => {
    submitStub.restore();
  });

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-form action="login-action"></vaadin-login-form>');
    await nextRender();
    formWrapper = login.querySelector('vaadin-login-form-wrapper');
  });

  afterEach(() => {
    submitStub.resetHistory();
  });

  it('should emit forgot password event', () => {
    const spy = sinon.spy();
    login.addEventListener('forgot-password', spy);
    const forgotElement = login.querySelector('vaadin-button[slot="forgot-password"]');
    forgotElement.click();
    expect(spy.calledOnce).to.be.true;
  });

  it('should not validate username on blur', () => {
    const { vaadinLoginUsername } = login.$;

    vaadinLoginUsername.focus();
    vaadinLoginUsername.blur();

    expect(vaadinLoginUsername.invalid).to.be.false;
  });

  it('should not validate password on blur', () => {
    const { vaadinLoginPassword } = login.$;

    vaadinLoginPassword.focus();
    vaadinLoginPassword.blur();

    expect(vaadinLoginPassword.invalid).to.be.false;
  });

  it('should mark only username as invalid if user hits ENTER when field is empty', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.false;

    enter(vaadinLoginUsername);
    expect(vaadinLoginUsername.invalid).to.be.true;
    expect(vaadinLoginPassword.invalid).to.be.false;
  });

  it('should change focus to password if username is filled and user hits ENTER (password is empty)', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;
    vaadinLoginUsername.value = 'username';

    enter(vaadinLoginUsername);
    expect(vaadinLoginPassword.hasAttribute('focused')).to.be.true;
  });

  it('should not mark password as invalid if username is filled and user hits ENTER (password is empty)', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;
    vaadinLoginUsername.value = 'username';

    enter(vaadinLoginUsername);
    expect(vaadinLoginPassword.hasAttribute('invalid')).to.be.false;
  });

  it('should mark password as invalid if user hits ENTER when field is empty', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.false;

    enter(vaadinLoginPassword);

    expect(vaadinLoginUsername.invalid).to.be.false;
    expect(vaadinLoginPassword.invalid).to.be.true;
  });

  it('should change focus to username if password is filled and user hits ENTER (username is empty)', () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = login.$;

    vaadinLoginPassword.focus();
    vaadinLoginPassword.value = 'password';
    enter(vaadinLoginPassword);
    expect(vaadinLoginUsername.hasAttribute('focused')).to.be.true;
  });

  it('should trigger submit if both username and password are filled', () => {
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);
    enter(vaadinLoginPassword);
    expect(submitStub.called).to.be.true;
  });

  it('should disable button after submitting form', async () => {
    const submit = login.querySelector('vaadin-button');
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);
    enter(vaadinLoginPassword);
    await nextUpdate(login);
    expect(submit.disabled).to.be.true;
  });

  it('should prevent submit call when login is disabled', async () => {
    const submit = login.querySelector('vaadin-button');
    const { vaadinLoginPassword } = fillUsernameAndPassword(login);

    login.setAttribute('disabled', 'disabled');
    await nextUpdate(login);
    enter(vaadinLoginPassword);
    expect(submitStub.called).to.be.false;

    tap(submit);
    expect(submitStub.called).to.be.false;
  });

  it('should not disable button on button click if form is invalid', async () => {
    const submit = login.querySelector('vaadin-button');
    expect(submit.disabled).to.not.be.true;
    tap(submit);
    await nextUpdate(login);
    expect(submit.disabled).to.not.be.true;
  });

  it('should disable button on button click if form is valid', async () => {
    const submit = login.querySelector('vaadin-button');
    fillUsernameAndPassword(login);
    tap(submit);
    await nextUpdate(login);
    expect(submit.disabled).to.be.true;
  });

  it('should trigger `login` event if no action is defined', async () => {
    const { vaadinLoginUsername, vaadinLoginPassword } = fillUsernameAndPassword(login);
    login.action = null;
    await nextUpdate(login);

    const loginEventSpy = sinon.spy();
    login.addEventListener('login', loginEventSpy);
    enter(vaadinLoginPassword);

    const event = loginEventSpy.args[0][0];

    expect(event.detail.username).to.equal(vaadinLoginUsername.value);
    expect(event.detail.password).to.equal(vaadinLoginPassword.value);
  });

  it('error should be hidden by default', () => {
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.offsetWidth).to.equal(0);
    expect(errorPart.offsetHeight).to.equal(0);
  });

  it('should be possible to set error attribute', async () => {
    expect(login.error).to.be.false;
    login.error = true;
    await nextUpdate(login);
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.offsetWidth).not.to.equal(0);
    expect(errorPart.offsetHeight).not.to.equal(0);
  });

  it('should enable button when error is set to true', async () => {
    expect(login.error).to.be.false;
    login.setAttribute('disabled', 'disabled');
    await nextUpdate(login);
    expect(login.disabled).to.be.true;

    login.error = true;
    await nextUpdate(login);
    expect(login.disabled).to.be.false;

    login.error = false;
    await nextUpdate(login);
    expect(login.error).to.be.false;
    expect(login.disabled).to.be.false;
  });

  it('should not enable button when error is set to true and _preventAutoEnable', async () => {
    expect(login.error).to.be.false;
    login.disabled = true;
    login._preventAutoEnable = true;
    await nextUpdate(login);
    expect(login.disabled).to.be.true;

    login.error = true;
    await nextUpdate(login);
    expect(login.disabled).to.be.true;

    login.error = false;
    await nextUpdate(login);
    expect(login.error).to.be.false;
    expect(login.disabled).to.be.true;
  });

  it('should focus the username field', () => {
    const usernameElement = login.$.vaadinLoginUsername;
    expect(document.activeElement).to.equal(usernameElement.inputElement);
  });

  it('should have autocomplete attribute set', () => {
    const passwordField = login.$.vaadinLoginPassword;
    expect(passwordField.getAttribute('autocomplete')).to.be.equal('current-password');
  });
});

describe('no autofocus', () => {
  let activeElement;

  beforeEach(async () => {
    activeElement = document.activeElement;
    fixtureSync('<vaadin-login-form no-autofocus></vaadin-login-form>');
    await nextRender();
  });

  it('should not focus the username field', () => {
    expect(document.activeElement).to.equal(activeElement);
  });
});

describe('error message', () => {
  let login, formWrapper;

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-form error></vaadin-login-form>');
    await nextRender();
    formWrapper = login.querySelector('vaadin-login-form-wrapper');
  });

  it('should show error message if the error attribute is set', () => {
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.hidden).to.be.false;
    expect(errorPart.offsetWidth).not.to.equal(0);
    expect(errorPart.offsetHeight).not.to.equal(0);
  });

  it('should be possible to unset the error', async () => {
    expect(login.error).to.be.true;
    login.error = false;
    await nextUpdate(login);
    const errorPart = formWrapper.shadowRoot.querySelectorAll('div[part="error-message"]')[0];
    expect(errorPart.hidden).to.be.true;
    expect(errorPart.offsetWidth).to.equal(0);
    expect(errorPart.offsetHeight).to.equal(0);
  });
});

describe('stylable parts', () => {
  let login, formWrapper;

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-form theme="green"></vaadin-login-form>');
    await nextRender();
    formWrapper = login.querySelector('vaadin-login-form-wrapper');
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
