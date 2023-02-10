import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-area.js';

describe('text-area', () => {
  let textArea;

  beforeEach(async () => {
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    await nextRender();
  });

  function setInputValue(textArea, value) {
    textArea.inputElement.value = value;
    fire(textArea.inputElement, 'input');
  }

  describe('properties', () => {
    let native;

    beforeEach(() => {
      native = textArea.inputElement;
    });

    describe('native', () => {
      async function assertAttrCanBeSet(prop, value) {
        textArea[prop] = value;
        await nextFrame();

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
        it(`should set string property ${prop}`, async () => {
          textArea[prop] = 'foo';
          await nextFrame();
          expect(native[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, async () => {
          textArea[prop] = true;
          await nextFrame();
          expect(native[prop]).to.be.true;

          textArea[prop] = false;
          await nextFrame();
          expect(native[prop]).to.be.false;
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should set numeric attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, true);
          await assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('value', () => {
      it('should set default value to empty string', () => {
        expect(textArea.value).to.be.equal('');
      });

      it('should update value on native textarea input', () => {
        setInputValue(textArea, 'foo');
        expect(textArea.value).to.be.equal('foo');
      });

      it('should update has-value attribute when value is set', async () => {
        textArea.value = 'foo';
        await nextFrame();
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should not update has-value attribute when value is set to undefined', async () => {
        textArea.value = undefined;
        await nextFrame();
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      it('should not update has-value attribute when value is set to empty string', async () => {
        textArea.value = '';
        await nextFrame();
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('should update has-value attribute when numeric value is set', async () => {
        textArea.value = 0;
        await nextFrame();
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should update has-value attribute when boolean value is set', async () => {
        textArea.value = false;
        await nextFrame();
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });
    });
  });

  describe('vaadin-text-area-appear', () => {
    it('should update height on show after hidden', async () => {
      const savedHeight = textArea.clientHeight;
      textArea.style.display = 'none';
      // Three new lines will expand initial height
      setInputValue(textArea, '\n\n\n');
      textArea.style.display = 'block';
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
      await nextFrame();

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
      await nextFrame();

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
      await nextFrame();

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
      await nextFrame();

      expect(window.getComputedStyle(textArea).height).to.be.equal('175px');
      expect(window.getComputedStyle(container).height).to.be.equal('175px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(150);
    });

    it('should increase input container height', async () => {
      textArea.style.height = '200px';
      textArea.value = 'foo';
      await nextFrame();
      expect(inputField.clientHeight).to.be.closeTo(200, 10);
    });

    it('should maintain scroll top', async () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      await nextFrame();

      inputField.scrollTop = 200;
      textArea.value += 'foo';
      await nextFrame();

      expect(inputField.scrollTop).to.equal(200);
    });

    it('should decrease height automatically', async () => {
      textArea.value = Array(400).join('400');
      await nextFrame();

      const height = textArea.clientHeight;
      textArea.value = '';
      await nextFrame();

      expect(textArea.clientHeight).to.be.below(height);
    });

    it('should not change height', async () => {
      textArea.style.maxHeight = '100px';

      const value = Array(400).join('400');
      setInputValue(textArea, value);
      await nextFrame();
      const height = textArea.clientHeight;

      setInputValue(textArea, value.slice(0, -1));
      await nextFrame();
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

    it('should have matching height', async () => {
      inputField.style.padding = '0';
      textArea.style.maxHeight = '100px';

      textArea.value = Array(400).join('400');
      await nextFrame();

      textArea.value = textArea.value.slice(0, -1);
      await nextFrame();
      expect(native.clientHeight).to.equal(inputField.scrollHeight);
    });

    it('should cover native textarea', async () => {
      inputField.style.padding = '0';
      inputField.style.border = 'none';
      textArea.style.minHeight = '300px';
      textArea.style.padding = '0';

      textArea.value = 'foo';
      await nextFrame();

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

      beforeEach(async () => {
        textArea.style.height = '100px';
        textArea.value = 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz';
        await nextFrame();
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
});
