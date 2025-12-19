import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../src/vaadin-popover.js';

describe('position', () => {
  let popover, target, overlay;

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    popover.renderer = (root) => {
      root.textContent = 'Content';
    };
    target = fixtureSync('<div style="width: 100px; height: 100px; margin: 100px; outline: 1px solid red;"></div>');
    popover.target = target;
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  // Overlay above the target (position="top-*")
  function assertPlacedAbove(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.closeTo(targetRect.top, 1);
  }

  // Overlay below the target (position="bottom-*")
  function assertPlacedBelow(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.closeTo(targetRect.bottom, 1);
  }

  // Overlay before the target (position="start-*")
  function assertPlacedBefore(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'left' : 'right';
    const x2 = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x1]).to.be.closeTo(targetRect[x2], 1);
  }

  // Overlay after the target (position="end-*")
  function assertPlacedAfter(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'right' : 'left';
    const x2 = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x1]).to.be.closeTo(targetRect[x2], 1);
  }

  function assertStartAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x]).to.be.closeTo(targetRect[x], 1);
  }

  function assertEndAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x]).to.be.closeTo(targetRect[x], 1);
  }

  function assertTopAligned(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.closeTo(targetRect.top, 1);
  }

  function assertBottomAligned(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.closeTo(targetRect.bottom, 1);
  }

  function assertCenteredHorizontally(overlayRect, targetRect, dir) {
    const coord = dir === 'rtl' ? 'right' : 'left';
    const offset = targetRect.width / 2 - overlayRect.width / 2;
    expect(overlayRect[coord]).to.be.closeTo(targetRect[coord] + (dir === 'rtl' ? offset * -1 : offset), 1);
  }

  function assertCenteredVertically(overlayRect, targetRect) {
    const offset = targetRect.height / 2 - overlayRect.height / 2;
    expect(overlayRect.top).to.be.closeTo(targetRect.top + offset, 1);
  }

  describe('default', () => {
    it('should not set position property value by default', () => {
      expect(popover.position).to.be.undefined;
    });

    it('should set overlay position to bottom by default', () => {
      expect(overlay.position).to.be.equal('bottom');
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
            popover.position = position;
            await nextUpdate(popover);

            target.click();
            await oneEvent(overlay, 'vaadin-overlay-open');
            const overlayRect = overlay.$.overlay.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            assertPlaced(overlayRect, targetRect, dir);
            assertAligned(overlayRect, targetRect, dir);
          });
        });
      });
    });
  });

  describe('viewport constraints', () => {
    let constraintPopover, constraintTarget, constraintOverlay;

    beforeEach(async () => {
      constraintPopover = fixtureSync('<vaadin-popover></vaadin-popover>');
      constraintPopover.renderer = (root) => {
        if (!root.firstChild) {
          const div = document.createElement('div');
          div.textContent = 'This is a long popover content that will extend beyond edges';
          root.appendChild(div);
        }
      };
      await nextRender();
      constraintOverlay = constraintPopover.shadowRoot.querySelector('vaadin-popover-overlay');
    });

    async function openAndMeasure() {
      constraintPopover.opened = true;
      await oneEvent(constraintOverlay, 'vaadin-overlay-open');
      const overlayRect = constraintOverlay.$.overlay.getBoundingClientRect();
      const targetRect = constraintTarget.getBoundingClientRect();
      return { overlayRect, targetRect };
    }

    ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'].forEach((position) => {
      ['left', 'right'].forEach((edge) => {
        describe(`${position} position near ${edge} edge`, () => {
          beforeEach(async () => {
            // Place target very close to edge with small width
            // This ensures centered popover would extend beyond edge
            const edgeStyle = edge === 'left' ? 'left: 5px' : 'right: 5px';
            constraintTarget = fixtureSync(
              `<div style="width: 50px; height: 50px; position: absolute; ${edgeStyle}; top: 200px;"></div>`,
            );
            constraintPopover.position = position;
            constraintPopover.target = constraintTarget;
            await nextUpdate(constraintPopover);
          });

          it(`should constrain popover to stay within viewport on ${edge} edge`, async () => {
            const { overlayRect } = await openAndMeasure();
            const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

            // Popover should not extend beyond viewport edges
            expect(overlayRect.left).to.be.at.least(0);
            expect(overlayRect.right).to.be.at.most(viewportWidth);
          });
        });
      });
    });

    ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'].forEach((position) => {
      ['left', 'right'].forEach((edge) => {
        describe(`${position} position with target outside ${edge} edge`, () => {
          beforeEach(async () => {
            // Place target partially outside of viewport
            const edgeStyle = edge === 'left' ? 'left: -25px' : 'right: -25px';
            constraintTarget = fixtureSync(
              `<div style="width: 50px; height: 50px; position: absolute; ${edgeStyle}; top: 200px;"></div>`,
            );
            constraintPopover.position = position;
            constraintPopover.target = constraintTarget;
            await nextUpdate(constraintPopover);
          });

          it(`should constrain popover to stay within viewport on ${edge} edge`, async () => {
            const { overlayRect } = await openAndMeasure();
            const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

            // Popover should not extend beyond viewport edges
            expect(overlayRect.left).to.be.at.least(0);
            expect(overlayRect.right).to.be.at.most(viewportWidth);
          });
        });
      });
    });
  });
});
