import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, listenOnce, nextRender, nextResize } from '@vaadin/testing-helpers';
import './tabs-test-styles.js';
import '../src/vaadin-tabs.js';

describe('overflow', () => {
  let tabs;

  beforeEach(async () => {
    tabs = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Foo</vaadin-tab>
        <vaadin-tab>Bar</vaadin-tab>
        <vaadin-tab>Some</vaadin-tab>
        <span></span>
        <vaadin-tab disabled>Baz</vaadin-tab>
        <vaadin-tab>
          <a>Baz</a>
        </vaadin-tab>
      </vaadin-tabs>
    `);
    await nextRender();
    tabs._observer.flush();
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    ['ltr', 'rtl'].forEach((direction) => {
      describe(`${orientation}-${direction}`, () => {
        beforeEach(() => {
          tabs.orientation = orientation;
          document.documentElement.setAttribute('dir', direction);
        });

        afterEach(() => {
          document.documentElement.removeAttribute('dir');
        });

        describe('large viewport', () => {
          it('should not have overflow', () => {
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });
        });

        describe('small viewport', () => {
          const horizontalRtl = orientation === 'horizontal' && direction === 'rtl';

          beforeEach(async () => {
            if (orientation === 'horizontal') {
              tabs.style.width = '200px';
            } else {
              tabs.style.height = '120px';
            }
            await nextResize(tabs);
            await nextRender();
          });

          afterEach(() => {
            document.body.style.zoom = '';
          });

          it('should have overflow="end" if scroll is at the beginning', () => {
            expect(tabs.getAttribute('overflow')).to.be.equal('end');
          });

          it('should have overflow="start end" if scroll is at the middle', (done) => {
            listenOnce(tabs._scrollerElement, 'scroll', () => {
              expect(tabs.getAttribute('overflow')).to.contain('start');
              expect(tabs.getAttribute('overflow')).to.contain('end');
              done();
            });
            tabs._scroll(horizontalRtl ? -2 : 2);
          });

          it('should have overflow="start" if scroll is at the end', (done) => {
            listenOnce(tabs._scrollerElement, 'scroll', () => {
              expect(tabs.getAttribute('overflow')).to.be.equal('start');
              done();
            });
            tabs._scroll(horizontalRtl ? -200 : 200);
          });

          [1.25, 1.33, 1.5, 1.75].forEach((zoomLevel) => {
            it(`should have overflow="start" if scroll is at the end on page zoomed to ${zoomLevel}`, (done) => {
              document.body.style.zoom = zoomLevel;
              listenOnce(tabs._scrollerElement, 'scroll', () => {
                expect(tabs.getAttribute('overflow')).to.be.equal('start');
                done();
              });
              tabs._scroll(horizontalRtl ? -200 : 200);
            });
          });

          it('should not have overflow="start" when over-scrolling', () => {
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
            await nextResize(tabs);
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });

          it('should update overflow on item resize', async () => {
            tabs.items.forEach((item) => {
              item.style.height = '1px';
              item.style.width = '1px';
              item.style.minHeight = '1px';
              item.style.minWidth = '1px';
            });
            await nextResize(tabs);
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });

          it('should update overflow on items change', async () => {
            tabs.items.forEach((item) => item.remove());
            await nextRender();
            expect(tabs.hasAttribute('overflow')).to.be.false;
          });
        });
      });
    });
  });
});
