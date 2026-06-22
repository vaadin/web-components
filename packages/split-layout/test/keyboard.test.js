import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-split-layout.js';

const initialSize = 200;

describe('keyboard', () => {
  let splitLayout, splitter, first, second;

  function size(el, orientation) {
    return el.getBoundingClientRect()[orientation === 'vertical' ? 'height' : 'width'];
  }

  function available() {
    return size(splitLayout, splitLayout.orientation) - size(splitter, splitLayout.orientation);
  }

  ['horizontal', 'vertical'].forEach((orientation) => {
    const vertical = orientation === 'vertical';
    // Keys that grow / shrink the primary content element in this orientation.
    const growKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const shrinkKey = vertical ? 'ArrowUp' : 'ArrowLeft';

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

      it('should set the separator role and value attributes', () => {
        expect(splitter.getAttribute('role')).to.equal('separator');
        expect(splitter.getAttribute('tabindex')).to.equal('0');
        expect(splitter.getAttribute('aria-valuemin')).to.equal('0');
        expect(splitter.getAttribute('aria-valuemax')).to.equal('100');
        expect(splitter.getAttribute('aria-valuenow')).to.equal('50');
      });

      it('should set aria-orientation to the axis of motion', () => {
        expect(splitter.getAttribute('aria-orientation')).to.equal(vertical ? 'horizontal' : 'vertical');
      });

      it('should grow the primary element on the grow key', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: growKey });
        expect(size(first, orientation)).to.be.closeTo(before + 16, 1);
      });

      it('should shrink the primary element on the shrink key', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: shrinkKey });
        expect(size(first, orientation)).to.be.closeTo(before - 16, 1);
      });

      it('should ignore arrow keys on the cross axis', async () => {
        const before = size(first, orientation);
        await sendKeys({ press: vertical ? 'ArrowRight' : 'ArrowDown' });
        await sendKeys({ press: vertical ? 'ArrowLeft' : 'ArrowUp' });
        expect(size(first, orientation)).to.equal(before);
      });

      it('should resize by 10% of the available size on Page keys', async () => {
        const step = available() * 0.1;
        const before = size(first, orientation);
        await sendKeys({ press: 'PageUp' });
        expect(size(first, orientation)).to.be.closeTo(before + step, 1);
        await sendKeys({ press: 'PageDown' });
        await sendKeys({ press: 'PageDown' });
        expect(size(first, orientation)).to.be.closeTo(before - step, 1);
      });

      it('should collapse the primary element on Home', async () => {
        await sendKeys({ press: 'Home' });
        expect(size(first, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('0');
      });

      it('should collapse the secondary element on End', async () => {
        await sendKeys({ press: 'End' });
        expect(size(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');
      });

      it('should not overshoot when accumulating past the boundaries', async () => {
        for (let i = 0; i < 30; i++) {
          await sendKeys({ press: growKey });
        }
        expect(size(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');

        // Reversing one step immediately moves off the boundary.
        await sendKeys({ press: shrinkKey });
        expect(size(first, orientation)).to.be.below(available());
        expect(Number(splitter.getAttribute('aria-valuenow'))).to.be.below(100);
      });

      it('should respect the CSS max size limit', async () => {
        first.style[vertical ? 'maxHeight' : 'maxWidth'] = '120px';
        for (let i = 0; i < 10; i++) {
          await sendKeys({ press: growKey });
        }
        expect(size(first, orientation)).to.be.closeTo(120, 1);

        // Reversing works immediately even after clamping.
        await sendKeys({ press: shrinkKey });
        expect(size(first, orientation)).to.be.below(120);
      });

      it('should update aria-valuenow after resizing', async () => {
        await sendKeys({ press: growKey });
        const expected = Math.round((size(first, orientation) / available()) * 100);
        expect(splitter.getAttribute('aria-valuenow')).to.equal(`${expected}`);
      });

      it('should dispatch a single splitter-dragend after a burst of presses', async () => {
        const spy = sinon.spy();
        splitLayout.addEventListener('splitter-dragend', spy);
        await sendKeys({ press: growKey });
        await sendKeys({ press: growKey });
        await sendKeys({ press: growKey });
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
  });

  describe('runtime orientation change', () => {
    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first"></div>
          <div id="second"></div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
    });

    it('should flip aria-orientation and recompute aria-valuenow', async () => {
      expect(splitter.getAttribute('aria-orientation')).to.equal('vertical');
      splitLayout.orientation = 'vertical';
      await nextFrame();
      expect(splitter.getAttribute('aria-orientation')).to.equal('horizontal');
      expect(splitter.getAttribute('aria-valuenow')).to.equal('50');
    });
  });

  describe('focus ring', () => {
    it('should set focus-ring when the splitter is focused with the keyboard', async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first"></div>
          <div id="second"></div>
        </vaadin-split-layout>
      `);
      await nextRender();
      // The splitter is the only focusable element, so a single Tab focuses it.
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(splitLayout);
      expect(splitLayout.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring when a content element is focused', async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: ${initialSize}px; height: ${initialSize}px;">
          <div id="first"><button>button</button></div>
          <div id="second"></div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitLayout.querySelector('button').focus();
      expect(splitLayout.hasAttribute('focus-ring')).to.be.false;
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

    it('should keep role and tabindex but not resize', async () => {
      expect(splitter.getAttribute('role')).to.equal('separator');
      expect(splitter.getAttribute('tabindex')).to.equal('0');
      const first = splitLayout.querySelector('#first');
      const before = first.getBoundingClientRect().width;
      await sendKeys({ press: 'ArrowRight' });
      expect(first.getBoundingClientRect().width).to.equal(before);
    });
  });
});
