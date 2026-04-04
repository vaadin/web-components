import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, mouseup, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-toggle-switch.js';

describe('toggle-switch', () => {
  let toggle, input, label, link;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      toggle = fixtureSync('<vaadin-toggle-switch></vaadin-toggle-switch>');
      tagName = toggle.tagName.toLowerCase();
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
      toggle = fixtureSync(`
        <vaadin-toggle-switch>
          <label slot="label">Enable <a href="#">notifications</a></label>
        </vaadin-toggle-switch>
      `);
      await nextRender();
      input = toggle.inputElement;
      label = toggle._labelNode;
      link = label.children[0];
    });

    it('should have input with type checkbox', () => {
      expect(input.type).to.equal('checkbox');
    });

    it('should have input with role switch', () => {
      expect(input.getAttribute('role')).to.equal('switch');
    });

    it('should have display: none when hidden', () => {
      toggle.setAttribute('hidden', '');
      expect(getComputedStyle(toggle).display).to.equal('none');
    });

    it('should toggle checked property on input click', () => {
      input.click();
      expect(toggle.checked).to.be.true;

      input.click();
      expect(toggle.checked).to.be.false;
    });

    it('should toggle checked property on label click', () => {
      label.click();
      expect(toggle.checked).to.be.true;

      label.click();
      expect(toggle.checked).to.be.false;
    });

    it('should toggle checked property on required indicator click', () => {
      const indicator = toggle.shadowRoot.querySelector('[part="required-indicator"]');
      indicator.click();
      expect(toggle.checked).to.be.true;

      indicator.click();
      expect(toggle.checked).to.be.false;
    });

    it('should not toggle checked property on label link click', () => {
      link.click();
      expect(toggle.checked).to.be.false;
    });

    it('should not toggle checked property on click when disabled', async () => {
      toggle.disabled = true;
      await nextUpdate(toggle);
      toggle.click();
      expect(toggle.checked).to.be.false;
    });

    describe('readonly', () => {
      it('should not toggle checked property on click when readonly', async () => {
        toggle.readonly = true;
        await nextUpdate(toggle);
        input.click();
        expect(toggle.checked).to.be.false;
      });

      it('should update input aria-readonly on readonly property change', async () => {
        toggle.readonly = true;
        await nextUpdate(toggle);
        expect(input.getAttribute('aria-readonly')).to.equal('true');

        toggle.readonly = false;
        await nextUpdate(toggle);
        expect(input.hasAttribute('aria-readonly')).to.be.false;
      });
    });

    describe('focus', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('should focus on input click when not focused yet', async () => {
        await sendMouseToElement({ type: 'click', element: input });
        expect(toggle.hasAttribute('focused')).to.be.true;
      });

      it('should keep focus on input click when already focused', async () => {
        const spy = sinon.spy();
        toggle.addEventListener('focusout', spy);
        input.focus();
        await sendMouseToElement({ type: 'click', element: input });
        expect(spy).to.be.not.called;
      });
    });

    describe('active attribute', () => {
      it('should set active attribute during input click', () => {
        mousedown(input);
        expect(toggle.hasAttribute('active')).to.be.true;

        mouseup(input);
        expect(toggle.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute during label link click', () => {
        mousedown(link);
        expect(toggle.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on mousedown when readonly', async () => {
        toggle.readonly = true;
        await nextUpdate(toggle);
        mousedown(link);
        expect(toggle.hasAttribute('active')).to.be.false;
      });

      it('should set active attribute during Space press on the input', async () => {
        // Focus on the input
        await sendKeys({ press: 'Tab' });
        // Hold down Space on the input
        await sendKeys({ down: 'Space' });
        expect(toggle.hasAttribute('active')).to.be.true;

        // Release Space on the input
        await sendKeys({ up: 'Space' });
        expect(toggle.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on helper element click', async () => {
        toggle.helperText = 'Helper';
        await nextFrame();
        mousedown(toggle.querySelector('[slot="helper"]'));
        expect(toggle.hasAttribute('active')).to.be.false;
      });

      it('should not set active attribute on error message element click', async () => {
        toggle.errorMessage = 'Error';
        toggle.invalid = true;
        await nextFrame();
        mousedown(toggle.querySelector('[slot="error-message"]'));
        expect(toggle.hasAttribute('active')).to.be.false;
      });
    });

    describe('change event', () => {
      let changeSpy;

      beforeEach(() => {
        changeSpy = sinon.spy();
        toggle.addEventListener('change', changeSpy);
      });

      it('should not fire change event when changing checked state programmatically', () => {
        toggle.checked = true;

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
        toggle.click();

        const event = changeSpy.firstCall.args[0];
        expect(event).to.have.property('bubbles', true);
      });

      it('should not be composed', () => {
        toggle.click();

        const event = changeSpy.firstCall.args[0];
        expect(event).to.have.property('composed', false);
      });
    });
  });

  describe('opacity', () => {
    beforeEach(async () => {
      toggle = fixtureSync(`<vaadin-toggle-switch></vaadin-toggle-switch>`);
      await nextRender();
      input = toggle.inputElement;
    });

    it('should apply opacity: 0 on the slotted input', () => {
      // Emulate CSS normalize styles like used by Tailwind
      fixtureSync(`
        <style>
          input {
            opacity: 1;
          }
        </script>
      `);
      expect(getComputedStyle(input).opacity).to.equal('0');
    });
  });
});
