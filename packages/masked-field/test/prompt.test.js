import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-masked-field.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.maskedFieldComponent = true;

/** Returns the overlay that the visual mask is rendered into. */
function promptNode(field) {
  return field.shadowRoot.querySelector('[part="prompt"]');
}

/** Returns the text of the invisible spacer holding the presented text. */
function spacerText(field) {
  return promptNode(field).firstElementChild.textContent;
}

/** Returns the shape shown past the presented text. */
function remainderText(field) {
  const prompt = promptNode(field);
  return prompt.textContent.slice(spacerText(field).length);
}

describe('prompt', () => {
  let field, input;

  beforeEach(() => {
    clearWarnings();
  });

  describe('mask', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-masked-field format-mask="00:00" format-prompt="_"></vaadin-masked-field>');
      await nextRender();
      input = field.inputElement;
      input.focus();
    });

    it('should show the whole shape of the mask while the field is empty', () => {
      expect(promptNode(field).textContent).to.equal('__:__');
      expect(spacerText(field)).to.equal('');
      expect(input.value).to.equal('');
      expect(field.value).to.equal('');
    });

    it('should not write the prompt into the input element or the value', async () => {
      await sendKeys({ type: '1' });

      expect(input.value).to.equal('1');
      expect(field.value).to.equal('1');
      expect(field.formattedValue).to.equal('1');
    });

    it('should move the shape along as the user types', async () => {
      await sendKeys({ type: '1' });

      expect(spacerText(field)).to.equal('1');
      expect(remainderText(field)).to.equal('_:__');
    });

    it('should toggle has-format-prompt attribute on the shape running out', async () => {
      expect(field.hasAttribute('has-format-prompt')).to.be.true;

      await sendKeys({ type: '1234' });

      expect(field.hasAttribute('has-format-prompt')).to.be.false;
    });
  });

  describe('optional section', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-masked-field format-mask="00000[-0000]" format-prompt="_"></vaadin-masked-field>');
      await nextRender();
      input = field.inputElement;
      input.focus();
    });

    it('should show the minimal expansion while the field is empty', () => {
      expect(remainderText(field)).to.equal('_____');
    });

    it('should show nothing once the minimal expansion is filled', async () => {
      await sendKeys({ type: '12345' });

      expect(remainderText(field)).to.equal('');
      expect(field.hasAttribute('has-format-prompt')).to.be.false;
    });

    it('should show the rest of the section once the user types into it', async () => {
      await sendKeys({ type: '123456' });

      expect(remainderText(field)).to.equal('___');
      expect(field.hasAttribute('has-format-prompt')).to.be.true;
    });

    it('should show nothing again once the section is left', async () => {
      await sendKeys({ type: '123456' });
      await sendKeys({ press: 'Backspace' });

      expect(remainderText(field)).to.equal('');
    });
  });

  describe('blocks', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-masked-field format-blocks="[4,4]" format-prompt="_"></vaadin-masked-field>');
      await nextRender();
      input = field.inputElement;
      input.focus();
    });

    it('should show nothing for a format that has no fixed shape', async () => {
      expect(remainderText(field)).to.equal('');
      expect(field.hasAttribute('has-format-prompt')).to.be.false;

      await sendKeys({ type: 'FI21' });

      expect(remainderText(field)).to.equal('');
      expect(field.hasAttribute('has-format-prompt')).to.be.false;
    });
  });

  describe('invalid prompt', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      field = fixtureSync('<vaadin-masked-field format-mask="00:00"></vaadin-masked-field>');
      await nextRender();
    });

    afterEach(() => {
      warn.restore();
    });

    it('should warn once and show nothing for a prompt longer than one character', async () => {
      field.formatPrompt = '__';
      await nextUpdate(field);

      field.value = '12';
      await nextUpdate(field);

      expect(warn).to.be.calledOnce;
      expect(warn.firstCall.args[0]).to.match(/formatPrompt/u);
      expect(remainderText(field)).to.equal('');
    });

    it('should show nothing and not warn for an empty prompt', async () => {
      field.formatPrompt = '';
      await nextUpdate(field);

      expect(warn).to.not.be.called;
      expect(remainderText(field)).to.equal('');
    });

    it('should show nothing once the mask is removed', async () => {
      field.formatPrompt = '_';
      await nextUpdate(field);
      expect(remainderText(field)).to.equal('__:__');

      field.formatMask = undefined;
      await nextUpdate(field);

      expect(remainderText(field)).to.equal('');
      expect(field.hasAttribute('has-format-prompt')).to.be.false;
    });
  });

  describe('placeholder', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-masked-field format-mask="00:00" format-prompt="_"></vaadin-masked-field>');
      await nextRender();
    });

    it('should hide the shape while the native placeholder is showing', async () => {
      field.placeholder = 'hh:mm';
      await nextUpdate(field);

      expect(getComputedStyle(promptNode(field)).display).to.equal('none');
    });

    it('should show the shape again once the field has a value', async () => {
      field.placeholder = 'hh:mm';
      field.value = '12';
      await nextUpdate(field);

      expect(getComputedStyle(promptNode(field)).display).to.not.equal('none');
    });

    it('should show the shape on an empty field with no placeholder', () => {
      expect(getComputedStyle(promptNode(field)).display).to.not.equal('none');
    });

    it('should show the shape while readonly and while disabled', async () => {
      field.value = '12';
      field.readonly = true;
      await nextUpdate(field);
      expect(getComputedStyle(promptNode(field)).display).to.not.equal('none');

      field.readonly = false;
      field.disabled = true;
      await nextUpdate(field);
      expect(getComputedStyle(promptNode(field)).display).to.not.equal('none');
    });
  });

  describe('geometry', () => {
    beforeEach(async () => {
      field = fixtureSync(`
        <vaadin-masked-field format-mask="00:00" format-prompt="_">
          <span slot="prefix">+358</span>
        </vaadin-masked-field>
      `);
      await nextRender();
      await nextResize(field);
      input = field.inputElement;
    });

    it('should lay the shape over the input element moved by the prefix', () => {
      const promptRect = promptNode(field).getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      expect(promptRect.left).to.be.closeTo(inputRect.left, 1);
      expect(promptRect.width).to.be.closeTo(inputRect.width, 1);
    });

    it('should leave the value alone', () => {
      expect(field.value).to.equal('');
      expect(field.formattedValue).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should lay the shape over the input element moved by a prefix added later', async () => {
      const plain = fixtureSync('<vaadin-masked-field format-mask="00:00" format-prompt="_"></vaadin-masked-field>');
      await nextRender();

      plain.appendChild(Object.assign(document.createElement('span'), { slot: 'prefix', textContent: '+358' }));
      await nextResize(plain.inputElement);

      const promptRect = promptNode(plain).getBoundingClientRect();
      const inputRect = plain.inputElement.getBoundingClientRect();

      expect(promptRect.left).to.be.closeTo(inputRect.left, 1);
      expect(promptRect.width).to.be.closeTo(inputRect.width, 1);
    });
  });
});
