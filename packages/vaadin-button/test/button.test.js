import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { downAndUp, keyDownOn, keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '../vaadin-button.js';

describe('vaadin-button', () => {
  const down = (node) => {
    node.dispatchEvent(new CustomEvent('down'));
  };

  const up = (node) => {
    node.dispatchEvent(new CustomEvent('up'));
  };

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

  it('fires click event', (done) => {
    vaadinButton.addEventListener('click', () => {
      done();
    });
    downAndUp(vaadinButton);
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

  it('should have active attribute on down', () => {
    down(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after up', () => {
    down(vaadinButton);
    up(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on enter', () => {
    keyDownOn(vaadinButton, 13);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after enter', () => {
    keyDownOn(vaadinButton, 13);
    keyUpOn(vaadinButton, 13);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    keyDownOn(vaadinButton, 32);
    expect(vaadinButton.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    keyDownOn(vaadinButton, 32);
    keyUpOn(vaadinButton, 32);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute on arrow key', () => {
    keyDownOn(vaadinButton, 37);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disabled', () => {
    vaadinButton.disabled = true;
    down(vaadinButton);
    keyDownOn(vaadinButton, 13);
    keyDownOn(vaadinButton, 32);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute when disconnected from the DOM', () => {
    keyDownOn(vaadinButton, 32);
    vaadinButton.parentNode.removeChild(vaadinButton);
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });

  it('should not have active attribute after blur', () => {
    keyDownOn(vaadinButton, 32);
    vaadinButton.dispatchEvent(new CustomEvent('blur'));
    expect(vaadinButton.hasAttribute('active')).to.be.false;
  });
});
