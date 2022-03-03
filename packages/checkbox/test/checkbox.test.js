import { expect } from '@esm-bundle/chai';
import { fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-checkbox.js';

describe('checkbox', () => {
  let checkbox, input, label, link;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
      tagName = checkbox.tagName.toLowerCase();
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
      checkbox = fixtureSync(`
        <vaadin-checkbox>
          <label slot="label">I accept <a href="#">the terms and conditions</a></label>
        </vaadin-checkbox>
      `);
      // Wait for MutationObserver.
      await nextFrame();
      input = checkbox.inputElement;
      label = checkbox._labelNode;
      link = label.children[0];
    });

    // TODO: A legacy test. Replace with snapshot tests when possible.
    it('should display the label', () => {
      expect(label.textContent).to.equal('I accept the terms and conditions');
    });

    // TODO: A legacy test. Replace with snapshot tests when possible.
    it('should be possible to disabled imperatively', () => {
      checkbox.disabled = true;
      expect(input.hasAttribute('disabled')).to.be.true;
    });

    // TODO: A legacy test. Replace with snapshot tests when possible.
    it('should set value property to "on"', () => {
      expect(checkbox.value).to.equal('on');
    });

    // TODO: A legacy test. Replace with snapshot tests when possible.
    it('should set input value property to "on"', () => {
      expect(input.value).to.equal('on');
    });

    // TODO: A legacy test. Replace with snapshot tests when possible.
    it('should set the name to the empty string', () => {
      expect(checkbox.name).to.equal('');
    });

    it('should have display: none when hidden', () => {
      checkbox.setAttribute('hidden', '');
      expect(getComputedStyle(checkbox).display).to.equal('none');
    });

    it('should toggle checked property on input click', () => {
      input.click();
      expect(checkbox.checked).to.be.true;

      input.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should toggle checked property on label click', () => {
      label.click();
      expect(checkbox.checked).to.be.true;

      label.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should not toggle checked property on label link click', () => {
      link.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should not toggle checked property on click when disabled', () => {
      checkbox.disabled = true;
      checkbox.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should reset indeterminate attribute on first click', () => {
      checkbox.indeterminate = true;
      expect(checkbox.indeterminate).to.be.true;

      checkbox.click();
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should be checked on Space press when initially checked is false and indeterminate is true', async () => {
      checkbox.checked = false;
      checkbox.indeterminate = true;

      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(checkbox.checked).to.be.true;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should not be checked on Space press when initially checked is true and indeterminate is true', async () => {
      checkbox.checked = true;
      checkbox.indeterminate = true;

      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(checkbox.checked).to.be.false;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should be checked on click when initially checked is false and indeterminate is true', () => {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      checkbox.click();

      expect(checkbox.checked).to.be.true;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should not be checked on click when initially checked is true and indeterminate is true', () => {
      checkbox.checked = true;
      checkbox.indeterminate = true;
      checkbox.click();

      expect(checkbox.checked).to.be.false;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should remove has-label attribute when the label was cleared', async () => {
      label.innerHTML = '';
      await nextFrame();

      expect(checkbox.hasAttribute('has-input')).to.be.false;
    });

    describe('active attribute', () => {
      it('should set active attribute during input click', () => {
        mousedown(input);
        expect(checkbox.hasAttribute('active')).to.be.true;

        mouseup(input);
        expect(checkbox.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute during label link click', () => {
        mousedown(link);
        expect(checkbox.hasAttribute('active')).to.be.false;
      });

      it('should set active attribute during Space press on the input', async () => {
        // Focus on the input
        await sendKeys({ press: 'Tab' });
        // Hold down Space on the input
        await sendKeys({ down: 'Space' });
        expect(checkbox.hasAttribute('active')).to.be.true;

        // Release Space on the input
        await sendKeys({ up: 'Space' });
        expect(checkbox.hasAttribute('active')).to.be.false;
      });
    });

    describe('change event', () => {
      let changeSpy;

      beforeEach(() => {
        changeSpy = sinon.spy();
        checkbox.addEventListener('change', changeSpy);
      });

      it('should not fire change event when changing checked state programmatically', () => {
        checkbox.checked = true;

        expect(changeSpy.called).to.be.false;
      });

      it('should fire change event on input click', () => {
        input.click();
        expect(changeSpy.calledOnce).to.be.true;

        input.click();
        expect(changeSpy.calledTwice).to.be.true;
      });

      it('should fire change event on label click', () => {
        label.click();
        expect(changeSpy.calledOnce).to.be.true;

        label.click();
        expect(changeSpy.calledTwice).to.be.true;
      });

      it('should not fire change event on label link click', () => {
        link.click();
        expect(changeSpy.called).to.be.false;
      });

      it('should bubble', () => {
        checkbox.click();

        const event = changeSpy.firstCall.args[0];
        expect(event).to.have.property('bubbles', true);
      });

      it('should not be composed', () => {
        checkbox.click();

        const event = changeSpy.firstCall.args[0];
        expect(event).to.have.property('composed', false);
      });
    });
  });

  describe('has-label attribute', () => {
    beforeEach(() => {
      checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
    });

    it('should not set has-label attribute when label content is empty', () => {
      expect(checkbox.hasAttribute('has-label')).to.be.false;
    });

    it('should not set has-label attribute when only one empty text node added', async () => {
      const textNode = document.createTextNode(' ');
      checkbox.appendChild(textNode);
      await nextFrame();
      expect(checkbox.hasAttribute('has-label')).to.be.false;
    });

    it('should set has-label attribute when the label is added', async () => {
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Added label';
      checkbox.appendChild(paragraph);
      await nextFrame();
      expect(checkbox.hasAttribute('has-label')).to.be.true;
    });
  });

  describe('delegation', () => {
    describe('name attribute', () => {
      beforeEach(() => {
        checkbox = fixtureSync(`<vaadin-checkbox name="Name"></vaadin-checkbox>`);
        input = checkbox.inputElement;
      });

      it('should delegate name attribute to the input', () => {
        expect(input.getAttribute('name')).to.equal('Name');

        checkbox.removeAttribute('name');
        expect(input.hasAttribute('name')).to.be.false;
      });
    });

    describe('indeterminate property', () => {
      beforeEach(() => {
        checkbox = fixtureSync(`<vaadin-checkbox indeterminate></vaadin-checkbox>`);
        input = checkbox.inputElement;
      });

      it('should delegate indeterminate property to the input', () => {
        expect(input.indeterminate).to.be.true;

        checkbox.indeterminate = false;
        expect(input.indeterminate).to.be.false;
      });
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
      fixtureSync('<vaadin-checkbox>label</vaadin-checkbox>');
      await nextFrame();

      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.include(
        'WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.'
      );
    });
  });
});
