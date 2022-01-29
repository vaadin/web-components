import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-lit-radio-button.js';
import '../vaadin-radio-button.js';

const runTests = (tag) => {
  const updateComplete = () => (tag.includes('lit') ? radio.updateComplete : Promise.resolve());

  let radio, input, label;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      radio = fixtureSync(`<${tag}></${tag}>`);
      tagName = radio.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('default', () => {
    beforeEach(async () => {
      radio = fixtureSync(`<${tag}>Label</${tag}>`);
      // Wait for MutationObserver
      await updateComplete();
      label = radio.querySelector('[slot=label]');
    });

    it('should set checked property to false', () => {
      expect(radio.checked).to.be.false;
    });

    it('should set name property to the empty string', () => {
      expect(radio.name).to.equal('');
    });

    it('should set value property to "on"', () => {
      expect(radio.value).to.equal('on');
    });
  });

  describe('native input', () => {
    beforeEach(async () => {
      radio = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      input = radio.querySelector('[slot=input]');
      label = radio.querySelector('[slot=label]');
    });

    it('should set input checked to false by default', () => {
      expect(input.checked).to.be.false;
    });

    it('should set checked property on input click', () => {
      input.click();
      expect(radio.checked).to.be.true;
    });

    it('should set checked property on label click', () => {
      label.click();
      expect(radio.checked).to.be.true;
    });

    it('should set checked property on Space press on the input', async () => {
      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(radio.checked).to.be.true;
    });

    it('should set checked property on input change', () => {
      input.checked = true;
      fire(input, 'change');
      expect(radio.checked).to.be.true;
    });

    it('should dispatch click event on host click', () => {
      const spy = sinon.spy();
      input.addEventListener('click', spy);
      radio.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
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

  describe('disabled attribute', () => {
    beforeEach(async () => {
      radio = fixtureSync(`<${tag} disabled></${tag}>`);
      await updateComplete();
      input = radio.querySelector('[slot=input]');
      label = radio.querySelector('[slot=label]');
    });

    it('should not set checked property on input click', () => {
      input.click();
      expect(radio.checked).to.be.false;
    });

    it('should not set checked property on label click', () => {
      label.click();
      expect(radio.checked).to.be.false;
    });

    it('should not set checked property on Space press on the input', async () => {
      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(radio.checked).to.be.false;
    });
  });

  // TODO: A legacy suit. Replace with snapshot tests when possible.
  describe('active attribute', () => {
    beforeEach(async () => {
      radio = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      input = radio.querySelector('[slot=input]');
    });

    it('should set active attribute during input click', () => {
      mousedown(input);
      expect(radio.hasAttribute('active')).to.be.true;

      mouseup(input);
      expect(radio.hasAttribute('active')).to.be.false;
    });

    it('should set active attribute during Space press on the input', async () => {
      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Hold down Space on the input
      await sendKeys({ down: 'Space' });
      expect(radio.hasAttribute('active')).to.be.true;

      // Release Space on the input
      await sendKeys({ up: 'Space' });
      expect(radio.hasAttribute('active')).to.be.false;
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(async () => {
      radio = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      label = radio.querySelector('[slot=label]');
      input = radio.querySelector('[slot=input]');

      spy = sinon.spy();
      radio.addEventListener('change', spy);
    });

    it('should fire on input click', () => {
      input.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire on label click', () => {
      label.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire on Space press on the input', async () => {
      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire on programmatic toggle', async () => {
      radio.checked = true;
      await updateComplete();
      expect(spy.called).to.be.false;
    });

    it('should not fire on input click when checked', async () => {
      radio.checked = true;
      await updateComplete();
      input.click();
      expect(spy.called).to.be.false;
    });

    it('should not fire on label click when checked', async () => {
      radio.checked = true;
      await updateComplete();
      label.click();
      expect(spy.called).to.be.false;
    });

    it('should bubble', () => {
      input.click();
      const event = spy.firstCall.args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      input.click();
      const event = spy.firstCall.args[0];
      expect(event).to.have.property('composed', false);
    });
  });

  describe('delegation', () => {
    describe('name attribute', () => {
      beforeEach(async () => {
        radio = fixtureSync(`<${tag} name="Name"></${tag}>`);
        await updateComplete();
        input = radio.querySelector('[slot=input]');
      });

      it('should delegate name attribute to the input', async () => {
        expect(input.getAttribute('name')).to.equal('Name');

        radio.removeAttribute('name');
        await updateComplete();
        expect(input.hasAttribute('name')).to.be.false;
      });
    });
  });

  describe('has-label attribute', () => {
    beforeEach(async () => {
      radio = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
    });

    it('should not set has-label attribute when label content is empty', () => {
      expect(radio.hasAttribute('has-label')).to.be.false;
    });

    it('should not set has-label attribute when only one empty text node added', async () => {
      const textNode = document.createTextNode(' ');
      radio.appendChild(textNode);
      await nextFrame();
      expect(radio.hasAttribute('has-label')).to.be.false;
    });

    it('should set has-label attribute when the label is added', async () => {
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Added label';
      radio.appendChild(paragraph);
      await nextFrame();
      expect(radio.hasAttribute('has-label')).to.be.true;
    });
  });

  describe('warnings', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn about using default slot label', async () => {
      radio = fixtureSync(`<${tag}>label</${tag}>`);
      // Wait for MutationObserver
      await nextFrame();

      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.include(
        'WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-radio-button> is deprecated.'
      );
    });
  });
};

describe('RadioButton + Polymer', () => {
  runTests('vaadin-radio-button');
});

describe('RadioButton + Lit', () => {
  runTests('vaadin-lit-radio-button');
});
