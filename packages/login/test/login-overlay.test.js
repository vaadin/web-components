import { expect } from '@vaadin/chai-plugins';
import { enter, esc, fixtureSync, nextRender, nextUpdate, oneEvent, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-login-overlay.js';
import { fillUsernameAndPassword } from './helpers.js';

describe('login overlay', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
    await nextRender();
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should render form when opened', async () => {
    overlay.opened = true;
    await oneEvent(overlay.$.vaadinLoginOverlayWrapper, 'vaadin-overlay-open');
    expect(document.querySelector('vaadin-login-form')).to.be.ok;
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

  beforeEach(async () => {
    overlay = fixtureSync('<vaadin-login-overlay opened theme="some-theme"></vaadin-login-overlay>');
    await nextRender();
    await nextUpdate(overlay.$.vaadinLoginForm);
  });

  afterEach(() => {
    overlay.opened = false;
    submitStub.resetHistory();
  });

  it('should set opened using attribute', () => {
    expect(overlay.opened).to.be.true;
    expect(document.querySelector('vaadin-login-form')).to.exist;
  });

  it('should remove form when closed', async () => {
    overlay.opened = false;
    await nextUpdate(overlay);
    expect(document.querySelector('vaadin-login-form')).not.to.exist;
  });

  it('should not remove form when moved within DOM', async () => {
    const newParent = document.createElement('div');
    document.body.appendChild(newParent);
    newParent.appendChild(overlay);
    await nextRender();

    expect(document.querySelector('vaadin-login-form')).to.exist;
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

  it('should be able to listen to `login` event', () => {
    const loginSpy = sinon.spy();

    overlay.addEventListener('login', loginSpy);

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    enter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to prevent default to `login` event', async () => {
    overlay.action = 'login';
    await nextUpdate(overlay);
    overlay.addEventListener('login', (e) => e.preventDefault());

    const { vaadinLoginUsername } = fillUsernameAndPassword(overlay.$.vaadinLoginForm);

    enter(vaadinLoginUsername);
    expect(submitStub.called).to.be.false;
  });

  it('should focus the username field', () => {
    const usernameElement = overlay.$.vaadinLoginForm._userNameField;
    expect(document.activeElement).to.equal(usernameElement.inputElement);
  });

  it('should update disabled property when form disabled changes', async () => {
    const form = overlay.$.vaadinLoginForm;

    form.disabled = true;
    await nextUpdate(form);
    expect(overlay.disabled).to.be.true;

    form.disabled = false;
    await nextUpdate(form);
    expect(overlay.disabled).to.be.false;
  });
});

describe('no autofocus', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay no-autofocus></vaadin-login-overlay>');
  });

  it('should not focus the username field', async () => {
    overlay.opened = true;
    await oneEvent(overlay.$.vaadinLoginOverlayWrapper, 'vaadin-overlay-open');
    // Overlay traps focus and focuses the wrapper by default
    expect(document.activeElement).to.equal(overlay.$.vaadinLoginOverlayWrapper);
  });
});

