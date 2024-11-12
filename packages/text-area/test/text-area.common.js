import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver has processed a resize.
 */
async function onceResized(element) {
  await onceInvoked(element, '_onResize');
}

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
        await nextUpdate(textArea);

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
          await nextUpdate(textArea);
          expect(native[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, async () => {
          textArea[prop] = true;
          await nextUpdate(textArea);
          expect(native[prop]).to.be.true;

          textArea[prop] = false;
          await nextUpdate(textArea);
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
        await nextUpdate(textArea);
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should not update has-value attribute when value is set to undefined', async () => {
        textArea.value = undefined;
        await nextUpdate(textArea);
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      it('should not update has-value attribute when value is set to empty string', async () => {
        textArea.value = '';
        await nextUpdate(textArea);
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('should update has-value attribute when numeric value is set', async () => {
        textArea.value = 0;
        await nextUpdate(textArea);
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('should update has-value attribute when boolean value is set', async () => {
        textArea.value = false;
        await nextUpdate(textArea);
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
      await nextUpdate(textArea);

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
      await nextUpdate(textArea);

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
      await nextUpdate(textArea);

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
      await nextUpdate(textArea);

      expect(window.getComputedStyle(textArea).height).to.be.equal('175px');
      expect(window.getComputedStyle(container).height).to.be.equal('175px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(150);
    });

    it('should increase input container height', async () => {
      textArea.style.height = '200px';
      textArea.value = 'foo';
      await nextUpdate(textArea);
      expect(inputField.clientHeight).to.be.closeTo(200, 10);
    });

    it('should maintain scroll top', async () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(400).join('400');
      await nextUpdate(textArea);

      inputField.scrollTop = 200;
      textArea.value += 'foo';
      await nextUpdate(textArea);

      expect(inputField.scrollTop).to.equal(200);
    });

    it('should decrease height automatically', async () => {
      textArea.value = Array(400).join('400');
      await nextUpdate(textArea);

      const height = textArea.clientHeight;
      textArea.value = '';
      await nextUpdate(textArea);

      expect(textArea.clientHeight).to.be.below(height);
    });

    it('should not change height', async () => {
      textArea.style.maxHeight = '100px';

      const value = Array(400).join('400');
      setInputValue(textArea, value);
      await nextUpdate(textArea);
      const height = textArea.clientHeight;

      setInputValue(textArea, value.slice(0, -1));
      await nextUpdate(textArea);
      expect(textArea.clientHeight).to.equal(height);
    });

    it('should change height automatically on width change', async () => {
      // Make the textarea wide and fill it with text
      textArea.style.width = '800px';
      textArea.value = Array(400).join('400');
      await nextUpdate(textArea);
      const height = textArea.offsetHeight;

      // Decrease the width
      textArea.style.width = '400px';
      await onceResized(textArea);

      // Expect the height to have increased
      expect(textArea.offsetHeight).to.be.above(height);
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
      await nextUpdate(textArea);

      textArea.value = textArea.value.slice(0, -1);
      await nextUpdate(textArea);
      expect(native.clientHeight).to.equal(inputField.scrollHeight);
    });

    it('should cover native textarea', async () => {
      inputField.style.padding = '0';
      inputField.style.border = 'none';
      textArea.style.minHeight = '300px';
      textArea.style.padding = '0';

      textArea.value = 'foo';
      await nextUpdate(textArea);

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

    describe('min and max rows', () => {
      const lineHeight = 20;
      beforeEach(async () => {
        const fixture = fixtureSync(`
          <div>
            <style>
              vaadin-text-area textarea {
                line-height: ${lineHeight}px;
              }
              vaadin-text-area::part(input-field) {
                box-sizing: border-box;
              }
            </style>
            <vaadin-text-area></vaadin-text-area>
          </div>
        `);
        textArea = fixture.querySelector('vaadin-text-area');
        await nextUpdate(textArea);
      });

      it('should use min-height of two rows by default', () => {
        expect(textArea.clientHeight).to.equal(lineHeight * 2);
      });

      it('should use min-height based on minimum rows', async () => {
        textArea.minRows = 4;
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4);
      });

      it('should be able to set min-height of one row', async () => {
        textArea.minRows = 1;
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.closeTo(lineHeight, 1);
      });

      it('should use max-height based on maximum rows', async () => {
        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4);
      });

      it('should include margins and paddings when calculating max-height', async () => {
        const native = textArea.querySelector('textarea');
        const inputContainer = textArea.shadowRoot.querySelector('[part="input-field"]');
        native.style.paddingTop = '5px';
        native.style.paddingBottom = '10px';
        native.style.marginTop = '15px';
        native.style.marginBottom = '20px';
        inputContainer.style.paddingTop = '25px';
        inputContainer.style.paddingBottom = '30px';

        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + 5 + 10 + 15 + 20 + 25 + 30);
      });
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
        await nextUpdate(textArea);
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
        await nextUpdate(textArea);
        textArea.style.height = `${inputField.scrollHeight}px`;
        await nextUpdate(textArea);
        expect(getVerticalScrollPosition()).to.equal('0px');
      });
    });
  });

  describe('programmatic scrolling', () => {
    beforeEach(() => {
      textArea.value = Array(400).join('400');
      textArea.style.height = '300px';
    });

    it('should scroll to start', () => {
      textArea._inputField.scrollTop = 100; // Simulate scrolling
      textArea.scrollToStart();
      expect(textArea._inputField.scrollTop).to.equal(0);
    });

    it('should scroll to end', () => {
      textArea.scrollToStart();
      expect(textArea._inputField.scrollTop).to.equal(0);
      textArea.scrollToEnd();
      expect(textArea._inputField.scrollTop).to.equal(
        textArea._inputField.scrollHeight - textArea._inputField.clientHeight,
      );
    });
  });
});
