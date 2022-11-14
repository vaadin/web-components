import { expect } from '@esm-bundle/chai';
import { fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
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

    describe('focus', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('should focus on input click if not focused', async () => {
        const rect = input.getBoundingClientRect();
        const middleX = Math.floor(rect.x + rect.width / 2);
        const middleY = Math.floor(rect.y + rect.height / 2);
        await sendMouse({ type: 'click', position: [middleX, middleY] });
        expect(checkbox.hasAttribute('focused')).to.be.true;
      });
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

  describe('indeterminate property', () => {
    beforeEach(() => {
      checkbox = fixtureSync(`<vaadin-checkbox></vaadin-checkbox>`);
      input = checkbox.inputElement;
    });

    it('should delegate the property to the input', () => {
      checkbox.indeterminate = true;
      expect(input.indeterminate).to.be.true;

      checkbox.indeterminate = false;
      expect(input.indeterminate).to.be.false;
    });
  });
});
