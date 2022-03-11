import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-area.js';

describe('text-area', () => {
  let textArea;

  beforeEach(async () => {
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    await textArea.updateComplete;
  });

  describe('properties', () => {
    let native;

    beforeEach(() => {
      native = textArea.inputElement;
    });

    describe('native', () => {
      async function assertAttrCanBeSet(prop, value) {
        textArea[prop] = value;
        await textArea.updateComplete;

        const attrValue = native.getAttribute(prop);

        if (value === true) {
          expect(attrValue).not.to.be.null;
        } else if (value === false) {
          expect(attrValue).to.be.null;
        } else if (value) {
          expect(attrValue).to.be.equal(String(value));
        }
      }

      ['placeholder', 'value'].forEach((prop) => {
        it('should set string property ' + prop, async () => {
          textArea[prop] = 'foo';
          await textArea.updateComplete;
          expect(native[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it('should set boolean property ' + prop, async () => {
          textArea[prop] = true;
          await textArea.updateComplete;
          expect(native[prop]).to.be.equal(true);

          textArea[prop] = false;
          await textArea.updateComplete;
          expect(native[prop]).to.be.false;
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it('should set numeric attribute ' + prop, async () => {
          await assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it('should set boolean attribute ' + prop, async () => {
          await assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it('should set boolean attribute ' + prop, async () => {
          await assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it('should set boolean attribute ' + prop, async () => {
          await assertAttrCanBeSet(prop, true);
          await assertAttrCanBeSet(prop, false);
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

      it('should update has-value attribute when value is set', async () => {
        textArea.value = 'foo';
        await textArea.updateComplete;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should not update has-value attribute when value is set to undefined', async () => {
        textArea.value = undefined;
        await textArea.updateComplete;
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      it('should not update has-value attribute when value is set to empty string', async () => {
        textArea.value = '';
        await textArea.updateComplete;
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('should update has-value attribute when numeric value is set', async () => {
        textArea.value = 0;
        await textArea.updateComplete;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should update has-value attribute when boolean value is set', async () => {
        textArea.value = false;
        await textArea.updateComplete;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });
    });

    describe('validation', () => {
      it('should not validate the field when minlength is set', async () => {
        textArea.minlength = 2;
        await textArea.updateComplete;
        expect(textArea.invalid).to.be.false;
      });

      it('should not validate the field when maxlength is set', async () => {
        textArea.maxlength = 6;
        await textArea.updateComplete;
        expect(textArea.invalid).to.be.false;
      });

      it('should validate the field when invalid after minlength is changed', async () => {
        textArea.invalid = true;
        await textArea.updateComplete;
        const spy = sinon.spy(textArea, 'validate');
        textArea.minlength = 2;
        await textArea.updateComplete;
        expect(spy.calledOnce).to.be.true;
      });

      it('should validate the field when invalid after maxlength is changed', async () => {
        textArea.invalid = true;
        await textArea.updateComplete;
        const spy = sinon.spy(textArea, 'validate');
        textArea.maxlength = 6;
        await textArea.updateComplete;
        expect(spy.calledOnce).to.be.true;
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
    beforeEach(async () => {
      textArea.preventInvalidInput = true;
      textArea.value = '1';
      await textArea.updateComplete;
    });

    function inputText(value) {
      textArea.inputElement.value = value;
      textArea.inputElement.dispatchEvent(new CustomEvent('input'));
    }

    it('should prevent non matching input', async () => {
      textArea.pattern = '[0-9]*';
      await textArea.updateComplete;
      inputText('f');
      expect(textArea.inputElement.value).to.equal('1');
    });

    it('should not prevent input when pattern is invalid', async () => {
      textArea.pattern = '[0-9])))]*';
      await textArea.updateComplete;
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

    it('should grow height with unwrapped text', async () => {
      const originalHeight = parseInt(window.getComputedStyle(inputField).height);

      // Make sure there are enough characters to grow the textarea
      textArea.value = Array(400).join('400');
      await textArea.updateComplete;

      const newHeight = parseInt(window.getComputedStyle(inputField).height);
      expect(newHeight).to.be.at.least(originalHeight + 10);
    });

    it('should not grow over max-height', async () => {
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
      await textArea.updateComplete;

      expect(parseFloat(window.getComputedStyle(textArea).height)).to.be.lte(100);
      expect(parseFloat(window.getComputedStyle(container).height)).to.be.lte(100);
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.lte(100);
    });

    it('should not shrink less than min-height', async () => {
      textArea.style.minHeight = '125px';

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(window.getComputedStyle(container).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);

      // Check that value modification doesn't break min-height rule
      textArea.value = '1 row';
      await textArea.updateComplete;

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(window.getComputedStyle(container).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);
    });

    it('should stay between min and max height', async () => {
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
      await textArea.updateComplete;

      expect(window.getComputedStyle(textArea).height).to.be.equal('175px');
      expect(window.getComputedStyle(container).height).to.be.equal('175px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(150);
    });

    it('should increase inputField height', async () => {
      textArea.style.height = '200px';
      textArea.value = 'foo';
      await textArea.updateComplete;
      expect(inputField.clientHeight).to.be.closeTo(200, 10);
    });

    it('should maintain scroll top', async () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      await textArea.updateComplete;

      inputField.scrollTop = 200;
      textArea.value += 'foo';
      await textArea.updateComplete;

      expect(inputField.scrollTop).to.equal(200);
    });

    it('should decrease height automatically', async () => {
      textArea.value = Array(400).join('400');
      await textArea.updateComplete;

      const height = textArea.clientHeight;
      textArea.value = '';
      await textArea.updateComplete;

      expect(textArea.clientHeight).to.be.below(height);
    });

    it('should not change height', async () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      await textArea.updateComplete;

      const height = textArea.clientHeight;
      textArea.value = textArea.value.slice(0, -1);
      await textArea.updateComplete;

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
            parseFloat(getComputedStyle(inputField).borderRightWidth)
        )
      );
    });

    it('should have matching height', async () => {
      inputField.style.padding = '0';
      textArea.style.maxHeight = '100px';

      textArea.value = Array(400).join('400');
      await textArea.updateComplete;

      textArea.value = textArea.value.slice(0, -1);
      await textArea.updateComplete;
      expect(native.clientHeight).to.equal(inputField.scrollHeight);
    });

    it('should cover native field', async () => {
      inputField.style.padding = '0';
      inputField.style.border = 'none';
      textArea.style.minHeight = '300px';
      textArea.style.padding = '0';
      textArea.value = 'foo';
      await textArea.updateComplete;

      expect(native.clientHeight).to.equal(
        Math.round(
          textArea.clientHeight -
            parseFloat(getComputedStyle(inputField).marginTop) -
            parseFloat(getComputedStyle(inputField).marginBottom) -
            parseFloat(getComputedStyle(inputField).paddingTop) -
            parseFloat(getComputedStyle(inputField).paddingBottom) -
            parseFloat(getComputedStyle(inputField).borderTopWidth) -
            parseFloat(getComputedStyle(inputField).borderBottomWidth)
        )
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

      beforeEach(async () => {
        textArea.style.height = '100px';
        textArea.value = 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz';
        await textArea.updateComplete;
      });

      it('should be 0 initially', () => {
        expect(getVerticalScrollPosition()).to.equal('0px');
      });

      it('should update value on scroll', async () => {
        inputField.scrollTop = 10;
        await nextFrame();
        expect(getVerticalScrollPosition()).to.equal('10px');
      });

      it('should update value on wheel', async () => {
        wheel({ deltaY: 10 });
        expect(getVerticalScrollPosition()).to.equal('10px');
      });

      it('should scroll on wheel', async () => {
        wheel({ deltaY: 10 });
        expect(inputField.scrollTop).to.equal(10);
      });

      it('should cancel wheel event', () => {
        const e = wheel({ deltaY: 10 });
        expect(e.defaultPrevented).to.be.true;
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

    beforeEach(async () => {
      element = fixtureSync('<vaadin-text-area></vaadin-text-area>');
      await textArea.updateComplete;
    });

    it('should be valid when pattern property is not set', async () => {
      element.pattern = null;
      await textArea.updateComplete;
      userSetValue('abc');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property is empty', async () => {
      element.pattern = '[A-Z]+';
      await textArea.updateComplete;
      userSetValue('');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property matches the pattern', async () => {
      element.pattern = '[A-Z]{1}';
      await textArea.updateComplete;
      userSetValue('A');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value property matches the pattern (multiline)', async () => {
      element.pattern = '[A-Z\n]{3}';
      await textArea.updateComplete;
      userSetValue('A\nJ');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when unicode value property matches the pattern', async () => {
      element.pattern = '[A-Z]+';
      await textArea.updateComplete;
      userSetValue('\u0041\u0042\u0043');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be invalid when value property mismatches the pattern', async () => {
      element.pattern = '[a-z]{3,}';
      await textArea.updateComplete;
      userSetValue('ABCD');
      await textArea.updateComplete;
      expect(element.validate()).to.be.false;
    });

    it('should be invalid when value property mismatches the pattern, even if a subset matches', async () => {
      element.pattern = '[A-Z]+';
      await textArea.updateComplete;
      userSetValue('ABC123');
      await textArea.updateComplete;
      expect(element.validate()).to.be.false;
    });

    it('should be valid when pattern contains invalid regular expression', async () => {
      element.pattern = '(abc';
      await textArea.updateComplete;
      userSetValue('de');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when pattern tries to escape a group', async () => {
      element.pattern = 'a)(b';
      await textArea.updateComplete;
      userSetValue('de');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when pattern uses Unicode features', async () => {
      element.pattern = 'a\u{10FFFF}';
      await textArea.updateComplete;
      userSetValue('a\u{10FFFF}');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be valid when value matches JavaScript-specific regular expression', async () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      await textArea.updateComplete;
      userSetValue('\u1234\x18[6');
      await textArea.updateComplete;
      expect(element.validate()).to.be.true;
    });

    it('should be invalid when value mismatches JavaScript-specific regular expression', async () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      await textArea.updateComplete;
      userSetValue('\u1234\x18[4');
      await textArea.updateComplete;
      expect(element.validate()).to.be.false;
    });
  });
});
