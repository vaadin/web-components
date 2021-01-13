import { expect } from '@esm-bundle/chai';
import { aTimeout, nextFrame } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { arrowDown, arrowLeft, arrowRight, arrowUp, fixtureSync, focusin, focusout, visible } from './helpers.js';
import '../vaadin-radio-group.js';

describe('radio-group', () => {
  let group;
  let buttons;

  beforeEach(async () => {
    group = fixtureSync(`
      <vaadin-radio-group>
        <vaadin-radio-button>Button 1</vaadin-radio-button>
        <vaadin-radio-button value="2">Button 2</vaadin-radio-button>
        <vaadin-radio-button value="3">Button 3</vaadin-radio-button>
      </vaadin-radio-group>
    `);
    await nextFrame();
    buttons = group._radioButtons;
  });

  afterEach(() => {
    group.remove();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = group.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('disabled property', () => {
    beforeEach(() => {
      group.disabled = true;
    });

    it('should propagate disabled property to all the radio buttons', () => {
      buttons.forEach((button) => {
        expect(button.disabled).to.be.true;
      });
    });

    it('should set disabled property to dynamically added radio buttons', async () => {
      const radio = document.createElement('vaadin-radio-button');
      group.appendChild(radio);
      await nextFrame();
      expect(radio.disabled).to.be.true;
    });
  });

  describe('readonly property', () => {
    it('should not be set by default', () => {
      expect(group.readonly).to.be.undefined;
    });

    it('should disable unchecked buttons when readonly', () => {
      group.readonly = true;
      buttons.forEach((button) => {
        expect(button.disabled).to.be.true;
      });
    });

    it('should enable button when value is set while readonly', () => {
      group.readonly = true;
      group.value = '2';
      expect(buttons[0].disabled).to.be.true;
      expect(buttons[1].disabled).to.be.false;
      expect(buttons[2].disabled).to.be.true;
    });

    it('should enable all buttons when readonly is set back to false', () => {
      group.readonly = true;
      group.readonly = false;
      buttons.forEach((button) => {
        expect(button.disabled).to.be.false;
      });
    });

    it('should reflect to lowercase readonly attribute', () => {
      group.readonly = true;
      expect(group.hasAttribute('readonly')).to.be.true;
      group.readonly = false;
      expect(group.hasAttribute('readonly')).to.be.false;
    });
  });

  describe('label property', () => {
    it('should not have has-label attribute by default', () => {
      expect(group.hasAttribute('has-label')).to.be.false;
    });

    it('should toggle has-label attribute on label change', () => {
      group.label = 'foo';
      expect(group.hasAttribute('has-label')).to.be.true;
      group.label = null;
      expect(group.hasAttribute('has-label')).to.be.false;
    });
  });

  describe('focused state', () => {
    it('should set focused attribute on focusin event dispatched', () => {
      focusin(buttons[0]);
      expect(group.hasAttribute('focused')).to.be.true;
    });

    it('should set focused attribute on radio button focus', () => {
      buttons[0].focus();
      expect(group.hasAttribute('focused')).to.be.true;
    });

    it('should not set focused attribute on focusin event dispatched when disabled', () => {
      group.disabled = true;
      focusin(buttons[0]);
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should remove focused attribute on radio button focusout', () => {
      focusin(buttons[0]);
      focusout(buttons[0]);
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should remove focused attribute on radio group focusout', () => {
      focusin(buttons[0]);
      focusout(group);
      expect(group.hasAttribute('focused')).to.be.false;
    });
  });

  describe('value property', () => {
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

    it('should not have has-value attribute by default', () => {
      expect(group.hasAttribute('has-value')).to.be.false;
    });

    it('should toggle has-value attribute on value change', () => {
      group.value = '2';
      expect(group.hasAttribute('has-value')).to.be.true;
      group.value = '';
      expect(group.hasAttribute('has-value')).to.be.false;
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
      expect(document.activeElement).to.be.equal(input);
      document.body.removeChild(input);
    });

    it('should warn when no radio button matches value set programmatically', () => {
      const stub = sinon.stub(console, 'warn');
      group.value = 'foo';
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });
  });

  describe('roving tabindex', () => {
    it('sets focus to the first element by default', () => {
      expect(buttons[0].tabIndex).to.eq(0);
      expect(buttons[1].tabIndex).to.eq(-1);
      expect(buttons[2].tabIndex).to.eq(-1);
    });

    it('should update tabindex when checked button changes', () => {
      buttons[1].checked = true;
      expect(buttons[0].tabIndex).to.eq(-1);
      expect(buttons[1].tabIndex).to.eq(0);
      expect(buttons[2].tabIndex).to.eq(-1);

      buttons[2].checked = true;
      expect(buttons[0].tabIndex).to.eq(-1);
      expect(buttons[1].tabIndex).to.eq(-1);
      expect(buttons[2].tabIndex).to.eq(0);
    });
  });

  describe('keyboard selection', () => {
    beforeEach(() => {
      group.focus();
    });

    it('should not select radio button when focused', () => {
      expect(group.value).to.be.undefined;
    });

    it('should select next radio button on arrow down when un-checked', () => {
      arrowDown(buttons[0]);
      expect(buttons[1].checked).to.be.true;
      expect(group.value).to.equal('2');
    });

    it('should select next radio button on arrow down when checked', () => {
      group.value = 'on';
      arrowDown(buttons[0]);
      expect(buttons[1].checked).to.be.true;
      expect(group.value).to.equal('2');
    });

    it('should select prev radio button on arrow up when checked', () => {
      group.value = '2';
      buttons[1].focus();
      arrowUp(buttons[1]);
      expect(buttons[0].checked).to.be.true;
      expect(group.value).to.equal('on');
    });

    it('should skip disabled button and check the next one instead', () => {
      group.value = 'on';
      buttons[1].disabled = true;
      arrowDown(buttons[0]);
      expect(buttons[2].checked).to.be.true;
      expect(group.value).to.equal('3');
    });

    it('should set focus-ring attribute when selecting next radio', () => {
      group.value = '2';
      buttons[1].focus();
      arrowDown(buttons[1]);
      expect(buttons[2].hasAttribute('focus-ring')).to.be.true;
    });

    it('should set focus-ring attribute when selecting prev radio', () => {
      group.value = '2';
      buttons[1].focus();
      arrowUp(buttons[1]);
      expect(buttons[0].hasAttribute('focus-ring')).to.be.true;
    });

    it('should select last radio button on arrow up on first button', () => {
      group.value = 'on';
      arrowUp(buttons[0]);
      expect(buttons[2].checked).to.be.true;
      expect(group.value).to.equal('3');
    });

    it('should select first radio button on arrow down on last button', () => {
      group.value = '3';
      buttons[2].focus();
      arrowDown(buttons[2]);
      expect(buttons[0].checked).to.be.true;
      expect(group.value).to.equal('on');
    });

    it('should select next radio button on arrow right when checked', () => {
      group.value = 'on';
      arrowRight(buttons[0]);
      expect(buttons[1].checked).to.be.true;
      expect(group.value).to.equal('2');
    });

    it('should select prev radio button on arrow left when checked', () => {
      group.value = '2';
      buttons[1].focus();
      arrowLeft(buttons[1]);
      expect(buttons[0].checked).to.be.true;
      expect(group.value).to.equal('on');
    });

    it('should skip disabled button and check the next one instead', () => {
      group.value = 'on';
      buttons[1].disabled = true;
      arrowRight(buttons[0]);
      expect(buttons[2].checked).to.be.true;
      expect(group.value).to.equal('3');
    });

    it('should select last radio button on arrow left on first button', () => {
      group.value = 'on';
      arrowLeft(buttons[0]);
      expect(buttons[2].checked).to.be.true;
      expect(group.value).to.equal('3');
    });

    it('should select first radio button on arrow right on last button', () => {
      group.value = '3';
      buttons[2].focus();
      arrowRight(buttons[2]);
      expect(buttons[0].checked).to.be.true;
      expect(group.value).to.equal('on');
    });

    it('should not check radio button with keyboard if disabled', () => {
      buttons[1].checked = true;
      buttons[1].focus();
      group.disabled = true;
      arrowDown(buttons[1]);
      expect(buttons[2].checked).to.be.false;
    });

    it('should not check radio button with keyboard if readonly', () => {
      buttons[1].checked = true;
      buttons[1].focus();
      group.readonly = true;
      arrowDown(buttons[1]);
      expect(buttons[2].checked).to.be.false;
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        group.setAttribute('dir', 'rtl');
      });

      it('should select prev radio button on arrow right when checked', () => {
        group.value = '3';
        buttons[2].focus();
        arrowRight(buttons[2]);
        expect(buttons[1].checked).to.be.true;
        expect(group.value).to.equal('2');
      });

      it('should select next radio button on arrow left when checked', () => {
        group.value = 'on';
        arrowLeft(buttons[0]);
        expect(buttons[1].checked).to.be.true;
        expect(group.value).to.equal('2');
      });
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      group.addEventListener('change', spy);
    });

    it('should fire when selecting a radio button on click', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.getCall(0).args[0];
      expect(event).to.be.instanceof(Event);
    });

    it('should fire when selecting a radio button from keyboard', () => {
      buttons[1].focus();
      buttons[1].checked = true;
      arrowDown(buttons[1]);
      expect(spy.calledOnce).to.be.true;
      const event = spy.getCall(0).args[0];
      expect(event).to.be.instanceof(Event);
    });

    it('should bubble', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.getCall(0).args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      buttons[1].click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.getCall(0).args[0];
      expect(event).to.have.property('composed', false);
    });

    it('should be called after checked-changed on click', () => {
      const buttonSpy = sinon.spy();
      buttons[1].addEventListener('checked-changed', buttonSpy);
      buttons[1].click();
      expect(buttonSpy.calledOnce).to.be.true;
      expect(spy.calledAfter(buttonSpy)).to.be.true;
    });

    it('should be called after checked-changed on keydown', () => {
      buttons[0].focus();
      buttons[0].checked = true;
      const buttonSpy = sinon.spy();
      buttons[1].addEventListener('checked-changed', buttonSpy);
      arrowDown(buttons[0]);
      expect(buttonSpy.calledOnce).to.be.true;
      expect(spy.calledAfter(buttonSpy)).to.be.true;
    });

    it('should not fire on programmatic value change', () => {
      group.value = '2';
      expect(spy.called).to.be.false;
    });

    it('should fire after radio group value is updated on click', (done) => {
      group.addEventListener('change', () => {
        expect(group.value).to.equal(buttons[1].value);
        done();
      });
      buttons[1].click();
    });

    it('should fire after radio group value is updated on keydown', (done) => {
      group.addEventListener('change', () => {
        expect(group.value).to.equal(buttons[2].value);
        done();
      });
      buttons[1].focus();
      buttons[1].checked = true;
      arrowDown(buttons[1]);
    });

    it('should have updated value after radio group value is updated on keydown', (done) => {
      buttons[1].focus();
      buttons[1].checked = true;
      group.addEventListener('change', (e) => {
        expect(e.target).to.equal(buttons[0]);
        expect(e.currentTarget.value).to.equal(buttons[0].value);
        done();
      });
      arrowLeft(buttons[1]);
    });
  });

  describe('validation', () => {
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

    it('should validate and reset invalid state after changing selected radio', () => {
      group.required = true;
      group.validate();
      buttons[1].click();
      expect(group.invalid).to.be.false;
    });

    it('should validate and set invalid on focusout when group is required', () => {
      group.required = true;
      focusout(group);
      expect(group.checkValidity()).to.be.false;
      expect(group.invalid).to.be.true;
    });

    it('should not validate on focusout when event is not composed', () => {
      group.required = true;
      focusout(group, false);
      expect(group.invalid).to.be.false;
    });

    it('should dispatch invalid-changed event when invalid changes', () => {
      const spy = sinon.spy();
      group.addEventListener('invalid-changed', spy);
      group.required = true;
      focusout(group, true);
      expect(spy.calledOnce).to.be.true;
    });

    it('should reflect required property to attribute', () => {
      group.required = true;
      expect(group.hasAttribute('required')).to.be.true;
      group.required = false;
      expect(group.hasAttribute('required')).to.be.false;
    });

    it('should reflect invalid property to attribute', () => {
      group.invalid = true;
      expect(group.hasAttribute('invalid')).to.be.true;
      group.invalid = false;
      expect(group.hasAttribute('invalid')).to.be.false;
    });
  });

  describe('errorMessage property', () => {
    let error;

    beforeEach(() => {
      error = group.shadowRoot.querySelector('[part="error-message"]');
    });

    it('should set id and ARIA attributes to error message part', () => {
      expect(error.getAttribute('aria-live')).to.be.equal('assertive');
      expect(error.getAttribute('aria-hidden')).to.be.equal('true');
      expect(/^vaadin-radio-group-error-\d+$/.test(error.id)).to.be.true;
    });

    it('should set aria-hidden to false when error is shown', () => {
      group.errorMessage = 'Bad input!';
      group.invalid = true;
      expect(error.getAttribute('aria-hidden')).to.be.equal('false');
    });

    it('should not show error message by default', () => {
      group.errorMessage = 'Bad input!';
      expect(visible(error)).to.be.false;
    });

    it('should not show error message when it is empty', () => {
      group.invalid = true;
      expect(visible(error)).to.be.false;
    });

    it('should show error message when group is invalid', async () => {
      group.errorMessage = 'Bad input!';
      group.invalid = true;
      await aTimeout(100);
      expect(visible(error)).to.be.true;
    });
  });

  describe('helperText property', () => {
    it('should set has-helper attribute when not empty', () => {
      group.helperText = 'foo';
      expect(group.hasAttribute('has-helper')).to.be.true;
    });

    it('should not set has-helper attribute when empty string is set', () => {
      group.helperText = '';
      expect(group.hasAttribute('has-helper')).to.be.false;
    });

    it('should not set has-helper attribute when null is set', () => {
      group.helperText = null;
      expect(group.hasAttribute('has-helper')).to.be.false;
    });

    it('setting helper with slot updates has-helper attribute', () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      group.appendChild(helper);
      group._observer.flush();
      expect(group.hasAttribute('has-helper')).to.be.true;
    });
  });

  describe('ARIA', () => {
    it('should have proper role', () => {
      expect(group.getAttribute('role')).to.eq('radiogroup');
    });

    it('should set aria-disabled to true when disabled', () => {
      group.disabled = true;
      expect(group.getAttribute('aria-disabled')).to.equal('true');
    });
  });
});

