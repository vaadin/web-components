import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-split-layout.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('keyboard', () => {
  let splitLayout, splitter, first, second;

  function getSize(el, orientation) {
    return el.getBoundingClientRect()[orientation === 'vertical' ? 'height' : 'width'];
  }

  function getAvailableSize() {
    return getSize(splitLayout, splitLayout.orientation) - getSize(splitter, splitLayout.orientation);
  }

  describe('focus', () => {
    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout style="width: 200px; height: 200px;">
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
      let size;

      beforeEach(async () => {
        splitLayout = fixtureSync(`
          <vaadin-split-layout orientation="${orientation}" style="width: 200px; height: 200px;">
            <div id="first"></div>
            <div id="second"></div>
          </vaadin-split-layout>
        `);
        await nextRender();
        splitter = splitLayout.$.splitter;
        first = splitLayout.querySelector('#first');
        second = splitLayout.querySelector('#second');
        size = getSize(first, orientation);
        splitter.focus();
      });

      it('should grow the primary element on Arrow Down', async () => {
        await sendKeys({ press: 'ArrowDown' });
        expect(getSize(first, orientation)).to.be.closeTo(size + 16, 1);
      });

      it('should grow the primary element on Arrow Right', async () => {
        await sendKeys({ press: 'ArrowRight' });
        expect(getSize(first, orientation)).to.be.closeTo(size + 16, 1);
      });

      it('should shrink the primary element on Arrow Up', async () => {
        await sendKeys({ press: 'ArrowUp' });
        expect(getSize(first, orientation)).to.be.closeTo(size - 16, 1);
      });

      it('should shrink the primary element on Arrow Left', async () => {
        await sendKeys({ press: 'ArrowLeft' });
        expect(getSize(first, orientation)).to.be.closeTo(size - 16, 1);
      });

      it('should grow the primary by 10% of the available size on Page Down', async () => {
        const step = getAvailableSize() * 0.1;
        await sendKeys({ press: 'PageDown' });
        expect(getSize(first, orientation)).to.be.closeTo(size + step, 1);
      });

      it('should shrink the primary element by 10% of the available size on Page Up', async () => {
        const step = getAvailableSize() * 0.1;
        await sendKeys({ press: 'PageUp' });
        expect(getSize(first, orientation)).to.be.closeTo(size - step, 1);
      });

      it('should collapse the primary element on Home', async () => {
        await sendKeys({ press: 'Home' });
        expect(getSize(first, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('0');
        expect(splitter.getAttribute('aria-valuetext')).to.equal('0%');
      });

      it('should collapse the secondary element on End', async () => {
        await sendKeys({ press: 'End' });
        expect(getSize(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');
        expect(splitter.getAttribute('aria-valuetext')).to.equal('100%');
      });

      it('should not change size when primary element is fully collapsed', async () => {
        for (let i = 0; i < 8; i++) {
          await sendKeys({ press: 'PageUp' });
        }
        expect(getSize(first, orientation)).to.equal(0);
        expect(getSize(second, orientation)).to.equal(getAvailableSize());
        expect(splitter.getAttribute('aria-valuenow')).to.equal('0');

        await sendKeys({ press: 'ArrowDown' });
        expect(getSize(second, orientation)).to.be.below(getAvailableSize());
        expect(Number(splitter.getAttribute('aria-valuenow'))).to.be.above(0);
      });

      it('should not change size when secondary element is fully collapsed', async () => {
        for (let i = 0; i < 8; i++) {
          await sendKeys({ press: 'PageDown' });
        }
        expect(getSize(first, orientation)).to.equal(getAvailableSize());
        expect(getSize(second, orientation)).to.equal(0);
        expect(splitter.getAttribute('aria-valuenow')).to.equal('100');

        await sendKeys({ press: 'ArrowUp' });
        expect(getSize(first, orientation)).to.be.below(getAvailableSize());
        expect(Number(splitter.getAttribute('aria-valuenow'))).to.be.below(100);
      });

      it('should respect the CSS max size limit', async () => {
        first.style[orientation === 'vertical' ? 'maxHeight' : 'maxWidth'] = '120px';
        for (let i = 0; i < 10; i++) {
          await sendKeys({ press: 'ArrowDown' });
        }
        expect(getSize(first, orientation)).to.be.closeTo(120, 1);

        await sendKeys({ press: 'ArrowUp' });
        expect(getSize(first, orientation)).to.be.below(120);
      });

      it('should update aria-valuenow after moving the splitter', async () => {
        await sendKeys({ press: 'ArrowDown' });
        const expected = Math.round((getSize(first, orientation) / getAvailableSize()) * 100);
        expect(splitter.getAttribute('aria-valuenow')).to.equal(`${expected}`);
      });

      it('should update aria-valuenow after orientation change', async () => {
        splitLayout.orientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
        await nextFrame();
        expect(splitter.getAttribute('aria-valuenow')).to.equal('50');
      });

      it('should dispatch single splitter-dragend event on subsequent key presses', async () => {
        const spy = sinon.spy();
        splitLayout.addEventListener('splitter-dragend', spy);
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        await aTimeout(200);
        expect(spy.calledOnce).to.be.true;
      });
    });
  });

  describe('RTL', () => {
    let size;

    beforeEach(async () => {
      splitLayout = fixtureSync(`
        <vaadin-split-layout dir="rtl" style="width: 200px; height: 200px;">
          <div id="first">first</div>
          <div id="second">second</div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
      first = splitLayout.querySelector('#first');
      second = splitLayout.querySelector('#second');
      size = getSize(first, 'horizontal');
      splitter.focus();
    });

    it('should shrink the primary element on ArrowRight', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(getSize(first, 'horizontal')).to.be.closeTo(size - 16, 1);
    });

    it('should grow the primary element on ArrowLeft', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      expect(getSize(first, 'horizontal')).to.be.closeTo(size + 16, 1);
    });

    it('should grow the primary element on ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(getSize(first, 'horizontal')).to.be.closeTo(size + 16, 1);
    });

    it('should shrink the primary element on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expect(getSize(first, 'horizontal')).to.be.closeTo(size - 16, 1);
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
        <vaadin-split-layout style="width: 200px; height: 200px;">
          <div id="first">first</div>
        </vaadin-split-layout>
      `);
      await nextRender();
      splitter = splitLayout.$.splitter;
      splitter.focus();
    });

    it('should not resize if there is only one child added', async () => {
      const first = splitLayout.querySelector('#first');
      const size = first.getBoundingClientRect().width;
      await sendKeys({ press: 'ArrowRight' });
      expect(first.getBoundingClientRect().width).to.equal(size);
    });
  });
});
