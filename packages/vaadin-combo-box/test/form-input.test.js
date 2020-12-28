import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { createEventSpy } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('form field', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box allow-custom-value></vaadin-combo-box>');
  });

  it('should be required', () => {
    comboBox.required = true;
    expect(comboBox.$.input.required).to.equal(true);
  });

  it('should not be required', () => {
    expect(comboBox.$.input.required).to.equal(false);
  });

  it('should be disabled', () => {
    comboBox.disabled = true;
    expect(comboBox.$.input.hasAttribute('disabled')).to.be.true;
  });

  it('should be read-only', () => {
    comboBox.readonly = true;
    expect(comboBox.$.input.readonly).to.be.true;
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
    let keydownEvent, preventDefault;

    beforeEach(() => {
      preventDefault = sinon.spy();

      // Fake a keydown event to mimic form submit.
      keydownEvent = createEventSpy('keydown', preventDefault);
      keydownEvent.keyCode = 13;
    });

    it('should prevent default on open combobox', () => {
      comboBox.open();
      comboBox.dispatchEvent(keydownEvent);
      expect(preventDefault.called).to.be.true;
    });

    it('should not prevent default on closed combobox', () => {
      comboBox.dispatchEvent(keydownEvent);
      expect(preventDefault.called).to.be.false;
    });
  });
});
