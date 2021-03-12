import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { tap, pressAndReleaseKeyOn, pressEnter } from '@polymer/iron-test-helpers/mock-interactions.js';
import { fillUsernameAndPassword } from './helpers.js';
import '../vaadin-login-overlay.js';

describe('login overlay', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should render form wrapper when opened', () => {
    overlay.opened = true;
    expect(document.querySelector('vaadin-login-form-wrapper')).to.be.ok;
  });
});

describe('opened overlay', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay opened theme="some-theme"></vaadin-login-overlay>');
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should set opened using attribute', () => {
    expect(overlay.opened).to.be.true;
    expect(document.querySelector('vaadin-login-form-wrapper')).to.be.ok;
  });

  it('should remove form wrapper when closed', () => {
    overlay.opened = false;
    expect(document.querySelector('vaadin-login-form-wrapper')).to.be.not.ok;
  });

  it('should propagate theme to a wrapper', () => {
    const wrapper = document.querySelector('vaadin-login-overlay-wrapper');
    expect(wrapper.getAttribute('theme')).to.be.equal('some-theme');
  });

  it('should not close on ESC key', () => {
    pressAndReleaseKeyOn(document.body, 27, [], 'Escape');

    expect(overlay.opened).to.be.true;
  });

  it('should not close on click outside', () => {
    tap(overlay.$.vaadinLoginOverlayWrapper.$.backdrop);

    expect(overlay.opened).to.be.true;
  });

  it('should fire `login` event', () => {
    const loginSpy = sinon.spy(overlay, '_retargetEvent');
    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    pressEnter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to listen to `login` event', () => {
    const loginSpy = sinon.spy();

    overlay.addEventListener('login', loginSpy);

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    pressEnter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to prevent default to `login` event', () => {
    const nativeForm = overlay.$['vaadinLoginForm'].querySelector('[part=vaadin-login-native-form]');
    const submitSpy = sinon.spy(nativeForm, 'submit');

    overlay.action = 'login';
    overlay.addEventListener('login', (e) => e.preventDefault());

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    pressEnter(vaadinLoginUsername);
    expect(submitSpy.called).to.be.false;
  });
});

describe('title and description', () => {
  let overlay, headerElement, descriptionElement;

  beforeEach(() => {
    overlay = fixtureSync(`
      <vaadin-login-overlay title="New title" description="New description" opened></vaadin-login-overlay>
    `);
    headerElement = overlay.$.vaadinLoginOverlayWrapper.shadowRoot.querySelector('[part="brand"] h1');
    descriptionElement = overlay.$.vaadinLoginOverlayWrapper.shadowRoot.querySelector('[part="brand"] p');
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should display title and description set via attributes or properties', () => {
    expect(overlay.title).to.be.equal('New title');
    expect(overlay.description).to.be.equal('New description');

    expect(headerElement.textContent).to.be.equal(overlay.title);
    expect(descriptionElement.textContent).to.be.equal(overlay.description);
  });

  it('should update title and description when property updated', () => {
    overlay.title = 'The newest title';
    overlay.description = 'The newest description';

    expect(headerElement.textContent).to.be.equal(overlay.title);
    expect(descriptionElement.textContent).to.be.equal(overlay.description);
  });

  it('should update title and description when i18n.header updated', () => {
    const i18n = Object.assign({}, overlay.i18n, {
      header: { title: 'The newest title', description: 'The newest description' }
    });
    overlay.i18n = i18n;

    expect(headerElement.textContent).to.be.equal('The newest title');
    expect(descriptionElement.textContent).to.be.equal('The newest description');

    expect(overlay.title).to.be.equal(overlay.i18n.header.title);
    expect(overlay.description).to.be.equal(overlay.i18n.header.description);
  });
});

describe('title component', () => {
  let overlay, overlayWrapper;

  beforeEach(() => {
    overlay = fixtureSync(`
      <vaadin-login-overlay description="New description" opened>
        <div slot="title">Teleported title</div>
      </vaadin-login-overlay>
    `);
    overlayWrapper = overlay.$.vaadinLoginOverlayWrapper;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should teleport title', () => {
    let titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(1);
    expect(titleElements[0].textContent).to.be.equal('Teleported title');

    overlay.opened = false;
    titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(0);

    overlay.opened = true;
    titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(1);
    expect(titleElements[0].textContent).to.be.equal('Teleported title');
  });
});
