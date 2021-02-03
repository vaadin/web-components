import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-message.js';

describe('message', () => {
  let message, avatar, content, time, name, user;

  beforeEach(() => {
    let root = document.documentElement;
    root.style.setProperty('--vaadin-user-color-2', 'blue');

    message = fixtureSync('<vaadin-message>Hello</vaadin-message>');
    avatar = message.shadowRoot.querySelector('vaadin-avatar');
    name = message.shadowRoot.querySelector('[part="name"]');
    content = message.shadowRoot.querySelector('[part="content"]');
    time = message.shadowRoot.querySelector('[part="time"]');
    user = {
      name: 'Joan Doe',
      abbr: 'JD',
      img: '/test/visual/avatars/avatar.jpg',
      colorIndex: 2
    };
  });

  it('should have a valid version number', () => {
    expect(message.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('avatar should be initially visible but without data', () => {
    expect(avatar.getAttribute('name')).to.be.null;
    expect(avatar.getAttribute('abbr')).to.be.null;
    expect(avatar.getAttribute('img')).to.be.null;
    expect(avatar.getAttribute('title')).to.be.equal('anonymous');
    expect(avatar.getAttribute('has-color-index')).to.be.null;
  });

  it('name should be initially empty', () => {
    expect(name.textContent.trim()).to.be.equal('');
  });

  it('time should be initially empty', () => {
    expect(time.textContent.trim()).to.be.equal('');
  });

  it('avatar should be set with provided user', () => {
    message.user = user;
    expect(avatar.getAttribute('name')).to.be.equal('Joan Doe');
    expect(avatar.getAttribute('abbr')).to.be.equal('JD');
    expect(avatar.getAttribute('img')).to.be.equal('/test/visual/avatars/avatar.jpg');
    expect(avatar.getAttribute('title')).to.be.equal('Joan Doe (JD)');
    expect(avatar.getAttribute('has-color-index')).to.be.not.null;
    expect(avatar.colorIndex).to.be.equal(2);
  });

  it('name should be set with provided user', () => {
    message.user = user;
    expect(name.textContent).to.be.equal('Joan Doe');
  });

  it('time should be set', () => {
    message.time = 'long ago';
    expect(time.textContent).to.be.equal('long ago');
  });

  it('content should be set', () => {
    const slot = content.querySelector('slot');
    const nodes = slot.assignedNodes({ flatten: true });
    expect(nodes[0].textContent).to.be.equal('Hello');
  });
});
