import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import '../src/vaadin-infinite-scroller.js';
import { activateScroller, getFirstVisibleItem, listenForEvent } from './common.js';

describe('vaadin-infinite-scroller', () => {
  let scroller;

  beforeEach(async () => {
    scroller = fixtureSync(`
      <vaadin-infinite-scroller buffer-size="80">
        <template>
          <div>[[index]]</div>
        </template>
      </vaadin-infinite-scroller>
    `);
    scroller.style.setProperty('--vaadin-infinite-scroller-item-height', '30px');
    scroller.updateStyles({ '--vaadin-infinite-scroller-item-height': '30px' });
    await activateScroller(scroller);
  });

  function verifyPosition() {
    const item = getFirstVisibleItem(scroller);
    expect(item.textContent - scroller.position).to.be.below(1);

    const scrollDiff = item.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    const ratio = scrollDiff / scroller.itemHeight;
    const remainder = scroller.position % 1;
    expect(Math.abs(remainder + ratio) - 1).to.be.below(0.1);
  }

  it('should default to position 0', () => {
    expect(scroller.position).to.equal(0);
  });

  it('should have correct item height', () => {
    expect(getFirstVisibleItem(scroller).clientHeight).to.equal(30);
  });

  it('should have correct buffer count', () => {
    expect(scroller.shadowRoot.querySelector('.buffer').children).to.have.length(80);
  });

  it('should reflect currently visible item index as position scrolling down', (done) => {
    function scrollDown() {
      verifyPosition();
      if (scroller.position > scroller.bufferSize * 1.5) {
        done();
      } else {
        scroller.$.scroller.scrollTop += scroller.itemHeight * 3.7;
        setTimeout(scrollDown, 30);
      }
    }

    scrollDown();
  });

  it('should reflect currently visible item index as position scrolling up', (done) => {
    function scrollUp() {
      verifyPosition();
      if (scroller.position < -scroller.bufferSize * 1.5) {
        done();
      } else {
        scroller.$.scroller.scrollTop -= scroller.itemHeight * 3.7;
        setTimeout(scrollUp, 30);
      }
    }

    scrollUp();
  });

  it('should reflect position as currently visible item index', () => {
    scroller.position = -5;
    while (scroller.position < 5) {
      scroller.position += 1.1;
      verifyPosition();
    }
  });

  it('should fire non-bubbling custom-scroll events', (done) => {
    function customScrollListener(e) {
      scroller.removeEventListener('custom-scroll', customScrollListener);
      expect(e.bubbles).to.be.false;
      done();
    }

    scroller.addEventListener('custom-scroll', customScrollListener);

    scroller.$.scroller.scrollTop += 10;
  });

  it('should not fire custom-scroll events', (done) => {
    const spy = sinon.spy();
    scroller.addEventListener('custom-scroll', spy);
    listenForEvent(scroller.$.scroller, 'scroll', () => {
      expect(spy.called).to.be.false;
      done();
    });
    scroller.position = 10;
  });

  it('should not animate on second attach', async () => {
    const spy = sinon.spy();
    scroller.addEventListener('animationstart', spy);
    const parent = scroller.parentNode;
    parent.removeChild(scroller);
    parent.appendChild(scroller);
    await aTimeout();
    expect(spy.called).to.be.false;
  });

  it('should have an instance stamped to every wrapper', () => {
    scroller._buffers.forEach((buffer) => {
      Array.from(buffer.children).forEach((insertionPoint) => {
        expect(insertionPoint._itemWrapper.firstElementChild).to.be.ok;
      });
    });
  });
});
