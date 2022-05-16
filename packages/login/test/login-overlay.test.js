import { expect } from '@esm-bundle/chai';
import { enter, esc, fixtureSync, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-login-overlay.js';
import { fillUsernameAndPassword } from './helpers.js';

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
  let overlay, submitStub;

  before(() => {
    submitStub = sinon.stub(HTMLFormElement.prototype, 'submit');
  });

  after(() => {
    submitStub.restore();
  });

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay opened theme="some-theme"></vaadin-login-overlay>');
  });

  afterEach(() => {
    overlay.opened = false;
    submitStub.resetHistory();
  });

  it('should set opened using attribute', () => {
    expect(overlay.opened).to.be.true;
    expect(document.querySelector('vaadin-login-form-wrapper')).to.exist;
  });

  it('should remove form wrapper when closed', () => {
    overlay.opened = false;
    expect(document.querySelector('vaadin-login-form-wrapper')).not.to.exist;
  });

  it('should not remove form wrapper when moved within DOM', () => {
    const newParent = document.createElement('div');
    document.body.appendChild(newParent);
    newParent.appendChild(overlay);

    expect(document.querySelector('vaadin-login-form-wrapper')).to.exist;
  });

  it('should propagate theme to a wrapper', () => {
    const wrapper = document.querySelector('vaadin-login-overlay-wrapper');
    expect(wrapper.getAttribute('theme')).to.be.equal('some-theme');
  });

  it('should not close on ESC key', () => {
    esc(document.body);

    expect(overlay.opened).to.be.true;
  });

  it('should not close on click outside', () => {
    tap(overlay.$.vaadinLoginOverlayWrapper.$.backdrop);

    expect(overlay.opened).to.be.true;
  });

  it('should fire `login` event', () => {
    const loginSpy = sinon.spy(overlay, '_retargetEvent');
    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    enter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to listen to `login` event', () => {
    const loginSpy = sinon.spy();

    overlay.addEventListener('login', loginSpy);

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    enter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to prevent default to `login` event', () => {
    overlay.action = 'login';
    overlay.addEventListener('login', (e) => e.preventDefault());

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    enter(vaadinLoginUsername);
    expect(submitStub.called).to.be.false;
  });

  it('should focus the username field', () => {
    const usernameElement = overlay.$.vaadinLoginForm.$.vaadinLoginUsername;
    expect(document.activeElement).to.equal(usernameElement.inputElement);
  });
});

describe('no autofocus', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay no-autofocus></vaadin-login-overlay>');
  });

  it('should not focus the username field', () => {
    const activeElement = document.activeElement;
    overlay.opened = true;
    expect(document.activeElement).to.equal(activeElement);
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
      header: { title: 'The newest title', description: 'The newest description' },
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