describe('radio-group initial value', () => {
  let group;
  let buttons;

  beforeEach(async () => {
    group = fixtureSync(`
      <vaadin-radio-group>
        <vaadin-radio-button>Button 1</vaadin-radio-button>
        <vaadin-radio-button value="1" checked>Button 2</vaadin-radio-button>
        <vaadin-radio-button value="2" checked>Button 3</vaadin-radio-button>
        <vaadin-radio-button>Button 4</vaadin-radio-button>
      </vaadin-radio-group>
    `);
    await nextFrame();
    buttons = group._radioButtons;
  });

  afterEach(() => {
    group.remove();
  });

  it('should set the value based on the initially checked radio button', () => {
    expect(group.value).to.be.equal('2');
  });

  it('should set the last initially checked button value as the radio group value', () => {
    expect(buttons[1].checked).to.be.false;
    expect(buttons[2].checked).to.be.true;
  });

  it('should reset the value of radio group if the checked radio button is removed', async () => {
    const button = buttons[2];
    group.removeChild(button);
    await nextFrame();
    expect(group.value).to.not.be.equal('2');
  });

  it('should work if value is set immediately after removing and adding new children', () => {
    const items = [
      { id: '1', name: 'item_1' },
      { id: '2', name: 'item_2' },
      { id: '3', name: 'item_3' },
      { id: '4', name: 'item_4' }
    ];
    let buttonSelected = 0;

    function removeAndAddChildrenAndSelectNext() {
      Array.from(group.children).forEach((button) => group.removeChild(button));
      items.forEach((item) => {
        const radio = document.createElement('vaadin-radio-button');
        radio.textContent = item.name;
        radio.value = item.id;
        group.appendChild(radio);
      });
      group.value = ++buttonSelected;
    }

    removeAndAddChildrenAndSelectNext();
    group._observer.flush();
    expect(+group.value).to.be.equal(buttonSelected);

    removeAndAddChildrenAndSelectNext();
    group._observer.flush();
    expect(+group.value).to.be.equal(buttonSelected);
  });
});

