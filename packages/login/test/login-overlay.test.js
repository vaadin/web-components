import { expect } from '@vaadin/chai-plugins';
import { aTimeout, enter, esc, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-login-overlay.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { fillUsernameAndPassword } from './helpers.js';

describe('login overlay', () => {
  let login, overlay, submitStub;

  before(() => {
    submitStub = sinon.stub(HTMLFormElement.prototype, 'submit');
  });

  after(() => {
    submitStub.restore();
  });

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-overlay theme="some-theme"></vaadin-login-overlay>');
    login.opened = true;
    await nextRender();
    overlay = login.$.overlay;
  });

  afterEach(() => {
    submitStub.resetHistory();
  });

  it('should reflect opened property to attribute', () => {
    expect(overlay.hasAttribute('opened')).to.be.true;

    overlay.opened = false;
    expect(overlay.hasAttribute('opened')).to.be.false;
  });

  it('should set opened on the host overlay wrapper', () => {
    expect(overlay.opened).to.be.true;
  });

  it('should propagate theme attribute to the overlay wrapper', () => {
    expect(overlay.getAttribute('theme')).to.be.equal('some-theme');
  });

  it('should not close on ESC key', () => {
    esc(document.body);

    expect(login.opened).to.be.true;
    expect(overlay.opened).to.be.true;
  });

  it('should not close on backdrop click', () => {
    overlay.$.backdrop.click();

    expect(login.opened).to.be.true;
    expect(overlay.opened).to.be.true;
  });

  it('should be able to listen to `login` event', () => {
    const loginSpy = sinon.spy();

    login.addEventListener('login', loginSpy);

    const { vaadinLoginUsername } = fillUsernameAndPassword(login);

    enter(vaadinLoginUsername);
    expect(loginSpy.called).to.be.true;

    const { type } = loginSpy.args[0][0];
    expect(type).to.be.equal('login');
  });

  it('should be able to prevent default to `login` event', async () => {
    login.action = 'login';
    await nextUpdate(login);
    login.addEventListener('login', (e) => e.preventDefault());

    const { vaadinLoginUsername } = fillUsernameAndPassword(login);

    enter(vaadinLoginUsername);
    expect(submitStub.called).to.be.false;
  });

  it('should focus the username field', () => {
    const usernameElement = login._userNameField;
    expect(document.activeElement).to.equal(usernameElement.inputElement);
  });

  it('should dispatch closed event when the overlay is closed', async () => {
    const closedSpy = sinon.spy();
    login.addEventListener('closed', closedSpy);
    login.opened = false;
    await nextRender();
    expect(closedSpy.calledOnce).to.be.true;
  });
});

describe('no autofocus', () => {
  let login, overlay;

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-overlay no-autofocus></vaadin-login-overlay>');
    await nextRender();
    overlay = login.$.overlay;
  });

  it('should not focus the username field', async () => {
    login.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
    // Overlay traps focus and focuses the host by default
    expect(getDeepActiveElement()).to.equal(login);
  });
});

describe('title and description', () => {
  let login, overlay, titleElement, descriptionElement;

  beforeEach(async () => {
    login = fixtureSync(`
      <vaadin-login-overlay title="New title" description="New description"></vaadin-login-overlay>
    `);
    await nextRender();
    overlay = login.$.overlay;
    titleElement = login.querySelector('[slot="title"]');
    descriptionElement = overlay.shadowRoot.querySelector('[part="description"]');
  });

  it('should display title and description set via attributes or properties', () => {
    expect(login.title).to.be.equal('New title');
    expect(login.description).to.be.equal('New description');

    expect(titleElement.textContent).to.be.equal(login.title);
    expect(descriptionElement.textContent).to.be.equal(login.description);
  });

  it('should update title and description when property updated', async () => {
    login.title = 'The newest title';
    login.description = 'The newest description';
    await nextUpdate(login);

    expect(titleElement.textContent).to.be.equal(login.title);
    expect(descriptionElement.textContent).to.be.equal(login.description);
  });

  it('should update title and description when i18n.header updated', async () => {
    const i18n = { header: { title: 'The newest title', description: 'The newest description' } };
    login.i18n = i18n;
    await nextUpdate(login);

    expect(titleElement.textContent).to.be.equal('The newest title');
    expect(descriptionElement.textContent).to.be.equal('The newest description');

    expect(login.title).to.be.equal(login.i18n.header.title);
    expect(login.description).to.be.equal(login.i18n.header.description);
  });
});

