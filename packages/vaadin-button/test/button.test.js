import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  arrowDownKeyDown,
  enterKeyDown,
  enterKeyUp,
  fixtureSync,
  isIOS,
  mousedown,
  mouseup,
  spaceKeyDown,
  spaceKeyUp,
  touchstart,
  touchend
} from '@vaadin/testing-helpers';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '../vaadin-button.js';

describe('vaadin-button', () => {
  let vaadinButton, nativeButton, label;

  beforeEach(() => {
    vaadinButton = fixtureSync('<vaadin-button>Vaadin <i>Button</i></vaadin-button>');
    nativeButton = vaadinButton.shadowRoot.querySelector('button');
    label = vaadinButton.shadowRoot.querySelector('[part=label]');
  });

  it('should have a valid version number', () => {
    expect(vaadinButton.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('should define button label using light DOM', () => {
    const children = FlattenedNodesObserver.getFlattenedNodes(label);
    expect(children[1].textContent).to.be.equal('Vaadin ');
    expect(children[2].outerHTML).to.be.equal('<i>Button</i>');
  });

  it('can be disabled imperatively', () => {
    vaadinButton.disabled = true;
    expect(nativeButton.hasAttribute('disabled')).to.be.eql(true);
  });

  it('should fire click event', () => {
    const spy = sinon.spy();
    vaadinButton.addEventListener('click', spy);
    vaadinButton.click();
    expect(spy.calledOnce).to.be.true;
  });

  it('should not fire click event when disabled', () => {
    const spy = sinon.spy();
    vaadinButton.addEventListener('click', spy);
    vaadinButton.disabled = true;
    vaadinButton.click();
    expect(spy.called).to.be.false;
  });

  it('host should have the `button` role', () => {
    expect(vaadinButton.getAttribute('role')).to.be.eql('button');
  });

  it('native button should have type="button"', () => {
    expect(nativeButton.getAttribute('type')).to.be.eql('button');
  });

  it('native button should have the `presentation` role', () => {
    expect(nativeButton.getAttribute('role')).to.be.eql('presentation');
  });

  (isIOS ? it.skip : it)('should have active attribute on mousedown', () => {
    mousedown(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  (isIOS ? it.skip : it)('should not have active attribute after mouseup', () => {
    mousedown(vaadinButton);
    mouseup(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on touchstart', () => {
    touchstart(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after touchend', () => {
    touchstart(vaadinButton);
    touchend(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on enter', () => {
    enterKeyDown(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after enter', () => {
    enterKeyDown(vaadinButton);
    enterKeyUp(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    spaceKeyDown(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    spaceKeyDown(vaadinButton);
    spaceKeyUp(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute on arrow key', () => {
    arrowDownKeyDown(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disabled', () => {
    vaadinButton.disabled = true;
    mousedown(vaadinButton);
    enterKeyDown(vaadinButton);
    spaceKeyDown(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disconnected from the DOM', () => {
    spaceKeyDown(vaadinButton);
    vaadinButton.parentNode.removeChild(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute after blur', () => {
    spaceKeyDown(vaadinButton);
    vaadinButton.dispatchEvent(new CustomEvent('blur'));
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });
});
