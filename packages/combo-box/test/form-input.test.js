import { expect } from '@esm-bundle/chai';
import { fixtureSync, keyboardEventFor } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('form field', () => {
  let comboBox, input;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box allow-custom-value></vaadin-combo-box>');
    input = comboBox.inputElement;
  });

  it('should not be required by default', () => {
    expect(input.required).to.be.false;
  });

  it('should set required property to input', () => {
    comboBox.required = true;
    expect(input.required).to.be.true;
  });

  it('should set disabled property to input', () => {
    comboBox.disabled = true;
    expect(input.hasAttribute('disabled')).to.be.true;
  });

  it('should set readonly property to input', () => {
    comboBox.readonly = true;
    expect(input.readOnly).to.be.true;
  });

  it('should validate correctly when input value is invalid', () => {
    comboBox.name = 'foo';
    comboBox.required = true;

    expect(comboBox.validate()).to.equal(false);
    expect(comboBox.invalid).to.be.equal(true);
  });

  it('should validate correctly when input value is valid', () => {
    comboBox.name = 'foo';
    comboBox.required = true;
    comboBox.value = 'foo';

    expect(comboBox.validate()).to.equal(true);
    expect(comboBox.invalid).to.be.equal(false);
  });

  describe('enter key behavior', () => {
    let keydownEvent;

    beforeEach(() => {
      // Fake a keydown event to mimic form submit.
      keydownEvent = keyboardEventFor('keydown', 13, [], 'Enter');
    });

    it('should prevent default on open combobox', () => {
      comboBox.open();
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.true;
    });

    it('should not prevent default on closed combobox', () => {
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.false;
    });
  });
});
