import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import {
  fixtureSync,
  middleOfNode,
  mousedown,
  mouseup,
  nextFrame,
  nextRender,
  nextUpdate,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-checkbox.js';

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
      await nextRender();
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

    it('should toggle checked property on required indicator click', () => {
      const indicator = checkbox.shadowRoot.querySelector('[part="required-indicator"]');
      indicator.click();
      expect(checkbox.checked).to.be.true;

      indicator.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should not cover the label link with the input', () => {
      const { x, y } = middleOfNode(link);
      expect(document.elementFromPoint(x, y)).to.equal(link);
    });

    it('should not toggle checked property on label link click', () => {
      link.click();
      expect(checkbox.checked).to.be.false;
    });

    it('should not toggle checked property on click when disabled', async () => {
      checkbox.disabled = true;
      await nextUpdate(checkbox);
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
      await nextUpdate(checkbox);

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
      await nextUpdate(checkbox);

      // Focus on the input
      await sendKeys({ press: 'Tab' });
      // Press Space on the input
      await sendKeys({ press: 'Space' });

      expect(checkbox.checked).to.be.false;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should be checked on click when initially checked is false and indeterminate is true', async () => {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      await nextUpdate(checkbox);

      checkbox.click();

      expect(checkbox.checked).to.be.true;
      expect(checkbox.indeterminate).to.be.false;
    });

    it('should not be checked on click when initially checked is true and indeterminate is true', async () => {
      checkbox.checked = true;
      checkbox.indeterminate = true;
      await nextUpdate(checkbox);

      checkbox.click();

      expect(checkbox.checked).to.be.false;
      expect(checkbox.indeterminate).to.be.false;
    });

    describe('readonly', () => {
      it('should not toggle checked property on click when readonly', async () => {
        checkbox.readonly = true;
        await nextUpdate(checkbox);
        input.click();
        expect(checkbox.checked).to.be.false;
      });

      it('should update input aria-readonly on readonly property change', async () => {
        checkbox.readonly = true;
        await nextUpdate(checkbox);
        expect(input.getAttribute('aria-readonly')).to.equal('true');

        checkbox.readonly = false;
        await nextUpdate(checkbox);
        expect(input.hasAttribute('aria-readonly')).to.be.false;
      });
    });

    describe('focus', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('should focus on checkbox part click when not focused yet', async () => {
        await sendMouseToElement({ type: 'click', element: checkbox.shadowRoot.querySelector('[part="checkbox"]') });
        expect(checkbox.hasAttribute('focused')).to.be.true;
      });

      it('should keep focus on checkbox part click when already focused', async () => {
        const spy = sinon.spy();
        checkbox.addEventListener('focusout', spy);
        input.focus();
        await sendMouseToElement({ type: 'click', element: checkbox.shadowRoot.querySelector('[part="checkbox"]') });
        expect(spy).to.be.not.called;
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

      it('should not set active attribute on mousedown when readonly', async () => {
        checkbox.readonly = true;
        await nextUpdate(checkbox);
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

      it('should not set active attribute on helper element click', async () => {
        checkbox.helperText = 'Helper';
        await nextFrame();
        mousedown(checkbox.querySelector('[slot="helper"]'));
        expect(checkbox.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on helper element click after custom label is removed', async () => {
        label.remove();
        checkbox.helperText = 'Helper';
        await nextFrame();
        mousedown(checkbox.querySelector('[slot="helper"]'));
        expect(checkbox.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on error message element click', async () => {
        checkbox.errorMessage = 'Error';
        checkbox.invalid = true;
        await nextFrame();
        mousedown(checkbox.querySelector('[slot="error-message"]'));
        expect(checkbox.hasAttribute('active')).to.be.false;
      });

      it('should set active attribute on required indicator mousedown', () => {
        mousedown(checkbox.shadowRoot.querySelector('[part="required-indicator"]'));
        expect(checkbox.hasAttribute('active')).to.be.true;
      });

      it('should not set active attribute when clicking empty space below the checkbox', () => {
        mousedown(checkbox);
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
    beforeEach(async () => {
      checkbox = fixtureSync(`<vaadin-checkbox></vaadin-checkbox>`);
      await nextRender();
      input = checkbox.inputElement;
    });

    it('should delegate the property to the input', async () => {
      checkbox.indeterminate = true;
      await nextUpdate(checkbox);
      expect(input.indeterminate).to.be.true;

      checkbox.indeterminate = false;
      await nextUpdate(checkbox);
      expect(input.indeterminate).to.be.false;
    });
  });

  describe('input styles', () => {
    beforeEach(async () => {
      checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
      await nextRender();
      input = checkbox.inputElement;
    });

    it('should apply opacity: 0 on the slotted input', () => {
      // Emulate CSS normalize styles like used by Tailwind
      fixtureSync(`
        <style>
          input {
            opacity: 1;
          }
        </style>
      `);
      expect(getComputedStyle(input).opacity).to.equal('0');
    });

    it('should stretch the slotted input over the checkbox part', () => {
      // Emulate fixed size set by iOS UA styles or CSS resets
      fixtureSync(`
        <style>
          input {
            width: 1rem;
            height: 1rem;
          }
        </style>
      `);
      const inputRect = input.getBoundingClientRect();
      const partRect = checkbox.shadowRoot.querySelector("[part='checkbox']").getBoundingClientRect();
      expect(inputRect.width).to.be.at.least(partRect.width);
      expect(inputRect.height).to.be.at.least(partRect.height);
    });

    [undefined, 'reverse'].forEach((theme) => {
      it(`should make the slotted input at least 24px wide and high${theme ? ` in ${theme} theme` : ''}`, async () => {
        if (theme) {
          checkbox.setAttribute('theme', theme);
          await nextRender();
        }
        const rect = input.getBoundingClientRect();
        expect(rect.width).to.be.at.least(24);
        expect(rect.height).to.be.at.least(24);
      });
    });
  });

  describe('click target', () => {
    let label;

    beforeEach(async () => {
      checkbox = fixtureSync(`
        <vaadin-checkbox required helper-text="Helper" style="width: 400px">
          <label slot="label">Label</label>
        </vaadin-checkbox>
      `);
      await nextRender();
      input = checkbox.inputElement;
      label = checkbox.querySelector('label');
    });

    [undefined, 'reverse'].forEach((theme) => {
      it(`should cover the empty space next to the label with the input${theme ? ` in ${theme} theme` : ''}`, async () => {
        if (theme) {
          checkbox.setAttribute('theme', theme);
          await nextRender();
        }
        const { x } = middleOfNode(checkbox);
        const { y } = middleOfNode(label);
        expect(document.elementFromPoint(x, y)).to.equal(input);
      });
    });

    it('should not cover the label with the input', () => {
      const { x, y } = middleOfNode(label);
      expect(document.elementFromPoint(x, y)).to.equal(label);
    });

    it('should not cover the helper text row with the input', () => {
      const helper = checkbox.querySelector('[slot="helper"]');
      const { x, y } = middleOfNode(helper);
      expect(document.elementFromPoint(x, y)).to.equal(helper);
    });

    it('should not let the label receive pointer events when an ancestor disables them', () => {
      // Modal overlays set pointer-events: none on the body
      document.body.style.pointerEvents = 'none';
      try {
        const { x, y } = middleOfNode(label);
        expect(document.elementFromPoint(x, y)).to.not.be.oneOf([checkbox, input, label]);
      } finally {
        document.body.style.pointerEvents = '';
      }
    });

    // Placed last, as a real mouse click in WebKit moves the starting point of Tab navigation in later tests
    describe('real mouse', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('should toggle checked property and set active attribute on mouse press on the empty space next to the label', async () => {
        const spy = sinon.spy();
        checkbox.addEventListener('click', spy);
        const { x } = middleOfNode(checkbox);
        const { y } = middleOfNode(label);
        await sendMouse({ type: 'move', position: [Math.round(x), Math.round(y)] });
        await sendMouse({ type: 'down' });
        expect(checkbox.hasAttribute('active')).to.be.true;

        await sendMouse({ type: 'up' });
        expect(checkbox.hasAttribute('active')).to.be.false;
        expect(checkbox.checked).to.be.true;
        expect(spy).to.be.calledOnce;
      });
    });
  });
});