describe('heading level', () => {
  let login, formTitle;

  beforeEach(async () => {
    login = fixtureSync(`<vaadin-login-overlay></vaadin-login-overlay>`);
    await nextRender();
    formTitle = login.shadowRoot.querySelector('[part="form-title"]');
  });

  it('should update form title heading level based on the overlay', async () => {
    expect(login.headingLevel).to.equal(1);
    expect(formTitle.getAttribute('aria-level')).to.equal('2');

    login.headingLevel = 2;
    await nextUpdate(login);
    expect(formTitle.getAttribute('aria-level')).to.equal('3');
  });
});

describe('title slot', () => {
  let login, title;

  const ID_REGEX = /^title-vaadin-login-overlay-\d+$/u;

  describe('default', () => {
    beforeEach(async () => {
      login = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
      await nextRender();
      title = login.querySelector('[slot=title]');
    });

    it('should render generated title and link it using aria-labelledby', () => {
      expect(title.id).to.match(ID_REGEX);
      expect(login.getAttribute('aria-labelledby')).to.equal(title.id);
    });

    it('should set role="heading" on the generated title element', () => {
      expect(title.getAttribute('role')).to.equal('heading');
    });

    it('should update aria-level on the generated title when headingLevel changes', async () => {
      expect(title.getAttribute('aria-level')).to.equal('1');

      login.headingLevel = '2';
      await nextUpdate(login);

      expect(title.getAttribute('aria-level')).to.equal('2');
    });
  });

  describe('custom', () => {
    beforeEach(async () => {
      login = fixtureSync(`
        <vaadin-login-overlay>
          <h1 id="custom-title" slot="title">Custom title</h1>
        </vaadin-login-overlay>
      `);
      await nextRender();
      title = login.querySelector('[slot=title]');
    });

    it('should not override custom id set on the slotted title', () => {
      expect(title.id).to.equal('custom-title');
      expect(login.getAttribute('aria-labelledby')).to.equal('custom-title');
    });

    it('should not set role="heading" on the custom title element', () => {
      expect(title.hasAttribute('role')).to.be.false;
    });

    it('should not set aria-level on the custom title element', () => {
      expect(title.hasAttribute('aria-level')).to.be.false;
    });

    it('should restore generated title element when custom title is removed', async () => {
      title.remove();
      await nextRender();

      title = login.querySelector('[slot=title]');
      expect(title.id).to.match(ID_REGEX);
      expect(login.getAttribute('aria-labelledby')).to.equal(title.id);
    });
  });
});

describe('detach and re-attach', () => {
  let login;

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-overlay opened></vaadin-login-overlay>');
    await nextRender();
  });

  it('should close the overlay when removed from DOM', async () => {
    login.remove();
    await aTimeout(0);

    expect(login.opened).to.be.false;
  });

  it('should restore opened state when added to the DOM', async () => {
    const parent = login.parentNode;
    login.remove();
    await nextRender();
    expect(login.opened).to.be.false;

    parent.appendChild(login);
    await nextRender();
    expect(login.opened).to.be.true;
  });

  it('should not close the overlay when moved within the DOM', async () => {
    const newParent = document.createElement('div');
    document.body.appendChild(newParent);
    newParent.appendChild(login);
    await aTimeout(0);

    expect(login.opened).to.be.true;
  });
});

describe('exportparts', () => {
  let login, overlay, form;

  beforeEach(async () => {
    login = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
    await nextRender();
    overlay = login.$.overlay;
    form = login.$.form;
  });

  it('should export all overlay wrapper parts for styling', () => {
    const parts = [...overlay.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
    const exportParts = overlay.getAttribute('exportparts').split(', ');

    parts.forEach((part) => {
      expect(exportParts).to.include(part);
    });
  });

  it('should export all form wrapper parts for styling', () => {
    const parts = [...form.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
    const exportParts = form.getAttribute('exportparts').split(', ');

    parts.forEach((part) => {
      expect(exportParts).to.include(part);
    });
  });
});
