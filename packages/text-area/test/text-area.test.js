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

    describe('subpixel rounding', () => {
      // https://github.com/vaadin/flow-components/issues/9141
      // Mocks Firefox HiDPI slack-dependent rounding so the bug
      // reproduces on CI Chromium (where it does not naturally occur).
      function mockCapturedStateReplay(input, inputField) {
        // Captured from real Firefox at Wayland scale 1.25 + html zoom 1.1.
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

      async function recordHostRectsOver(host, durationMs) {
        const samples = [];
        const start = performance.now();
        while (performance.now() - start < durationMs) {
          samples.push(host.getBoundingClientRect().height);
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
        }
        return samples;
      }

      it('should converge to a stable rendered height after a width perturbation', async () => {
        textArea.value = 'one\ntwo';
        await nextUpdate(textArea);
        await nextResize(textArea);

        const restore = mockCapturedStateReplay(textArea.inputElement, inputField);
        try {
          textArea.style.width = '320px';
          await nextResize(textArea);

          const samples = await recordHostRectsOver(textArea, 200);
          const distinctLateHeights = new Set(samples.slice(-10));
          await expect(
            distinctLateHeights.size,
            `expected stable rendered height in last 10 frames, got values: ${[...distinctLateHeights].join(', ')}`,
          ).to.equal(1);
        } finally {
          restore();
        }
      });

      it('should converge to a stable rendered height after value shrinks', async () => {
        textArea.value = Array(20).fill('line').join('\n');
        await nextUpdate(textArea);
        await nextResize(textArea);
        const grownHeight = textArea.getBoundingClientRect().height;

        const restore = mockCapturedStateReplay(textArea.inputElement, inputField);
        try {
          textArea.value = 'short';
          await nextUpdate(textArea);
          await nextResize(textArea);

          const samples = await recordHostRectsOver(textArea, 200);
          const lateSamples = samples.slice(-10);
          const distinctLateHeights = new Set(lateSamples);
          await expect(
            distinctLateHeights.size,
            `expected stable rendered height after shrink, got values: ${[...distinctLateHeights].join(', ')}`,
          ).to.equal(1);
          expect(lateSamples[lateSamples.length - 1]).to.be.lessThan(grownHeight);
        } finally {
          restore();
        }
      });

      it('should not flip rendered height by 1px on each keystroke under captured-state replay', async () => {
        // Each measurement cycle's pin/unpin causes an asymmetric scrollHeight
        // reading on low-DPR displays. Without damping, every backspace moves
        // the textarea height by exactly 1px in alternating directions, which
        // is visible as a flicker on every keystroke even though the content
        // hasn't structurally changed.
        // Pad the value with trailing chars so 8 deletions stay within the
        // last line and keep the wrap structure constant.
        textArea.value = `one\ntwo\nthree${'x'.repeat(8)}`;
        await nextUpdate(textArea);
        await nextResize(textArea);

        const restore = mockCapturedStateReplay(textArea.inputElement, inputField);
        try {
          const heights = [];
          for (let i = 0; i < 8; i++) {
            textArea.value = textArea.value.slice(0, -1);
            await nextUpdate(textArea);
            await nextResize(textArea);
            heights.push(textArea.getBoundingClientRect().height);
          }
          const lateHeights = heights.slice(-5);
          const distinct = new Set(lateHeights);
          expect(
            distinct.size,
            `expected stable rendered height across late keystrokes, full sequence: ${heights.join(', ')}`,
          ).to.equal(1);
        } finally {
          restore();
        }
      });
    });

    it('should not toggle input height attribute on every keystroke', async () => {
      textArea.style.maxHeight = '100px';
      textArea.value = Array(20).fill('a long line of content that wraps and overflows').join('\n');
      await nextUpdate(textArea);
      await nextResize(textArea);
      expect(inputField.scrollHeight).to.be.above(inputField.clientHeight);

      const mutations = [];
      const mo = new MutationObserver((records) => {
        records.forEach((r) => mutations.push(r.oldValue));
      });
      mo.observe(native, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });

      setInputValue(textArea, `${native.value}a`);
      await Promise.resolve();
      mo.disconnect();

      expect(mutations.length, `style mutations: ${mutations.join(', ')}`).to.be.lte(1);
    });

    // https://github.com/vaadin/web-components/issues/291
    // The measurement collapse must not propagate out as a transient
    // ancestor shrink — any ancestor scrolled near its max would get
    // clamped, visible as a scroll jump on backspace.
    it('should not move ancestor scroll position on value-shrink near scroll bottom', async () => {
      textArea.value = Array(60).fill('a line of content').join('\n');
      await nextUpdate(textArea);
      await nextResize(textArea);

      const scroller = fixtureSync('<div style="height: 240px; overflow: auto;"></div>');
      scroller.appendChild(textArea);
      await nextResize(textArea);

      const ancestorMax = scroller.scrollHeight - scroller.clientHeight;
      scroller.scrollTop = ancestorMax - 30;
      const scrollTopBefore = scroller.scrollTop;
      expect(scrollTopBefore).to.be.above(0);

      textArea.value = Array(59).fill('a line of content').join('\n');
      await nextUpdate(textArea);

      expect(scroller.scrollTop).to.equal(scrollTopBefore);
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
