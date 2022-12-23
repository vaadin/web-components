import { expect } from '@esm-bundle/chai';
import { arrowRight, aTimeout, enter, fixtureSync, listenOnce, nextFrame, space } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-tabs.js';

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
async function onceResized(tabs) {
  await onceInvoked(tabs, '_updateOverflow');
}

describe('tabs', () => {
  let tabs;

  beforeEach(() => {
    tabs = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Foo</vaadin-tab>
        <vaadin-tab>Bar</vaadin-tab>
        <span></span>
        <vaadin-tab disabled>Baz</vaadin-tab>
        <vaadin-tab>
          <a>Baz</a>
        </vaadin-tab>
      </vaadin-tabs>
    `);
    tabs._observer.flush();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tabs.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('items', () => {
    it('should only add vaadin-tab components to items', () => {
      expect(tabs.items.length).to.equal(4);
      tabs.items.forEach((item) => {
        expect(item.tagName.toLowerCase()).to.equal('vaadin-tab');
      });
    });

    it('should not resize on detached item resize', async () => {
      // Remove a tab
      const item = tabs.items[0];
      document.body.append(item);
      await aTimeout(100);

      // Resize the removed tab
      const stub = sinon.stub(tabs, '_updateOverflow');
      item.style.width = '100px';
      await aTimeout(100);

      item.remove();
      // Expect the resizeobserver not to have been invoked on the
      // removed tab resize
      expect(stub.called).to.be.false;
    });
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    ['ltr', 'rtl'].forEach((direction) => {
      describe(`Overflow ${orientation} ${direction}`, () => {
        beforeEach(() => {
          tabs.orientation = orientation;
          document.documentElement.setAttribute('dir', direction);
        });

        afterEach(() => {
          document.documentElement.removeAttribute('dir');
        });

        describe('large viewport', () => {
          it(`when orientation=${orientation} should not have overflow`, () => {
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });
        });

        describe('small viewport', () => {
          const horizontalRtl = orientation === 'horizontal' && direction === 'rtl';

          beforeEach(async () => {
            if (orientation === 'horizontal') {
              tabs.style.width = '200px';
            } else {
              tabs.style.height = '100px';
            }
            await onceResized(tabs);
            await nextFrame();
          });

          it(`when orientation=${orientation} should have overflow="end" if scroll is at the beginning`, () => {
            expect(tabs.getAttribute('overflow')).to.be.equal('end');
          });

          it(`when orientation=${orientation} should have overflow="start end" if scroll is at the middle`, (done) => {
            listenOnce(tabs._scrollerElement, 'scroll', () => {
              expect(tabs.getAttribute('overflow')).to.contain('start');
              expect(tabs.getAttribute('overflow')).to.contain('end');
              done();
            });
            tabs._scroll(horizontalRtl ? -2 : 2);
          });

          // TODO: passes locally but fails in GitHub Actions due to 1px difference.
          const chrome = /HeadlessChrome/u.test(navigator.userAgent);
          (horizontalRtl && chrome ? it.skip : it)(
            `when orientation=${orientation} should have overflow="start" if scroll is at the end`,
            (done) => {
              listenOnce(tabs._scrollerElement, 'scroll', () => {
                expect(tabs.getAttribute('overflow')).to.be.equal('start');
                done();
              });
              tabs._scroll(horizontalRtl ? -200 : 200);
            },
          );

          it(`when orientation=${orientation} should not have overflow="start" when over-scrolling`, () => {
            const scroll = tabs._scrollerElement;

            // Cannot set negative values to native scroll, monkey patching the properties
            let pixels = 0;
            Object.defineProperty(scroll, orientation === 'horizontal' ? 'scrollLeft' : 'scrollTop', {
              get: () => pixels,
              set: (v) => {
                pixels = v;
              },
            });

            // Simulate over-scrolling
            tabs._scroll(horizontalRtl ? 400 : -400);
            scroll.dispatchEvent(new CustomEvent('scroll'));

            expect(tabs.getAttribute('overflow')).to.be.equal('end');
          });

          it('should update overflow on resize', async () => {
            tabs.style.width = 'auto';
            tabs.style.height = 'auto';
            await onceResized(tabs);
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });

          it('should update overflow on item resize', async () => {
            tabs.items.forEach((item) => {
              item.style.height = '1px';
              item.style.width = '1px';
              item.style.minHeight = '1px';
              item.style.minWidth = '1px';
            });
            await onceResized(tabs);
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });

          it('should update overflow on items change', async () => {
            tabs.items.forEach((item) => item.remove());
            await nextFrame();
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });
        });
      });
    });
  });

  describe('slotted anchor', () => {
    let anchor, tab, spy;

    beforeEach(() => {
      anchor = tabs.querySelector('a');
      tab = anchor.parentElement;
      spy = sinon.spy();
      anchor.addEventListener('click', spy);
    });

    it('should propagate click to the anchor element when Enter key pressed', () => {
      enter(tab);
      expect(spy.calledOnce).to.be.true;
    });

    it('should propagate click to the anchor element when Space key pressed', () => {
      space(tab);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not propagate click to the anchor when other key pressed', () => {
      arrowRight(tab);
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('ARIA roles', () => {
    it('should set "tablist" role on the tabs container', () => {
      expect(tabs.getAttribute('role')).to.equal('tablist');
    });
  });
});

describe('flex child tabs', () => {
  let wrapper, tabs;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: flex; width: 400px;">
        <vaadin-tabs>
          <vaadin-tab>Foo</vaadin-tab>
          <vaadin-tab>Bar</vaadin-tab>
        </vaadin-tabs>
      </div>
    `);
    tabs = wrapper.querySelector('vaadin-tabs');
  });

  it('should have width above zero', () => {
    expect(tabs.offsetWidth).to.be.above(0);
  });

  it('should not scroll', () => {
    expect(tabs.$.scroll.scrollWidth).to.be.equal(tabs.$.scroll.offsetWidth);
  });
});

describe('flex equal width tabs', () => {
  let wrapper, tabs;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: flex; justify-content: center; width: 400px;">
        <vaadin-tabs theme="equal-width-tabs">
          <vaadin-tab>Tab one</vaadin-tab>
          <vaadin-tab>Tab two with a longer title</vaadin-tab>
          <vaadin-tab>Tab three</vaadin-tab>
        </vaadin-tabs>
      </div>
    `);
    tabs = wrapper.querySelector('vaadin-tabs');
    tabs._observer.flush();
  });

  it('should not cut content', () => {
    expect(tabs.items[1].offsetWidth).to.be.above(124);
    expect(tabs.offsetWidth).to.be.eql(400);
  });
});
