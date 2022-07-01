import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@polymer/polymer/lib/elements/dom-bind.js';
import '../vaadin-checkbox-group.js';

describe('vaadin-checkbox-group', () => {
  let group, checkboxes;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
      tagName = group.tagName.toLowerCase();
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
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2" disabled></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      checkboxes = group.querySelectorAll('vaadin-checkbox');
      await nextFrame();
    });

    it('should keep initial disabled property for checkboxes', () => {
      expect(checkboxes[0].disabled).to.be.false;
      expect(checkboxes[1].disabled).to.be.true;
    });

    it('should be possible to uncheck the checkbox on reattaching of the group', async () => {
      const container = group.parentElement;
      container.removeChild(group);
      container.appendChild(group);
      await nextFrame();
      checkboxes[0].checked = true;
      checkboxes[0].checked = false;
      expect(checkboxes[0].checked).to.be.false;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group disabled>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should propagate disabled property to checkboxes', () => {
      checkboxes.forEach((checkbox) => {
        expect(checkbox.disabled).to.be.true;
      });

      group.disabled = false;
      checkboxes.forEach((checkbox) => {
        expect(checkbox.disabled).to.be.false;
      });
    });

    it('should set disabled property to dynamically added checkboxes', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = '3';
      group.appendChild(checkbox);
      await nextFrame();
      expect(checkbox.disabled).to.be.true;
    });
  });

  describe('value', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="3" label="Checkbox 3"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should add dynamically added checked checkbox value to checkbox group value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.include('new');
    });

    it('should not add duplicate values when added checked checkbox already included in value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.value = ['new'];
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.eql(['new']);
    });

    it('should check dynamically added checkbox if included in value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      group.value = ['new'];
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.eql(['new']);
      expect(checkbox.checked).to.be.true;
    });

    it('should remove checked checkbox value from checkbox group value, when checkbox is dynamically removed', async () => {
      const checkbox = checkboxes[0];
      checkbox.checked = true;
      group.removeChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.include('1');
    });

    it('should create new array instance for checkbox group value when checkbox dynamically added', async () => {
      const value = group.value;
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.equal(value);
    });

    it('should create new array instance for checkbox group value when checkbox dynamically removed', async () => {
      const value = group.value;
      const checkbox = checkboxes[0];
      checkbox.checked = true;
      group.removeChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.equal(value);
    });

    it('should not change checkbox group value if a removed checkbox is checked', async () => {
      const checkbox = checkboxes[0];
      group.removeChild(checkbox);
      await nextFrame();
      checkbox.checked = true;
      expect(group.value).to.not.include('1');
    });

    it('should set proper value to checkbox-group when a checkbox is checked', () => {
      checkboxes[0].checked = true;
      expect(group.value).to.deep.equal(['1']);
      checkboxes[1].checked = true;
      expect(group.value).to.deep.equal(['1', '2']);
    });

    it('should set proper value to checkbox-group when a checkbox is unchecked', () => {
      checkboxes[0].checked = true;
      checkboxes[1].checked = true;
      expect(group.value).to.deep.equal(['1', '2']);
      checkboxes[1].checked = false;
      expect(group.value).to.deep.equal(['1']);
    });

    it('should check proper checkbox when value is set', () => {
      group.value = ['2'];
      expect(checkboxes[1].checked).to.be.true;
      group.value = ['1', '3'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
    });

    it('should uncheck proper checkbox when value is removed', () => {
      group.value = ['1', '3'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
      group.value = ['1'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.false;
    });
  });

  describe('focused attribute', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should set focused attribute on Tab', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.true;
      expect(group.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on Shift+Tab', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      // Move focus out of the checkbox group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.false;
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on Tab when disabled', async () => {
      group.disabled = true;
      // Try to focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.false;
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should not steal focus from currently focused element', () => {
      const focusInput = document.createElement('input');
      document.body.appendChild(focusInput);
      focusInput.focus();
      group.value = '1';
      expect(document.activeElement).to.be.equal(focusInput);
      document.body.removeChild(focusInput);
    });
  });

  describe('has-value attribute', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should not set has-value attribute by default', () => {
      expect(group.hasAttribute('has-value')).to.be.false;
    });

    it('should toggle has-value attribute on value property change', () => {
      group.value = ['2'];
      expect(group.hasAttribute('has-value')).to.be.true;
      group.value = [];
      expect(group.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('label property', () => {
    let label;

    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
      label = group.querySelector('[slot=label]');
    });

    it('should not set has-label attribute by default', () => {
      expect(group.hasAttribute('has-label')).to.be.false;
    });

    it('should reflect the attribute to the property', () => {
      group.setAttribute('label', 'Label');
      expect(group.label).to.equal('Label');

      group.removeAttribute('label');
      expect(group.label).to.null;
    });

    it('should add label to checkbox group when a label is dynamically set', () => {
      group.label = 'Label';
      expect(label.textContent).to.equal('Label');
    });

    it('should toggle has-label attribute on label property change', () => {
      group.label = 'Label';
      expect(group.hasAttribute('has-label')).to.be.true;

      group.label = '';
      expect(group.hasAttribute('has-label')).to.be.false;
    });
  });

  describe('aria-required attribute', () => {
    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
    });

    it('should not have aria-required attribute by default', () => {
      expect(group.hasAttribute('aria-required')).to.be.false;
    });

    it('should toggle aria-required attribute on required property change', () => {
      group.required = true;
      expect(group.getAttribute('aria-required')).to.equal('true');
      group.required = false;
      expect(group.hasAttribute('aria-required')).to.be.false;
    });
  });

  describe('warnings', () => {
    beforeEach(async () => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
      await nextFrame();
    });

    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when adding checkbox without value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.calledOnce).to.be.true;
    });

    it('should not warn when adding checkbox with value attribute', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.setAttribute('value', 'something');
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.called).to.be.false;
    });

    it('should not warn when adding checkbox with value property', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'something';
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.called).to.be.false;
    });
  });

  describe('error message', () => {
    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
    });

    it('setting errorMessage updates has-error-message attribute', () => {
      group.invalid = true;
      group.errorMessage = 'foo';
      expect(group.hasAttribute('has-error-message')).to.be.true;
    });

    it('setting errorMessage to empty string does not update has-error-message attribute', () => {
      group.invalid = true;
      group.errorMessage = '';
      expect(group.hasAttribute('has-error-message')).to.be.false;
    });

    it('setting errorMessage to null does not update has-error-message attribute', () => {
      group.invalid = true;
      group.errorMessage = null;
      expect(group.hasAttribute('has-error-message')).to.be.false;
    });
  });

  describe('helper text', () => {
    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
    });

    it('setting helper updates has-helper attribute', () => {
      group.helperText = 'foo';
      expect(group.hasAttribute('has-helper')).to.be.true;
    });

    it('setting helper to empty string does not update has-helper attribute', () => {
      group.helperText = '';
      expect(group.hasAttribute('has-helper')).to.be.false;
    });

    it('setting helper to null does not update has-helper attribute', () => {
      group.helperText = null;
      expect(group.hasAttribute('has-helper')).to.be.false;
    });

    it('setting helper with slot updates has-helper attribute', async () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      group.appendChild(helper);
      await nextFrame();
      expect(group.hasAttribute('has-helper')).to.be.true;
    });
  });

  describe('custom helper', () => {
    let helper;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <div slot="helper">Custom helper</div>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      helper = group.querySelector('[slot=helper]');
    });

    it('should set has-helper attribute', () => {
      expect(group.hasAttribute('has-helper')).to.be.true;
    });

    it('should remove has-helper attribute when slotted helper is removed', async () => {
      group.removeChild(helper);
      await nextFrame();
      expect(group.hasAttribute('has-helper')).to.be.false;
    });
  });

  describe('aria-labelledby', () => {
    let error, helper, label;

    beforeEach(() => {
      group = fixtureSync('<vaadin-checkbox-group helper-text="Choose one" label="Label"></vaadin-checkbox-group>');
      error = group.querySelector('[slot=error-message]');
      helper = group.querySelector('[slot=helper]');
      label = group.querySelector('[slot=label]');
    });

    it('should add label and helper text to aria-labelledby when field is valid', () => {
      const aria = group.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
      expect(aria).to.include(label.id);
    });

    it('should add error message to aria-labelledby when field is invalid', async () => {
      group.invalid = true;
      await aTimeout(0);
      const aria = group.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
      expect(aria).to.include(label.id);
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox name="language" value="en" label="English">/vaadin-checkbox>
          <vaadin-checkbox name="language" value="fr" label="Français"></vaadin-checkbox>
          <vaadin-checkbox name="language" value="de" label="Deutsch">/vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      checkboxes = group.querySelectorAll('vaadin-checkbox');
      await nextFrame();
    });

    it('should not have invalid attribute initially', () => {
      expect(group.hasAttribute('invalid')).to.be.false;
    });

    it('should not add invalid attribute if required attribute is not present', () => {
      checkboxes[0].checked = true;
      checkboxes[0].checked = false;
      expect(group.hasAttribute('invalid')).to.be.false;
    });

    it('should add invalid attribute if required attribute is present and checkbox group value is empty', () => {
      group.required = true;
      checkboxes[0].checked = true;
      checkboxes[0].checked = false;
      expect(group.hasAttribute('invalid')).to.be.true;
    });

    it('should remove invalid attribute if checkbox group value is not empty', () => {
      group.required = true;
      checkboxes[0].checked = true;
      checkboxes[0].checked = false;
      expect(group.hasAttribute('invalid')).to.be.true;

      checkboxes[0].checked = true;
      expect(group.hasAttribute('invalid')).to.be.false;
    });

    it('should run validation only once when adding a value', () => {
      const spy = sinon.spy(group, 'validate');
      group.value = ['en', 'fr'];
      expect(spy.calledOnce).to.be.true;
    });

    it('should run validation only once when removing a value', () => {
      const spy = sinon.spy(group, 'validate');
      group.value = ['en', 'fr'];
      spy.resetHistory();
      group.value = ['en'];
      expect(spy.calledOnce).to.be.true;
    });

    it('should run validation and set invalid when field is required and user blurs out of the group', async () => {
      group.required = true;

      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });
      // Move focus out of the checkbox group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(group.invalid).to.be.true;
    });

    it('should not run validation while user is tabbing between checkboxes inside of the group', async () => {
      group.required = true;
      const spy = sinon.spy(group, 'validate');

      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });
      // Focus on the second checkbox.
      await sendKeys({ press: 'Tab' });

      expect(spy.called).to.be.false;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      group.addEventListener('validated', validatedSpy);
      group.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      group.addEventListener('validated', validatedSpy);
      group.required = true;
      group.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('array mutation methods', () => {
    let bind;

    beforeEach(async () => {
      group = fixtureSync(`
        <dom-bind>
          <template>
            <vaadin-checkbox-group id="group" value="{{value}}">
              <vaadin-checkbox value="a" label="Checkbox A"></vaadin-checkbox>
              <vaadin-checkbox value="b" label="Checkbox B"></vaadin-checkbox>
              <vaadin-checkbox value="c" label="Checkbox C"></vaadin-checkbox>
            </vaadin-checkbox-group>
          </template>
        </template>
      </dom-bind>
      `);
      bind = document.querySelector('dom-bind');
      checkboxes = group.querySelectorAll('vaadin-checkbox');
      await nextFrame();
    });

    it('should notify the value changes from inside', () => {
      expect(bind.value).to.be.instanceOf(Array);
      expect(bind.value.length).to.equal(0);
      checkboxes[0].checked = true;
      expect(bind.value.length).to.equal(1);
      expect(bind.value[0]).to.equal('a');
    });

    it('should update checkboxes when a checkbox value is updated using push', () => {
      bind.push('value', 'a');
      expect(checkboxes[0].checked).to.be.true;
    });

    it('should update checkboxes when a checkbox value is updated using pop', () => {
      bind.value = ['a', 'b'];
      bind.pop('value');
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[1].checked).to.be.false;
    });

    it('should update checkboxes when a checkbox value is updated using push', () => {
      bind.value = ['b'];
      bind.unshift('value', 'a');
      expect(checkboxes[1].checked).to.be.true;
      expect(checkboxes[0].checked).to.be.true;
    });

    it('should update checkboxes when a checkbox value is updated using unshift', () => {
      bind.value = ['a', 'b'];
      bind.shift('value');
      expect(checkboxes[0].checked).to.be.false;
      expect(checkboxes[1].checked).to.be.true;
    });

    it('should update checkboxes when a checkbox value is updated using splice', () => {
      bind.value = ['a', 'b'];
      bind.splice('value', 1, 1, 'c');
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[1].checked).to.be.false;
      expect(checkboxes[2].checked).to.be.true;
    });
  });

  describe('wrapping', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="c_1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="c_2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="c_3" label="Checkbox 3"></vaadin-checkbox>
          <vaadin-checkbox value="c_4" label="Checkbox 4"></vaadin-checkbox>
          <vaadin-checkbox value="c_5" label="Checkbox 5"></vaadin-checkbox>
          <vaadin-checkbox value="c_6" label="Checkbox 6"></vaadin-checkbox>
          <vaadin-checkbox value="c_7" label="Checkbox 7"></vaadin-checkbox>
          <vaadin-checkbox value="c_8" label="Checkbox 8"></vaadin-checkbox>
          <vaadin-checkbox value="c_9" label="Checkbox 9"></vaadin-checkbox>
          <vaadin-checkbox value="c_10" label="Checkbox 10"></vaadin-checkbox>
          <vaadin-checkbox value="c_11" label="Checkbox 11"></vaadin-checkbox>
          <vaadin-checkbox value="c_12" label="Checkbox 12"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
    });

    it('should not overflow horizontally', () => {
      const parentWidth = group.parentElement.offsetWidth;

      expect(group.offsetWidth).to.be.lte(parentWidth);
      expect(group.shadowRoot.querySelector('[part~="group-field"]').offsetWidth).to.be.lte(parentWidth);
    });

    it('should wrap checkboxes', () => {
      const checkboxes = Array.from(group.children);
      const { top: firstTop, left: firstLeft } = checkboxes[0].getBoundingClientRect();

      const wrapped = Array.from(checkboxes)
        .slice(1)
        .filter((checkbox) => checkbox.getBoundingClientRect().top > firstTop);

      expect(wrapped).to.not.be.empty;
      expect(wrapped[0].getBoundingClientRect().left).to.equal(firstLeft);
    });
  });
});
