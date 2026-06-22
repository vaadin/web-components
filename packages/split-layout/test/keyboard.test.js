import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-split-layout.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

const initialSize = 200;

describe('keyboard', () => {
  let splitLayout, splitter, first, second;

  function size(el, orientation) {
    return el.getBoundingClientRect()[orientation === 'vertical' ? 'height' : 'width'];
  }

  function available() {
    return size(splitLayout, splitLayout.orientation) - size(splitter, splitLayout.orientation);
  }

  describe('focus', () => {
    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first"></div>
          <div id="second"><input></div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should focus the splitter on click', async () => {
      await sendMouseToElement({ type: 'click', element: splitter });
      expect(getDeepActiveElement()).to.equal(splitter);
      expect(splitLayout.hasAttribute('focused')).to.be.true;
    });

    it('should not set focus-ring when focused using pointer', async () => {
      await sendMouseToElement({ type: 'click', element: splitter });
      expect(splitLayout.hasAttribute('focus-ring')).to.be.false;
    });

    it('should set focus-ring when focused using keyboard', async () => {
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(splitLayout);
      expect(splitLayout.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focused when a content element is focused', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(splitLayout.hasAttribute('focused')).to.be.false;
      expect(splitLayout.hasAttribute('focus-ring')).to.be.false;
    });

    it('should focus the splitter on programmatic focus', () => {
      splitLayout.focus();
      expect(getDeepActiveElement()).to.equal(splitter);
    });

    it('should not throw when calling `focus()` before adding to the DOM', () => {
      const focus = () => document.createElement('vaadin-split-layout').focus();
      expect(focus()).to.not.throw;
    });
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    describe(orientation, () => {
      beforeEach(async () => {
        // Empty content so both panes have equal intrinsic size (flex-basis: auto).
        splitLayout = fixtureSync(`
          <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
            <div id="first"></div>
            <div id="second"></div>
          </vaadin-split-layout>
        `);
        splitLayout.orientation = orientation;
        await nextRender();
        splitter = splitLayout.$.splitter;
        first = splitLayout.querySelector('#first');
        second = splitLayout.querySelector('#second');
        splitter.focus();
      });

      it('should grow the primary element on Arrow Down', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: 'ArrowDown' });
        expect(size(first, orientation)).to.be.closeTo(before + 16, 1);
      });

      it('should grow the primary element on Arrow Right', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: 'ArrowRight' });
        expect(size(first, orientation)).to.be.closeTo(before + 16, 1);
      });

      it('should shrink the primary element on Arrow Up', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: 'ArrowUp' });
        expect(size(first, orientation)).to.be.closeTo(before - 16, 1);
      });

      it('should shrink the primary element on Arrow Left', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: 'ArrowLeft' });
        expect(size(first, orientation)).to.be.closeTo(before - 16, 1);
      });

      it('should resize by 10% of the available size on Page keys', async () => {
        const step = available() * 0.1;
        const before = size(first, orientation);
        await sendKeys({ press: 'PageDown' });
        expect(size(first, orientation)).to.be.closeTo(before + step, 1);
        await sendKeys({ press: 'PageUp' });
        await sendKeys({ press: 'PageUp' });
        expect(size(first, orientation)).to.be.closeTo(before - step, 1);
      });

      it('should collapse the primary element on Home', async () => {
        await sendKeys({ press: 'Home' });
        expect(size(first, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('0');
        expect(splitter.getAttribute('aria-valuetext')).to.equal('0%');
      });

      it('should collapse the secondary element on End', async () => {
        await sendKeys({ press: 'End' });
        expect(size(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');
        expect(splitter.getAttribute('aria-valuetext')).to.equal('100%');
      });

      it('should not overshoot when accumulating past the boundaries', async () => {
        for (let i = 0; i < 30; i++) {
          await sendKeys({ press: 'ArrowDown' });
        }
        expect(size(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');

        // Reversing one step immediately moves off the boundary.
        await sendKeys({ press: 'ArrowUp' });
        expect(size(first, orientation)).to.be.below(available());
        expect(Number(splitter.getAttribute('aria-valuenow'))).to.be.below(100);
      });

      it('should respect the CSS max size limit', async () => {
        first.style[orientation === 'vertical' ? 'maxHeight' : 'maxWidth'] = '120px';
        for (let i = 0; i < 10; i++) {
          await sendKeys({ press: 'ArrowDown' });
        }
        expect(size(first, orientation)).to.be.closeTo(120, 1);

        // Reversing works immediately even after clamping.
        await sendKeys({ press: 'ArrowUp' });
        expect(size(first, orientation)).to.be.below(120);
      });

      it('should update aria-valuenow after resizing', async () => {
        await sendKeys({ press: 'ArrowDown' });
        const expected = Math.round((size(first, orientation) / available()) * 100);
        expect(splitter.getAttribute('aria-valuenow')).to.equal(`${expected}`);
      });

      it('should update aria-valuenow after orientation change', async () => {
        splitLayout.orientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
        await nextFrame();
        expect(splitter.getAttribute('aria-valuenow')).to.equal('50');
      });

      it('should dispatch a single splitter-dragend after a burst of presses', async () => {
        const spy = sinon.spy();
        splitLayout.addEventListener('splitter-dragend', spy);
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        await aTimeout(250);
        expect(spy.calledOnce).to.be.true;
      });
    });
  });

  describe('RTL', () => {
    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout dir="rtl" style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first">first</div>
          <div id="second">second</div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
      first = splitLayout.querySelector('#first');
      second = splitLayout.querySelector('#second');
      splitter.focus();
    });

    it('should invert horizontal arrow keys', async () => {
      const before = size(first, 'horizontal');
      await sendKeys({ press: 'ArrowRight' });
      expect(size(first, 'horizontal')).to.be.closeTo(before - 16, 1);
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'ArrowLeft' });
      expect(size(first, 'horizontal')).to.be.closeTo(before + 16, 1);
    });

    it('should not invert vertical arrow keys', async () => {
      const before = size(first, 'horizontal');
      await sendKeys({ press: 'ArrowUp' });
      expect(size(first, 'horizontal')).to.be.closeTo(before - 16, 1);
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      expect(size(first, 'horizontal')).to.be.closeTo(before + 16, 1);
    });
  });

  describe('nested layouts', () => {
    let outer, inner, outerFirst, innerSplitter;

    beforeEach(async () => {
      outer = fixtureSync(`
        <vaadin-split-layout style="width: 400px; height: 200px;">
          <div id="outer-first">outer first</div>
          <vaadin-split-layout id="inner">
            <div id="inner-first">inner first</div>
            <div id="inner-second">inner second</div>
          </vaadin-split-layout>
        </vaadin-split-layout>
      `);
      await nextRender();
      inner = outer.querySelector('#inner');
      outerFirst = outer.querySelector('#outer-first');
      innerSplitter = inner.$.splitter;
      innerSplitter.focus();
    });

    it('should resize only the inner layout', async () => {
      const outerBefore = outerFirst.getBoundingClientRect().width;
      const innerFirst = inner.querySelector('#inner-first');
      const innerBefore = innerFirst.getBoundingClientRect().width;
      await sendKeys({ press: 'ArrowRight' });
      expect(outerFirst.getBoundingClientRect().width).to.be.closeTo(outerBefore, 1);
      expect(innerFirst.getBoundingClientRect().width).to.be.closeTo(innerBefore + 16, 1);
    });
  });

  describe('single child', () => {
    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first">first</div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
      splitter.focus();
    });

    it('should not resize if there is only one child added', async () => {
      const first = splitLayout.querySelector('#first');
      const before = first.getBoundingClientRect().width;
      await sendKeys({ press: 'ArrowRight' });
      expect(first.getBoundingClientRect().width).to.equal(before);
    });
  });
});