describe('radio-group helper slot', () => {
  let group;

  beforeEach(() => {
    group = fixtureSync(`
      <vaadin-radio-group>
        <div slot="helper">foo</div>
      </vaadin-radio-group>
    `);
    group._observer.flush();
  });

  afterEach(() => {
    group.remove();
  });

  it('should have has-helper attribute when slotted helper is present', () => {
    expect(group.hasAttribute('has-helper')).to.be.true;
  });

  it('should not have has-helper attribute when slotted helper is removed', () => {
    const helper = group.querySelector('[slot="helper"]');
    group.removeChild(helper);
    group._observer.flush();
    expect(group.hasAttribute('has-helper')).to.be.false;
  });
});

describe('radio-group wrapping', () => {
  let wrapper, group;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div style="width: 500px">
        <vaadin-radio-group>
          <vaadin-radio-button value="r_1">Radio button 1</vaadin-radio-button>
          <vaadin-radio-button value="r_2">Radio button 2</vaadin-radio-button>
          <vaadin-radio-button value="r_3">Radio button 3</vaadin-radio-button>
          <vaadin-radio-button value="r_4">Radio button 4</vaadin-radio-button>
          <vaadin-radio-button value="r_5">Radio button 5</vaadin-radio-button>
          <vaadin-radio-button value="r_6">Radio button 6</vaadin-radio-button>
          <vaadin-radio-button value="r_7">Radio button 7</vaadin-radio-button>
          <vaadin-radio-button value="r_8">Radio button 8</vaadin-radio-button>
          <vaadin-radio-button value="r_9">Radio button 9</vaadin-radio-button>
          <vaadin-radio-button value="r_10">Radio button 10</vaadin-radio-button>
          <vaadin-radio-button value="r_11">Radio button 11</vaadin-radio-button>
          <vaadin-radio-button value="r_12">Radio button 12</vaadin-radio-button>
        </vaadin-radio-group>
      </div>
    `);
    group = wrapper.firstElementChild;
    group._observer.flush();
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
