import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-radio-group.js';

describe('radio-group', () => {
  let group, buttons;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      group = fixtureSync(`<vaadin-radio-group></vaadin-radio-group>`);
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
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" disabled></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should not be disabled by default', () => {
      expect(group.disabled).to.be.false;
    });

    it('should not be readonly by default', () => {
      expect(group.readonly).to.be.false;
    });

    it('should keep initial disabled property for radio buttons', () => {
      expect(buttons[0].disabled).to.be.false;
      expect(buttons[1].disabled).to.be.true;
    });
  });

  describe('disabled property', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group disabled>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should propagate disabled property to radio buttons', () => {
      buttons.forEach((button) => {
        expect(button.disabled).to.be.true;
      });

      group.disabled = false;
      buttons.forEach((button) => {
        expect(button.disabled).to.be.false;
      });
    });

    it('should set disabled property to dynamically added radio buttons', async () => {
      const radio = document.createElement('vaadin-radio-button');
      group.appendChild(radio);
      await nextFrame();
      expect(radio.disabled).to.be.true;
    });
  });

  describe('name', () => {
    let groupName;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
      groupName = group._fieldName;
    });

    it('should set the group name to the dynamically added radio buttons', async () => {
      const radio = document.createElement('vaadin-radio-button');
      group.appendChild(radio);
      await nextFrame();

      expect(radio.name).to.equal(groupName);
    });
  });

  describe('readonly property', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group readonly>
          <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should disable unchecked buttons when readonly', () => {
      buttons.forEach((button) => {
        expect(button.disabled).to.be.true;
      });
    });

    it('should enable button when value is set while readonly', () => {
      group.value = '2';
      expect(buttons[0].disabled).to.be.true;
      expect(buttons[1].disabled).to.be.false;
    });

    it('should enable all buttons when readonly is set back to false', () => {
      group.readonly = false;
      buttons.forEach((button) => {
        expect(button.disabled).to.be.false;
      });
    });

    it('should reflect to lowercase readonly attribute', () => {
      group.readonly = false;
      expect(group.hasAttribute('readonly')).to.be.false;
      group.readonly = true;
      expect(group.hasAttribute('readonly')).to.be.true;
    });

    it('should disable a new button when added to a readonly group', async () => {
      group.readonly = true;

      const newRadioButton = document.createElement('vaadin-radio-button');
      newRadioButton.label = 'Button 3';
      newRadioButton.value = '3';
      group.appendChild(newRadioButton);
      await nextFrame();

      expect(newRadioButton.disabled).to.be.true;
    });

    it('should not disable a checked button when added to a readonly group', async () => {
      group.readonly = true;

      const newRadioButton = document.createElement('vaadin-radio-button');
      newRadioButton.label = 'Button 3';
      newRadioButton.value = '3';
      newRadioButton.checked = true;
      group.appendChild(newRadioButton);
      await nextFrame();

      expect(newRadioButton.disabled).to.be.false;
    });
  });

  describe('aria-invalid attribute', () => {
    beforeEach(() => {
      group = fixtureSync(`<vaadin-radio-group></vaadin-radio-group>`);
    });

    it('should toggle aria-invalid attribute on invalid property change', () => {
      group.invalid = true;
      expect(group.getAttribute('aria-invalid')).to.equal('true');
      group.invalid = false;
      expect(group.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('focused state', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should set focused attribute on Tab', async () => {
      // Focus on the first radio button.
      await sendKeys({ press: 'Tab' });

      expect(buttons[0].hasAttribute('focused')).to.be.true;
      expect(group.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on Shift+Tab', async () => {
      // Focus on the first radio button.
      await sendKeys({ press: 'Tab' });

      // Move focus out of the group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(buttons[0].hasAttribute('focused')).to.be.false;
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on Tab when disabled', async () => {
      group.disabled = true;
      // Try to focus on the first radio button.
      await sendKeys({ press: 'Tab' });

      expect(group.hasAttribute('focused')).to.be.false;
    });
  });

  describe('value property', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should be an empty string by default', () => {
      expect(group.value).to.equal('');
    });

    it('should set value when radio button is checked', () => {
      buttons[0].checked = true;
      expect(group.value).to.eq('on');
      buttons[1].checked = true;
      expect(group.value).to.eq('2');
    });

    it('should check proper button when value is set', () => {
      group.value = '2';
      expect(buttons[1].checked).to.be.true;
      group.value = 'on';
      expect(buttons[0].checked).to.be.true;
    });

    it('should un-check proper button when value is set to null', () => {
      group.value = '2';
      expect(buttons[1].checked).to.be.true;
      group.value = null;
      expect(buttons[1].checked).to.be.false;
    });

    it('should un-check proper button when value is set to undefined', () => {
      group.value = '2';
      expect(buttons[1].checked).to.be.true;
      group.value = undefined;
      expect(buttons[1].checked).to.be.false;
    });

    it('should un-check proper button when value is set to empty string', () => {
      group.value = '2';
      expect(buttons[1].checked).to.be.true;
      group.value = '';
      expect(buttons[1].checked).to.be.false;
    });

    it('should dispatch value-changed event when value changes', () => {
      const spy = sinon.spy();
      group.addEventListener('value-changed', spy);
      buttons[0].checked = true;
      expect(spy.calledOnce).to.be.true;
    });

    it('should not focus radio group when value is set programmatically', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      group.value = '2';
      expect(document.activeElement).to.equal(input);
      document.body.removeChild(input);
    });

    it('should warn when no radio button matches value set programmatically', () => {
      const stub = sinon.stub(console, 'warn');
      group.value = 'foo';
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });
  });

  describe('has-value attribute', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should add and keep the attribute on radio button click', () => {
      buttons[0].click();
      expect(group.hasAttribute('has-value')).to.be.true;
      buttons[1].click();
      expect(group.hasAttribute('has-value')).to.be.true;
    });

    it('should toggle the attribute on value change', () => {
      group.value = '2';
      expect(group.hasAttribute('has-value')).to.be.true;
      group.value = '';
      expect(group.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
          <vaadin-radio-button label="Button 3" value="3"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];

      spy = sinon.spy();
      group.addEventListener('change', spy);
    });

    it('should fire when selecting a radio button on click', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event).to.be.instanceof(Event);
    });

    it('should fire when selecting a radio button from keyboard', async () => {
      buttons[1].focus();
      buttons[1].checked = true;
      await sendKeys({ press: 'ArrowDown' });
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event).to.be.instanceof(Event);
    });

    it('should bubble', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event).to.have.property('composed', false);
    });

    it('should be called after checked-changed on click', () => {
      const buttonSpy = sinon.spy();
      buttons[1].addEventListener('checked-changed', buttonSpy);
      buttons[1].click();
      expect(buttonSpy.calledOnce).to.be.true;
      expect(spy.calledAfter(buttonSpy)).to.be.true;
    });

    it('should be called after checked-changed on keydown', async () => {
      buttons[0].focus();
      buttons[0].checked = true;
      const buttonSpy = sinon.spy();
      buttons[1].addEventListener('checked-changed', buttonSpy);
      await sendKeys({ press: 'ArrowDown' });
      expect(buttonSpy.calledOnce).to.be.true;
      expect(spy.calledAfter(buttonSpy)).to.be.true;
    });

    it('should not fire on programmatic value change', () => {
      group.value = '2';
      expect(spy.called).to.be.false;
    });

    it('should fire after radio group value is updated on click', () => {
      const changeSpy = sinon.spy();
      group.addEventListener('change', changeSpy);
      buttons[1].click();

      expect(changeSpy.calledOnce).to.be.true;
      expect(group.value).to.equal(buttons[1].value);
    });

    it('should fire after radio group value is updated on keydown', async () => {
      const changeSpy = sinon.spy();
      group.addEventListener('change', changeSpy);
      buttons[1].focus();
      buttons[1].checked = true;
      await sendKeys({ press: 'ArrowDown' });

      expect(changeSpy.calledOnce).to.be.true;
      expect(group.value).to.equal(buttons[2].value);
    });

    it('should have updated value after radio group value is updated on keydown', async () => {
      const changeSpy = sinon.spy();
      group.addEventListener('change', changeSpy);
      buttons[1].focus();
      buttons[1].checked = true;
      await sendKeys({ press: 'ArrowLeft' });

      expect(changeSpy.calledOnce).to.be.true;

      const event = changeSpy.firstCall.args[0];
      expect(event.target).to.equal(buttons[0].inputElement);
      expect(event.target.value).to.equal(buttons[0].value);
    });
  });

  describe('initial validation', () => {
    let validateSpy;

    beforeEach(() => {
      group = document.createElement('vaadin-radio-group');

      const radio = document.createElement('vaadin-radio-button');
      radio.value = '1';
      group.appendChild(radio);

      validateSpy = sinon.spy(group, 'validate');
    });

    afterEach(() => {
      group.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      group.value = '1';
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      group.value = '1';
      group.invalid = true;
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should not set required property by default', () => {
      expect(group.required).to.be.undefined;
    });

    it('should pass validation by default when group is not required', () => {
      expect(group.checkValidity()).to.be.true;
      expect(group.invalid).to.be.false;
    });

    it('should not set invalid when group is required and has not lost focus yet', () => {
      group.required = true;
      expect(group.checkValidity()).to.be.false;
      expect(group.invalid).to.be.false;
    });

    it('should set invalid when radio group is required and validate is called', () => {
      group.required = true;
      group.validate();
      expect(group.invalid).to.be.true;
    });

    it('should validate on radio button click', () => {
      group.required = true;
      group.validate();
      buttons[1].click();
      expect(group.invalid).to.be.false;
    });

    it('should validate on value change', () => {
      group.required = true;
      group.validate();
      group.value = '1';
      expect(group.invalid).to.be.false;
    });

    it('should validate and set invalid on focusout when group is required', async () => {
      group.required = true;

      // Focus on the first radio button.
      await sendKeys({ press: 'Tab' });
      // Move focus out of the group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(group.checkValidity()).to.be.false;
      expect(group.invalid).to.be.true;
    });

    it('should dispatch invalid-changed event when invalid changes', async () => {
      const spy = sinon.spy();
      group.addEventListener('invalid-changed', spy);
      group.required = true;

      // Focus on the first radio button.
      await sendKeys({ press: 'Tab' });
      // Move focus out of the group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(spy.calledOnce).to.be.true;
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

  describe('initial value', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button label="Button 1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="1" checked></vaadin-radio-button>
          <vaadin-radio-button label="Button 3" value="2" checked></vaadin-radio-button>
          <vaadin-radio-button label="Button 4"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
      buttons = [...group.querySelectorAll('vaadin-radio-button')];
    });

    it('should set the value based on the initially checked radio button', () => {
      expect(group.value).to.equal('2');
    });

    it('should set the last initially checked button value as the radio group value', () => {
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.true;
    });

    it('should reset the value of radio group if the checked radio button is removed', async () => {
      group.removeChild(buttons[2]);
      await nextFrame();
      expect(group.value).to.be.equal('');
    });

    it('should keep value when set immediately after removing and adding new children', async () => {
      group.__radioButtons.forEach((button) => group.removeChild(button));

      ['value1', 'value2', 'value3'].forEach((value) => {
        const radio = document.createElement('vaadin-radio-button');
        radio.value = value;
        group.appendChild(radio);
      });
      group.value = 'value2';
      await nextFrame();

      expect(group.value).to.equal('value2');
    });
  });

  describe('wrapping', () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 500px">
          <vaadin-radio-group>
            <vaadin-radio-button label="Radio button 1" value="r_1"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 2" value="r_2"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 3" value="r_3"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 4" value="r_4"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 5" value="r_5"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 6" value="r_6"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 7" value="r_7"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 8" value="r_8"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 9" value="r_9"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 10" value="r_10"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 11" value="r_11"></vaadin-radio-button>
            <vaadin-radio-button label="Radio button 12" value="r_12"></vaadin-radio-button>
          </vaadin-radio-group>
        </div>
      `);
      group = wrapper.firstElementChild;
      await nextFrame();
    });

    it('should not overflow horizontally', () => {
      const parentWidth = wrapper.offsetWidth;
      expect(group.offsetWidth).to.be.lte(parentWidth);
      expect(group.shadowRoot.querySelector('[part~="group-field"]').offsetWidth).to.be.lte(parentWidth);
    });

    it('should wrap radio-buttons', () => {
      const radios = Array.from(group.children);
      const { top: firstTop, left: firstLeft } = radios[0].getBoundingClientRect();
      const wrappedRadios = Array.from(radios)
        .slice(1)
        .filter((radio) => radio.getBoundingClientRect().top > firstTop);
      expect(wrappedRadios).to.not.be.empty;
      expect(wrappedRadios[0].getBoundingClientRect().left).to.equal(firstLeft);
    });
  });
});
