import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../src/vaadin-context-menu.js';

describe('position', () => {
  let menu, target, overlay, defaultOffset;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu style="margin: 200px;">
        <div id="target" style="width: 300px; height: 200px; outline: 1px solid red;"></div>
      </vaadin-context-menu>
    `);

    menu.items = [{ text: 'Menu Item 1' }, { component: 'hr' }, { text: 'Menu Item 2' }];
    target = menu.querySelector('#target');
    menu.listenOn = target;

    await nextRender();

    overlay = menu._overlayElement;
    // The default offset is 4px in base styles + 0.1px for rounding
    defaultOffset = 0.1 + parseInt(getComputedStyle(overlay).getPropertyValue('--_default-offset'));
  });

  // Overlay above the target (position="top-*")
  function assertPlacedAbove(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.closeTo(targetRect.top, defaultOffset);
  }

  // Overlay below the target (position="bottom-*")
  function assertPlacedBelow(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.closeTo(targetRect.bottom, defaultOffset);
  }

  // Overlay before the target (position="start-*")
  function assertPlacedBefore(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'left' : 'right';
    const x2 = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x1]).to.be.closeTo(targetRect[x2], defaultOffset);
  }

  // Overlay after the target (position="end-*")
  function assertPlacedAfter(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'right' : 'left';
    const x2 = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x1]).to.be.closeTo(targetRect[x2], defaultOffset);
  }

  function assertStartAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x]).to.be.closeTo(targetRect[x], defaultOffset);
  }

  function assertEndAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x]).to.be.closeTo(targetRect[x], defaultOffset);
  }

  function assertTopAligned(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.closeTo(targetRect.top, defaultOffset);
  }

  function assertBottomAligned(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.closeTo(targetRect.bottom, defaultOffset);
  }

  function assertCenteredHorizontally(overlayRect, targetRect, dir) {
    const coord = dir === 'rtl' ? 'right' : 'left';
    const offset = targetRect.width / 2 - overlayRect.width / 2;
    expect(overlayRect[coord]).to.be.closeTo(targetRect[coord] + (dir === 'rtl' ? offset * -1 : offset), defaultOffset);
  }

  function assertCenteredVertically(overlayRect, targetRect) {
    const offset = targetRect.height / 2 - overlayRect.height / 2;
    expect(overlayRect.top).to.be.closeTo(targetRect.top + offset, defaultOffset);
  }

  describe('default', () => {
    it('should not set position property value by default', () => {
      expect(menu.position).to.be.undefined;
    });

    it('should have no overlay position by default', () => {
      expect(overlay.position).to.be.undefined;
    });
  });

  [
    {
      position: 'top-start',
      assertPlaced: assertPlacedAbove,
      assertAligned: assertStartAligned,
    },
    {
      position: 'top',
      assertPlaced: assertPlacedAbove,
      assertAligned: assertCenteredHorizontally,
    },
    {
      position: 'top-end',
      assertPlaced: assertPlacedAbove,
      assertAligned: assertEndAligned,
    },
    {
      position: 'bottom-start',
      assertPlaced: assertPlacedBelow,
      assertAligned: assertStartAligned,
    },
    {
      position: 'bottom',
      assertPlaced: assertPlacedBelow,
      assertAligned: assertCenteredHorizontally,
    },
    {
      position: 'bottom-end',
      assertPlaced: assertPlacedBelow,
      assertAligned: assertEndAligned,
    },
    {
      position: 'start-top',
      assertPlaced: assertPlacedBefore,
      assertAligned: assertTopAligned,
    },
    {
      position: 'start',
      assertPlaced: assertPlacedBefore,
      assertAligned: assertCenteredVertically,
    },
    {
      position: 'start-bottom',
      assertPlaced: assertPlacedBefore,
      assertAligned: assertBottomAligned,
    },
    {
      position: 'end-top',
      assertPlaced: assertPlacedAfter,
      assertAligned: assertTopAligned,
    },
    {
      position: 'end',
      assertPlaced: assertPlacedAfter,
      assertAligned: assertCenteredVertically,
    },
    {
      position: 'end-bottom',
      assertPlaced: assertPlacedAfter,
      assertAligned: assertBottomAligned,
    },
  ].forEach(({ position, assertPlaced, assertAligned }) => {
    describe(position, () => {
      ['ltr', 'rtl'].forEach((dir) => {
        describe(`${position} ${dir}`, () => {
          before(() => {
            document.documentElement.setAttribute('dir', dir);
          });

          after(() => {
            document.documentElement.removeAttribute('dir');
          });

          it(`should position overlay against target ${position} with ${dir}`, async () => {
            menu.position = position;
            await nextUpdate(menu);

            // Trigger right click event
            const targetRect = target.getBoundingClientRect();
            const x = dir === 'rtl' ? targetRect.right - 5 : targetRect.left + 5;
            const y = targetRect.y + 5;
            const e = new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              clientX: x,
              clientY: y,
            });

            menu.listenOn.dispatchEvent(e);

            await oneEvent(overlay, 'vaadin-overlay-open');

            const overlayRect = overlay.$.overlay.getBoundingClientRect();
            assertPlaced(overlayRect, targetRect, dir);
            assertAligned(overlayRect, targetRect, dir);
          });
        });
      });
    });
  });
});
