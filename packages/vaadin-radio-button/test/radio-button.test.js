import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { keyDownOn, keyUpOn, touchstart, touchend } from '@polymer/iron-test-helpers/mock-interactions.js';
import { down, up } from './helpers.js';
import '../vaadin-radio-button.js';

describe('radio-button', () => {
  let radio;

  beforeEach(() => {
    radio = fixtureSync('<vaadin-radio-button name="test-radio">Radio button</vaadin-radio-button>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = radio.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });

    it('should have a valid version number', () => {
      expect(customElements.get(tagName).version).to.be.ok;
    });
  });

  describe('native input', () => {
    let input;

    beforeEach(() => {
      input = radio.shadowRoot.querySelector('input');
    });

    it('should propagate checked to the native input', () => {
      radio.checked = true;
      expect(input.checked).to.be.true;
    });

    it('should set checked on native input change', () => {
      input.checked = true;
      input.dispatchEvent(new CustomEvent('change'));
      expect(radio.checked).to.be.true;
    });

    it('should propagate disabled to the native input', () => {
      radio.disabled = true;
      expect(input.disabled).to.be.true;
    });

    it('should dispatch click event on host click', () => {
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      radio.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.getCall(0).args[0];
      expect(event).to.be.instanceof(MouseEvent);
    });

    it('should not dispatch click event when disabled', () => {
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      radio.disabled = true;
      radio.click();
      expect(spy.called).to.be.false;
    });
  });

  describe('name property', () => {
    it('should contain empty string when unchecked', () => {
      expect(radio.name).to.equal('');
    });

    it('should contain attribute value when checked', () => {
      radio.checked = true;
      expect(radio.name).to.equal('test-radio');
    });
  });

  describe('checked property', () => {
    it('should set checked on host click', () => {
      radio.click();
      expect(radio.checked).to.be.true;
    });

    it('should set checked on mouseup', () => {
      down(radio);
      up(radio);
      expect(radio.checked).to.be.true;
    });

    const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should set checked on touchend', () => {
      touchstart(radio);
      touchend(radio);
      expect(radio.checked).to.be.true;
    });

    it('should set checked on space keyup', () => {
      keyDownOn(radio, 32);
      keyUpOn(radio, 32);
      expect(radio.checked).to.be.true;
    });
  });

  describe('disabled property', () => {
    beforeEach(() => {
      radio.disabled = true;
    });

    it('should not set checked on click when disabled', () => {
      radio.click();
      expect(radio.checked).to.be.false;
    });

    it('should not set checked on mouseup when disabled', () => {
      down(radio);
      up(radio);
      expect(radio.checked).to.be.false;
    });

    const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should not set checked on touchend when disabled', () => {
      touchstart(radio);
      touchend(radio);
      expect(radio.checked).to.be.false;
    });

    it('should not set checked on space keyup when disabled', () => {
      keyDownOn(radio, 32);
      keyUpOn(radio, 32);
      expect(radio.checked).to.be.false;
    });
  });

  describe('active attribute', () => {
    it('should have active attribute on space keydown', () => {
      keyDownOn(radio, 32);
      expect(radio.hasAttribute('active')).to.be.true;
    });

    it('should not have active attribute on space keyup', () => {
      keyDownOn(radio, 32);
      keyUpOn(radio, 32);
      expect(radio.hasAttribute('active')).to.be.false;
    });
  });

  describe('click method', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(radio, 'click');
    });

    it('should be called on mouseup', () => {
      down(radio);
      up(radio);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not be called on mouseup when checked', () => {
      radio.checked = true;
      down(radio);
      up(radio);
      expect(spy.called).to.be.false;
    });

    it('should not be called on mouseup when disabled', () => {
      radio.disabled = true;
      down(radio);
      up(radio);
      expect(spy.called).to.be.false;
    });

    it('should be called on space keyup', () => {
      keyDownOn(radio, 32);
      keyUpOn(radio, 32);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not be called on space keyup when disabled', () => {
      radio.disabled = true;
      keyDownOn(radio, 32);
      keyUpOn(radio, 32);
      expect(spy.called).to.be.false;
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      radio.addEventListener('change', spy);
    });

    it('should fire on click', () => {
      radio.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire on mouseup', () => {
      down(radio);
      up(radio);
      expect(spy.calledOnce).to.be.true;
    });

    const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should fire on touchend', () => {
      touchstart(radio);
      touchend(radio);
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire on space keyup', () => {
      keyDownOn(radio, 32);
      expect(spy.called).to.be.false;
      keyUpOn(radio, 32);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire on programmatic toggle', () => {
      radio.checked = true;
      expect(spy.called).to.be.false;
    });

    it('should not fire when checked', () => {
      radio.checked = true;
      radio.click();
      expect(spy.called).to.be.false;
    });

    it('should bubble', () => {
      radio.click();
      const event = spy.getCall(0).args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      radio.click();
      const event = spy.getCall(0).args[0];
      expect(event).to.have.property('composed', false);
    });
  });

  describe('ARIA', () => {
    it('should have proper role', () => {
      expect(radio.getAttribute('role')).to.eq('radio');
    });

    it('should set aria-checked to false by default', () => {
      expect(radio.getAttribute('aria-checked')).to.equal('false');
    });

    it('should set aria-checked to true when checked', () => {
      radio.checked = true;
      expect(radio.getAttribute('aria-checked')).to.equal('true');
    });
  });
});

describe('label part', () => {
  let radio, label;

  beforeEach(() => {
    radio = fixtureSync('<vaadin-radio-button></vaadin-radio-button>');
    label = radio.shadowRoot.querySelector('[part="label"]');
  });

  it('should have empty attribute when there is no label', () => {
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should have empty attribute when there is only one empty text node', async () => {
    const textNode = document.createTextNode(' ');
    radio.appendChild(textNode);
    await nextFrame();
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should not have empty attribute when the label is added', async () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Added label';
    radio.appendChild(paragraph);
    await nextFrame();
    expect(label.hasAttribute('empty')).to.be.false;
  });

  it('should restore empty attribute when the label is removed', async () => {
    radio.textContent = 'Radio button';
    await nextFrame();
    while (radio.firstChild) {
      radio.removeChild(radio.firstChild);
    }
    await nextFrame();
    const label = radio.shadowRoot.querySelector('[part="label"]');
    expect(label.hasAttribute('empty')).to.be.true;
  });
});
