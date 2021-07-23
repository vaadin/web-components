import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { TextArea } from '../src/vaadin-text-area.js';

customElements.define('vaadin-text-area', TextArea);

describe('text-area', () => {
  let textArea;

  beforeEach(() => {
    textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
  });

  describe('properties', () => {
    let native;

    beforeEach(() => {
      native = textArea._inputNode;
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
        it('should set string property ' + prop, () => {
          assertPropCanBeSet(prop, 'foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it('should set boolean property ' + prop, () => {
          assertPropCanBeSet(prop, true);
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it('should set numeric attribute ' + prop, () => {
          assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it('should set boolean attribute ' + prop, () => {
          assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it('should set boolean attribute ' + prop, () => {
          assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it('should set boolean attribute ' + prop, () => {
          assertAttrCanBeSet(prop, true);
          assertAttrCanBeSet(prop, false);
        });
      });

      describe('input field', () => {
        let inputField;

        beforeEach(() => {
          inputField = textArea.shadowRoot.querySelector('[part="input-field"]');
        });

        it('should propagate invalid property to the input container', () => {
          textArea.invalid = true;
          expect(inputField.invalid).to.be.true;

          textArea.invalid = false;
          expect(inputField.invalid).to.be.false;
        });

        it('should propagate readonly property to the input container', () => {
          textArea.readonly = true;
          expect(inputField.readonly).to.be.true;

          textArea.readonly = false;
          expect(inputField.readonly).to.be.false;
        });

        it('should propagate disabled property to the input container', () => {
          textArea.disabled = true;
          expect(inputField.disabled).to.be.true;

          textArea.disabled = false;
          expect(inputField.disabled).to.be.false;
        });

        it('should propagate theme attribute to the input container', () => {
          textArea.setAttribute('theme', 'align-center');
          expect(inputField.getAttribute('theme')).to.equal('align-center');
        });
      });
    });

    describe('binding', () => {
      it('default value should be empty string', () => {
        expect(textArea.value).to.be.equal('');
      });

      it('setting textarea value updates value', () => {
        native.value = 'foo';
        native.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
        expect(textArea.value).to.be.equal('foo');
      });

      it('setting native value updates has-value attribute', () => {
        textArea.value = 'foo';
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('setting value to undefined should not update has-value attribute', () => {
        textArea.value = undefined;
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      it('setting empty value does not update has-value attribute', () => {
        textArea.value = '';
        expect(textArea.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('setting number value updates has-value attribute', () => {
        textArea.value = 0;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });

      it('setting boolean value updates has-value attribute', () => {
        textArea.value = false;
        expect(textArea.hasAttribute('has-value')).to.be.true;
      });
    });

    describe('label', () => {
      it('should not update focused property on click if disabled', () => {
        textArea.disabled = true;
        const label = textArea.shadowRoot.querySelector('[part="label"]');
        label.click();
        expect(textArea.getAttribute('focused')).to.be.null;
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

  describe('multi-line', () => {
    let native, container, inputField;

    beforeEach(() => {
      native = textArea._inputNode;
      inputField = textArea.shadowRoot.querySelector('[part=input-field]');
      container = textArea.shadowRoot.querySelector('[part=container]');
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
            parseFloat(getComputedStyle(inputField).borderRightWidth)
        )
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
            parseFloat(getComputedStyle(inputField).borderBottomWidth)
        )
      );
    });
  });

  describe('resize', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      textArea.addEventListener('iron-resize', spy);
    });

    it('should not dispatch `iron-resize` event on init', () => {
      expect(spy.callCount).to.equal(0);
    });

    it('should dispatch `iron-resize` event on height change', () => {
      textArea.value = `
        there
        should
        be
        a
        lot
        of
        rows`;
      expect(spy.callCount).to.equal(1);
    });

    it('should not dispatch `iron-resize` event on value change if height did not change', () => {
      textArea.value = 'just 1 row';
      expect(spy.callCount).to.equal(0);
    });
  });
});