describe('title and description', () => {
  let overlay, headerElement, descriptionElement;

  beforeEach(async () => {
    overlay = fixtureSync(`
      <vaadin-login-overlay title="New title" description="New description" opened></vaadin-login-overlay>
    `);
    await nextRender();
    headerElement = overlay.$.vaadinLoginOverlayWrapper.shadowRoot.querySelector('[part="title"]');
    descriptionElement = overlay.$.vaadinLoginOverlayWrapper.shadowRoot.querySelector('[part="description"]');
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

  it('should update title and description when property updated', async () => {
    overlay.title = 'The newest title';
    overlay.description = 'The newest description';
    await nextUpdate(overlay);

    expect(headerElement.textContent).to.be.equal(overlay.title);
    expect(descriptionElement.textContent).to.be.equal(overlay.description);
  });

  it('should update title and description when i18n.header updated', async () => {
    const i18n = { header: { title: 'The newest title', description: 'The newest description' } };
    overlay.i18n = i18n;
    await nextUpdate(overlay);
    await nextUpdate(overlay.$.vaadinLoginOverlayWrapper);

    expect(headerElement.textContent).to.be.equal('The newest title');
    expect(descriptionElement.textContent).to.be.equal('The newest description');

    expect(overlay.title).to.be.equal(overlay.i18n.header.title);
    expect(overlay.description).to.be.equal(overlay.i18n.header.description);
  });

  it('should update aria-label when title property changes', async () => {
    overlay.title = 'New title';
    await nextUpdate(overlay);
    expect(overlay.$.vaadinLoginOverlayWrapper.getAttribute('aria-label')).to.equal('New title');
  });
});

describe('heading level', () => {
  let overlay, form;

  beforeEach(async () => {
    overlay = fixtureSync(`<vaadin-login-overlay opened></vaadin-login-overlay>`);
    await nextRender();
    form = overlay.$.vaadinLoginForm;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should set login form title heading level based on the overlay', async () => {
    expect(overlay.headingLevel).to.equal(1);
    expect(form.headingLevel).to.equal(2);

    overlay.headingLevel = 2;
    await nextUpdate(overlay);
    expect(form.headingLevel).to.equal(3);
  });
});

describe('title slot', () => {
  let overlay, overlayWrapper;

  beforeEach(async () => {
    overlay = fixtureSync(`
      <vaadin-login-overlay description="New description" opened>
        <div slot="title">Teleported title</div>
      </vaadin-login-overlay>
    `);
    await nextRender();
    overlayWrapper = overlay.$.vaadinLoginOverlayWrapper;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should teleport title', async () => {
    let titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(1);
    expect(titleElements[0].textContent).to.be.equal('Teleported title');

    overlay.opened = false;
    await nextRender();
    titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(0);

    overlay.opened = true;
    await nextRender();
    titleElements = overlayWrapper.querySelectorAll('[slot=title]');
    expect(titleElements.length).to.be.equal(1);
    expect(titleElements[0].textContent).to.be.equal('Teleported title');
  });

  it('should link slotted title using aria-labelledby', () => {
    const title = overlayWrapper.querySelector('[slot=title]');
    expect(title.id).to.be.ok;
    expect(overlayWrapper.hasAttribute('aria-label')).to.be.false;
    expect(overlayWrapper.getAttribute('aria-labelledby')).to.equal(title.id);
  });

  it('should reset aria-labelledby when slotted title is removed', async () => {
    overlay.opened = false;
    await nextRender();

    overlay.querySelector('[slot=title]').remove();

    overlay.opened = true;
    await nextRender();
    expect(overlayWrapper.hasAttribute('aria-labelledby')).to.be.false;
    expect(overlayWrapper.getAttribute('aria-label')).to.equal(overlay.title);
  });

  it('should not override custom id set on the slotted title', async () => {
    overlay.opened = false;
    await nextRender();

    overlay.querySelector('[slot=title]').remove();

    // Attach new slotted title with a custom ID
    const title = document.createElement('h1');
    title.id = 'custom-title';
    title.setAttribute('slot', 'title');
    overlay.appendChild(title);

    overlay.opened = true;
    await nextRender();

    expect(overlayWrapper.getAttribute('aria-labelledby')).to.equal('custom-title');
    expect(title.id).to.equal('custom-title');
  });
});

describe('custom-form-area slot', () => {
  let overlay, inputs, form;

  beforeEach(async () => {
    overlay = fixtureSync(`
      <vaadin-login-overlay>
        <input id="one" slot="custom-form-area" />
        <input id="two" slot="custom-form-area" />
      </vaadin-login-overlay>
    `);
    await nextRender();
    form = overlay.$.vaadinLoginForm;
    inputs = overlay.querySelectorAll('input');
  });

  it('should teleport custom field components to the login form', async () => {
    overlay.opened = true;
    await oneEvent(overlay.$.vaadinLoginOverlayWrapper, 'vaadin-overlay-open');

    expect(inputs[0].parentElement).to.equal(form);
    expect(inputs[1].parentElement).to.equal(form);

    const button = form.querySelector('vaadin-button');
    expect(inputs[0].nextElementSibling).to.equal(inputs[1]);
    expect(inputs[1].nextElementSibling).to.equal(button);

    overlay.opened = false;
    await nextRender();

    expect(inputs[0].parentElement).to.equal(overlay);
    expect(inputs[1].parentElement).to.equal(overlay);
  });
});

describe('footer slot', () => {
  let overlay, divs, form;

  beforeEach(async () => {
    overlay = fixtureSync(`
      <vaadin-login-overlay>
        <div id="foo" slot="footer">Foo</div>
        <div id="bar" slot="footer">Bar</div>
      </vaadin-login-overlay>
    `);
    await nextRender();
    form = overlay.$.vaadinLoginForm;
    divs = overlay.querySelectorAll('[slot="footer"]');
  });

  it('should teleport custom field components to the login form', async () => {
    overlay.opened = true;
    await oneEvent(overlay.$.vaadinLoginOverlayWrapper, 'vaadin-overlay-open');

    expect(divs[0].parentElement).to.equal(form);
    expect(divs[1].parentElement).to.equal(form);

    overlay.opened = false;
    await nextRender();

    expect(divs[0].parentElement).to.equal(overlay);
    expect(divs[1].parentElement).to.equal(overlay);
  });
});
