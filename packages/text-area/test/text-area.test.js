import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextFrame, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
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
    describe('delegation', () => {
      it('should delegate minlength property to the textarea', async () => {
        textArea.minlength = 2;
        await nextUpdate(textArea);
        expect(textArea.inputElement.getAttribute('minlength')).to.be.equal('2');
      });

      it('should delegate maxlength property to the textarea', async () => {
        textArea.maxlength = 2;
        await nextUpdate(textArea);
        expect(textArea.inputElement.getAttribute('maxlength')).to.be.equal('2');
      });
    });

    describe('internal', () => {
      it('should store reference to the clear button element', () => {
        expect(textArea.clearElement).to.equal(textArea.$.clearButton);
      });

      it('should set ariaTarget property to the textarea element', () => {
        expect(textArea.ariaTarget).to.equal(textArea.inputElement);
      });

      it('should set focusElement property to the textarea element', () => {
        expect(textArea.focusElement).to.equal(textArea.inputElement);
      });
    });

    describe('required', () => {
      beforeEach(async () => {
        textArea.required = true;
        await nextUpdate(textArea);
      });

      it('should focus on required indicator click', () => {
        textArea.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(textArea.hasAttribute('focused')).to.be.true;
      });
    });
  });

  describe('multi-line', () => {
    let native, inputField;

    beforeEach(() => {
      native = textArea.inputElement;
      inputField = textArea.shadowRoot.querySelector('[part=input-field]');
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
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.lte(100);
    });

    it('should not shrink less than min-height', async () => {
      textArea.style.minHeight = '125px';

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);

      // Check that value modification doesn't break min-height rule
      textArea.value = '1 row';
      await nextUpdate(textArea);

      expect(window.getComputedStyle(textArea).height).to.be.equal('125px');
      expect(parseFloat(window.getComputedStyle(inputField).height)).to.be.above(100);
    });

    it('should stay between min and max height', async () => {
      textArea.style.minHeight = '100px';
      textArea.style.maxHeight = '175px';

      expect(window.getComputedStyle(textArea).height).to.be.equal('100px');

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
      await nextResize(textArea);

      // Expect the height to have increased
      expect(textArea.offsetHeight).to.be.above(height);
    });

    it('should update height on show after hidden', async () => {
      const height = textArea.offsetHeight;
      textArea.setAttribute('hidden', '');
      await nextResize(textArea);

      // Three new lines will expand initial height
      setInputValue(textArea, '\n\n\n');
      await nextUpdate(textArea);

      textArea.removeAttribute('hidden');
      await nextResize(textArea);

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

    describe('subpixel rounding (regression #9141)', () => {
      // Chromium in CI doesn't exhibit the fractional-layout rounding
      // asymmetry that triggers #9141. The mocks below reproduce it.

      // Models the bug's mechanism. `getComputedStyle(inputField).height`
      // returns one of two values depending on whether the textarea has
      // an explicit height (modeling the alternating slack between
      // cycles ending in explicit vs auto). `input.scrollHeight` is
      // asymmetric only when the input-field is pinned at the tight
      // value AND the textarea is in auto state. The mock fires only
      // for an implementation that actually pins
      // `inputField.style.height = capturedHeight` — i.e., on the bug.
      function mockCapturedStateReplay(input, inputField) {
        const tightHeight = '63.8px';
        const looseHeight = '64.9px';
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function getComputedStyle(el, ...args) {
          const cs = originalGetComputedStyle.call(window, el, ...args);
          if (el !== inputField) {
            return cs;
          }
          const inputHasExplicitHeight = input.style.height && input.style.height !== 'auto';
          const mockedHeight = inputHasExplicitHeight ? looseHeight : tightHeight;
          return new Proxy(cs, {
            get(target, prop) {
              if (prop === 'height') {
                return mockedHeight;
              }
              const value = Reflect.get(target, prop, target);
              return typeof value === 'function' ? value.bind(target) : value;
            },
          });
        };
        Object.defineProperty(input, 'scrollHeight', {
          configurable: true,
          get() {
            const isAuto = input.style.height === '' || input.style.height === 'auto';
            const inputFieldPinnedTight = inputField.style.height === tightHeight;
            if (isAuto && inputFieldPinnedTight) {
              return this.clientHeight + 1;
            }
            return this.clientHeight;
          },
        });
        return () => {
          window.getComputedStyle = originalGetComputedStyle;
          delete input.scrollHeight;
        };
      }

      // Models content overflow: scrollHeight is N px above clientHeight
      // regardless of whether height is explicit or auto.
      function mockOverflow(input, offset) {
        Object.defineProperty(input, 'scrollHeight', {
          configurable: true,
          get() {
            return this.clientHeight + offset;
          },
        });
        return () => {
          delete input.scrollHeight;
        };
      }

      async function recordHostRectsOver(host, durationMs) {
        const samples = [];
        const start = performance.now();
        while (performance.now() - start < durationMs) {
          const r = host.getBoundingClientRect();
          samples.push({ w: r.width, h: r.height });
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
        }
        return samples;
      }

      it('should not oscillate when the input-field height alternates between cycles', async () => {
        textArea.value = 'one\ntwo';
        await nextUpdate(textArea);
        await nextResize(textArea);

        const input = textArea.inputElement;
        const inputField = textArea.shadowRoot.querySelector('[part=input-field]');
        const restore = mockCapturedStateReplay(input, inputField);

        try {
          textArea.style.width = '320px';
          await nextResize(textArea);

          const samples = await recordHostRectsOver(textArea, 200);
          const lateSamples = samples.slice(-10);
          const distinctLateHeights = new Set(lateSamples.map((s) => s.h));
          expect(
            distinctLateHeights.size,
            `expected rendered height to be stable in the last 10 frames, got values: ${[...distinctLateHeights].join(', ')}`,
          ).to.equal(1);
        } finally {
          restore();
        }
      });

      it('should shrink rendered height when value shortens, even under captured-state replay', async () => {
        textArea.value = Array(20).fill('line').join('\n');
        await nextUpdate(textArea);
        await nextResize(textArea);
        const grownHeight = textArea.getBoundingClientRect().height;

        const input = textArea.inputElement;
        const inputField = textArea.shadowRoot.querySelector('[part=input-field]');
        const restore = mockCapturedStateReplay(input, inputField);

        try {
          textArea.value = 'short';
          await nextUpdate(textArea);
          await nextResize(textArea);

          const samples = await recordHostRectsOver(textArea, 200);
          const lateSamples = samples.slice(-10);
          const distinctLateHeights = new Set(lateSamples.map((s) => s.h));
          expect(
            distinctLateHeights.size,
            `expected the host's rendered height to be stable after the shrink, got values: ${[...distinctLateHeights].join(', ')}`,
          ).to.equal(1);
          expect(lateSamples[lateSamples.length - 1].h).to.be.lessThan(grownHeight);
        } finally {
          restore();
        }
      });

      it('should grow rendered height to fit content overflow', async () => {
        textArea.value = 'one';
        await nextUpdate(textArea);
        await nextResize(textArea);
        const initialHeight = textArea.getBoundingClientRect().height;

        const input = textArea.inputElement;
        const restore = mockOverflow(input, 22);

        try {
          textArea.value = 'one\ntwo\nthree';
          await nextUpdate(textArea);
          await nextResize(textArea);
          const grownHeight = textArea.getBoundingClientRect().height;
          expect(grownHeight).to.be.greaterThan(initialHeight);
        } finally {
          restore();
        }
      });

      it('should shrink rendered height when width grows enough that content wraps to fewer lines', async () => {
        textArea.style.width = '120px';
        textArea.value = 'a a a a a a a a a a a a a a a a a a a a a a a a';
        await nextUpdate(textArea);
        await nextResize(textArea);
        const tallHeight = textArea.getBoundingClientRect().height;

        textArea.style.width = '600px';
        await nextResize(textArea);
        const shorterHeight = textArea.getBoundingClientRect().height;

        expect(
          shorterHeight,
          `expected the textarea to shrink when its width grew (${tallHeight} → ${shorterHeight})`,
        ).to.be.lessThan(tallHeight);
      });

      it('should never write input width on horizontal subpixel disagreement', async () => {
        // Guards against a future regression that adds a horizontal
        // mirror of the buggy `scrollHeight > clientHeight` check.
        textArea.style.width = '320px';
        textArea.value = 'one\ntwo';
        await nextUpdate(textArea);
        await nextResize(textArea);

        const input = textArea.inputElement;
        Object.defineProperty(input, 'scrollWidth', {
          configurable: true,
          get() {
            return this.clientWidth + 5;
          },
        });

        try {
          for (const w of ['340px', '360px', '320px']) {
            textArea.style.width = w;
            await nextResize(textArea);
          }
          expect(input.style.width).to.equal('');
        } finally {
          delete input.scrollWidth;
        }
      });

      it('should re-measure on every resize tick, even without value or width change', async () => {
        // Guards re-measurement on font-load / theme-switch / padding
        // changes. After a prior grow leaves an explicit style.height,
        // a pure resize tick must collapse the textarea back to natural.
        const restoreOverflow = mockOverflow(textArea.inputElement, 30);
        textArea.value = 'one';
        await nextUpdate(textArea);
        await nextResize(textArea);
        expect(textArea.inputElement.style.height).to.not.equal('');
        restoreOverflow();
        const grownHeight = textArea.getBoundingClientRect().height;

        textArea._onResize();
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });

        const shrunkHeight = textArea.getBoundingClientRect().height;
        expect(
          shrunkHeight,
          `expected textarea to shrink on a pure resize tick (${grownHeight} → ${shrunkHeight})`,
        ).to.be.lessThan(grownHeight);
      });
    });

    describe('min / max rows', () => {
      let lineHeight, padding, border;
      let consoleWarn;

      beforeEach(async () => {
        lineHeight = 20;
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
        native = textArea.querySelector('textarea');
        padding = parseInt(getComputedStyle(inputField).paddingTop) * 2;
        border = parseInt(getComputedStyle(inputField).borderTopWidth) * 2;

        consoleWarn = sinon.stub(console, 'warn');
      });

      afterEach(() => {
        consoleWarn.restore();
      });

      it('should use min-height of two rows by default', () => {
        expect(textArea.clientHeight).to.equal(lineHeight * 2 + padding + border);
      });

      it('should use min-height based on minimum rows', async () => {
        textArea.minRows = 4;
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + padding + border);
      });

      it('should be possible to set min-height to a single row', async () => {
        textArea.minRows = 1;
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.closeTo(lineHeight + padding + border, 1);
      });

      it('should log warning when setting minRows to less than one row', async () => {
        textArea.minRows = 0;
        await nextUpdate(textArea);

        expect(console.warn).to.be.calledWith('<vaadin-text-area> minRows must be at least 1.');
      });

      it('should not log warning when setting minRows to two rows or more', async () => {
        textArea.minRows = 2;
        await nextUpdate(textArea);

        expect(console.warn).not.to.be.called;

        textArea.minRows = 3;
        await nextUpdate(textArea);

        expect(console.warn).not.to.be.called;
      });

      it('should not overwrite rows on custom slotted textarea', async () => {
        const custom = document.createElement('textarea');
        custom.setAttribute('slot', 'textarea');
        custom.rows = 1;
        textArea.appendChild(custom);
        await nextUpdate(textArea);

        textArea.minRows = 4;
        await nextUpdate(textArea);

        expect(custom.rows).to.equal(1);
        expect(textArea.clientHeight).to.closeTo(lineHeight + padding + border, 1);
      });

      it('should grow beyond the min-height defined by minimum rows', async () => {
        textArea.minRows = 4;
        await nextUpdate(textArea);

        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.be.above(lineHeight * 4 + padding + border);
      });

      it('should use max-height based on maximum rows', async () => {
        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + padding + border);
      });

      it('should include margins, paddings and borders when calculating max-height', async () => {
        const native = textArea.querySelector('textarea');
        const inputContainer = textArea.shadowRoot.querySelector('[part="input-field"]');
        native.style.paddingTop = '5px';
        native.style.paddingBottom = '10px';
        native.style.marginTop = '15px';
        native.style.marginBottom = '20px';
        inputContainer.style.paddingTop = '25px';
        inputContainer.style.paddingBottom = '30px';
        inputContainer.style.borderTop = 'solid 35px';
        inputContainer.style.borderBottom = 'solid 40px';

        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + 5 + 10 + 15 + 20 + 25 + 30 + 35 + 40);
      });

      it('should shrink below max-height defined by maximum rows', async () => {
        textArea.maxRows = 4;
        textArea.value = 'value';
        await nextUpdate(textArea);

        expect(textArea.clientHeight).to.be.below(lineHeight * 4 + padding);
      });

      it('should update max-height when component is resized', async () => {
        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        // Change the line height to observe a max-height change
        lineHeight = 30;
        native.style.setProperty('line-height', `${lineHeight}px`);

        // Trigger a resize event
        textArea._onResize();

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + padding + border);
      });

      it('should update max-height when value changes', async () => {
        textArea.maxRows = 4;
        textArea.value = Array(400).join('400');
        await nextUpdate(textArea);

        // Change the line height to observe a max-height change
        lineHeight = 30;
        native.style.setProperty('line-height', `${lineHeight}px`);

        // Trigger a value change
        textArea.value += 'change';

        expect(textArea.clientHeight).to.equal(lineHeight * 4 + padding + border);
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
