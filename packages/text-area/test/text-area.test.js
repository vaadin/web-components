import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-area.js';

describe('text-area', () => {
  let textArea;

  beforeEach(() => {
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
  });

  describe('properties', () => {
    let native;

    beforeEach(() => {
      native = textArea.inputElement;
    });

    describe('native', () => {
      function assertAttrCanBeSet(prop, value) {
        textArea[prop] = value;
        const attrValue = native.getAttribute(prop);

        if (value === true) {
          expect(attrValue).not.to.be.null;
        } else if (value === false) {
          expect(attrValue).to.be.null;
        } else if (value) {
          expect(attrValue).to.be.equal(String(value));
        }
      }

      function assertPropCanBeSet(prop, value) {
        for (let i = 0; i < 3; i++) {
          // Check different values
          const newValue = typeof value === 'boolean' ? i % 2 === 0 : value + i;
          textArea[prop] = newValue;
          expect(native[prop]).to.be.equal(newValue);
        }
      }

      ['placeholder', 'value'].forEach((prop) => {
        it(`should set string property ${prop}`, () => {
          assertPropCanBeSet(prop, 'foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, () => {
          assertPropCanBeSet(prop, true);
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should set numeric attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, true);
          assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('binding', () => {
      it('should set default value to empty string', () => {
        expect(textArea.value).to.be.equal('');
      });

      it('should update value on native textarea input', () => {
        native.value = 'foo';
        native.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
        expect(textArea.value).to.be.equal('foo');
      });

      it('should update has-value attribute when value is set', () => {
        textArea.value = 'foo';
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should not update has-value attribute when value is set to undefined', () => {
        textArea.value = undefined;
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      it('should not update has-value attribute when value is set to empty string', () => {
        textArea.value = '';
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('should update has-value attribute when numeric value is set', () => {
        textArea.value = 0;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should update has-value attribute when boolean value is set', () => {
        textArea.value = false;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });
    });

    describe('initial validation', () => {
      let validateSpy;

      beforeEach(() => {
        textArea = document.createElement('vaadin-text-area');
        validateSpy = sinon.spy(textArea, 'validate');
      });

      afterEach(() => {
        textArea.remove();
      });

      it('should not validate by default', async () => {
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when the field has an initial value', async () => {
        textArea.value = 'Initial Value';
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when the field has an initial value and invalid', async () => {
        textArea.value = 'Initial Value';
        textArea.invalid = true;
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });
    });

    describe('validation', () => {
      it('should not validate the field when minlength is set', () => {
        textArea.minlength = 2;
        expect(textArea.invalid).to.be.false;
      });

      it('should not validate the field when maxlength is set', () => {
        textArea.maxlength = 6;
        expect(textArea.invalid).to.be.false;
      });

      it('should validate the field when invalid after minlength is changed', () => {
        textArea.invalid = true;
        const spy = sinon.spy(textArea, 'validate');
        textArea.minlength = 2;
        expect(spy.calledOnce).to.be.true;
      });

      it('should validate the field when invalid after maxlength is changed', () => {
        textArea.invalid = true;
        const spy = sinon.spy(textArea, 'validate');
        textArea.maxlength = 6;
        expect(spy.calledOnce).to.be.true;
      });

      it('should fire a validated event on validation success', () => {
        const validatedSpy = sinon.spy();
        textArea.addEventListener('validated', validatedSpy);
        textArea.validate();

        expect(validatedSpy.calledOnce).to.be.true;
        const event = validatedSpy.firstCall.args[0];
        expect(event.detail.valid).to.be.true;
      });

      it('should fire a validated event on validation failure', () => {
        const validatedSpy = sinon.spy();
        textArea.addEventListener('validated', validatedSpy);
        textArea.required = true;
        textArea.validate();

        expect(validatedSpy.calledOnce).to.be.true;
        const event = validatedSpy.firstCall.args[0];
        expect(event.detail.valid).to.be.false;
      });
    });
  });

  describe('vaadin-text-area-appear', () => {
    it('should update height on show after hidden', async () => {
      const savedHeight = textArea.clientHeight;
      textArea.hidden = true;
      // Three new lines will expand initial height
      textArea.value = '\n\n\n';
      textArea.hidden = false;
      await oneEvent(textArea, 'animationend');
      expect(textArea.clientHeight).to.be.above(savedHeight);
    });

    it('should not update height on custom animation name', () => {
      const spy = sinon.spy(textArea, '_updateHeight');
      const ev = new Event('animationend');
      ev.animationName = 'foo';
      textArea.dispatchEvent(ev);
      expect(spy.called).to.be.false;
    });
  });

  describe('prevent invalid input', () => {
    beforeEach(() => {
      textArea.preventInvalidInput = true;
      textArea.value = '1';
    });

    function inputText(value) {
      textArea.inputElement.value = value;
      textArea.inputElement.dispatchEvent(new CustomEvent('input'));
    }

    it('should prevent non matching input', () => {
      textArea.pattern = '[0-9]*';
      inputText('f');
      expect(textArea.inputElement.value).to.equal('1');
    });

    it('should not prevent input when pattern is invalid', () => {
      textArea.pattern = '[0-9])))]*';
      inputText('f');
      expect(textArea.inputElement.value).to.equal('f');
    });
  });

  describe('multi-line', () => {
    let native, container, inputField;

    beforeEach(() => {
      native = textArea.inputElement;
      inputField = textArea.shadowRoot.querySelector('[part=input-field]');
      container = textArea.shadowRoot.querySelector('.vaadin-text-area-container');
    });

    it('should grow height with unwrapped text', () => {
      const originalHeight = parseInt(window.getComputedStyle(inputField).height);

      // Make sure there are enough characters to grow the textarea
      textArea.value = Array(400).join('400');

      const newHeight = parseInt(window.getComputedStyle(inputField).height);
      expect(newHeight).to.be.at.least(originalHeight + 10);
    });

    it('should not grow over max-height', () => {
      inputField.style.padding = '0';
      inputField.style.border = 'none';
      textArea.style.maxHeight = '100px';

      textArea.value = `
        there
        should
        be
        a
        lot
        of
        rows`;

      expect(parseFloat(window.getComputedStyle(textArea).height)).to.be.lte(100);
      expect(parseFloat(window.getComputedStyle(container).height)).to.be.lte(100);
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.lte(100);
    });

    it('should not shrink less than min-height', () => {
      textArea.style.minHeight = '125px';

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(window.getComputedStyle(container).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);

      // Check that value modification doesn't break min-height rule
      textArea.value = '1 row';

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(window.getComputedStyle(container).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);
    });

    it('should stay between min and max height', () => {
      textArea.style.minHeight = '100px';
      textArea.style.maxHeight = '175px';

      expect(window.getComputedStyle(textArea).height).to.be.equal('100px');
      expect(window.getComputedStyle(container).height).to.be.equal('100px');

      // Check that value modification doesn't break min-height rule
      textArea.value = `
        there
        should
        be
        a
        lot
        of
        rows
        and
        more
        and
        even
        more`;

      expect(window.getComputedStyle(textArea).height).to.be.equal('175px');
      expect(window.getComputedStyle(container).height).to.be.equal('175px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(150);
    });

    it('should increase inputField height', () => {
      textArea.style.height = '200px';
      textArea.value = 'foo';
      expect(inputField.clientHeight).to.be.closeTo(200, 10);
    });

    it('should maintain scroll top', () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      inputField.scrollTop = 200;
      textArea.value += 'foo';
      expect(inputField.scrollTop).to.equal(200);
    });

    it('should decrease height automatically', () => {
      textArea.value = Array(400).join('400');
      const height = textArea.clientHeight;
      textArea.value = '';
      expect(textArea.clientHeight).to.be.below(height);
    });

    it('should not change height', () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      const height = textArea.clientHeight;

      textArea.value = textArea.value.slice(0, -1);
      expect(textArea.clientHeight).to.equal(height);
    });

    it('should have the correct width', () => {
      textArea.style.width = '300px';
      expect(native.clientWidth).to.equal(
        Math.round(
          textArea.clientWidth -
            parseFloat(getComputedStyle(inputField).marginLeft) -
            parseFloat(getComputedStyle(inputField).marginRight) -
            parseFloat(getComputedStyle(inputField).paddingLeft) -
            parseFloat(getComputedStyle(inputField).paddingRight) -
            parseFloat(getComputedStyle(inputField).borderLeftWidth) -
            parseFloat(getComputedStyle(inputField).borderRightWidth),
        ),
      );
    });

    it('should have matching height', () => {
      inputField.style.padding = '0';
      textArea.style.maxHeight = '100px';

      textArea.value = Array(400).join('400');
      textArea.value = textArea.value.slice(0, -1);
      expect(native.clientHeight).to.equal(inputField.scrollHeight);
    });

    it('should cover native field', () => {
      inputField.style.padding = '0';
      inputField.style.border = 'none';
      textArea.style.minHeight = '300px';
      textArea.style.padding = '0';
      textArea.value = 'foo';

      expect(native.clientHeight).to.equal(
        Math.round(
          textArea.clientHeight -
            parseFloat(getComputedStyle(inputField).marginTop) -
            parseFloat(getComputedStyle(inputField).marginBottom) -
            parseFloat(getComputedStyle(inputField).paddingTop) -
            parseFloat(getComputedStyle(inputField).paddingBottom) -
            parseFloat(getComputedStyle(inputField).borderTopWidth) -
            parseFloat(getComputedStyle(inputField).borderBottomWidth),
        ),
      );
    });

    describe('--_text-area-vertical-scroll-position CSS variable', () => {
      function wheel({ element = inputField, deltaY = 0 }) {
        const e = new CustomEvent('wheel', { bubbles: true, cancelable: true });
        e.deltaY = deltaY;
        e.deltaX = 0;
        element.dispatchEvent(e);
        return e;
      }

      function getVerticalScrollPosition() {
        return textArea.shadowRoot
          .querySelector('[part="input-field"]')
          .style.getPropertyValue('--_text-area-vertical-scroll-position');
      }

      beforeEach(() => {
        textArea.style.height = '100px';
        textArea.value = 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz';
      });

      it('should be 0 initially', () => {
        expect(getVerticalScrollPosition()).to.equal('0px');
      });

      it('should update value on scroll', async () => {
        inputField.scrollTop = 10;
        await nextFrame();
        expect(getVerticalScrollPosition()).to.equal('10px');
      });

      it('should update value on wheel', () => {
        wheel({ deltaY: 10 });
        expect(getVerticalScrollPosition()).to.equal('10px');
      });

      it('should scroll on wheel', () => {
        wheel({ deltaY: 10 });
        expect(inputField.scrollTop).to.equal(10);
      });

      it('should cancel wheel event', () => {
        const e = wheel({ deltaY: 10 });
        expect(e.defaultPrevented).to.be.true;
      });

      it('should not cancel wheel event if text area is not scrolled', () => {
        const e = wheel({ deltaY: -10 });
        expect(e.defaultPrevented).to.be.false;
      });

      it('should update value on resize', async () => {
        inputField.scrollTop = 10;
        await nextFrame();
        textArea.style.height = `${inputField.scrollHeight}px`;
        await nextFrame();
        expect(getVerticalScrollPosition()).to.equal('0px');
      });
    });
  });

  describe('pattern', () => {
    // https://github.com/web-platform-tests/wpt/blob/7b0ebaccc62b566a1965396e5be7bb2bc06f841f/html/semantics/forms/constraints/form-validation-validity-patternMismatch.html

    let element;

    function userSetValue(value) {
      element.value = value;
      element.dispatchEvent(new CustomEvent('input'));
    }

    beforeEach(() => {
      element = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    });

    it('should be valid when pattern property is not set', () => {
      element.pattern = null;
      userSetValue('abc');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property is empty', () => {
      element.pattern = '[A-Z]+';
      userSetValue('');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property matches the pattern', () => {
      element.pattern = '[A-Z]{1}';
      userSetValue('A');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property matches the pattern (multiline)', () => {
      element.pattern = '[A-Z\n]{3}';
      userSetValue('A\nJ');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when unicode value property matches the pattern', () => {
      element.pattern = '[A-Z]+';
      userSetValue('\u0041\u0042\u0043');
      expect(element.validate()).to.be.true;
    });

    it('should be invalid when value property mismatches the pattern', () => {
      element.pattern = '[a-z]{3,}';
      userSetValue('ABCD');
      expect(element.validate()).to.be.false;
    });

    it('should be invalid when value property mismatches the pattern, even if a subset matches', () => {
      element.pattern = '[A-Z]+';
      userSetValue('ABC123');
      expect(element.validate()).to.be.false;
    });

    it('should be valid when pattern contains invalid regular expression', () => {
      element.pattern = '(abc';
      userSetValue('de');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when pattern tries to escape a group', () => {
      element.pattern = 'a)(b';
      userSetValue('de');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when pattern uses Unicode features', () => {
      element.pattern = 'a\u{10FFFF}';
      userSetValue('a\u{10FFFF}');
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value matches JavaScript-specific regular expression', () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      userSetValue('\u1234\x18[6');
      expect(element.validate()).to.be.true;
    });

    it('should be invalid when value mismatches JavaScript-specific regular expression', () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      userSetValue('\u1234\x18[4');
      expect(element.validate()).to.be.false;
    });
  });
});
