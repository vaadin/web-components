import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../src/vaadin-popover.js';

describe('position', () => {
  let popover, target, overlay, defaultOffset;

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    popover.renderer = (root) => {
      root.textContent = 'Content';
    };
    target = fixtureSync('<div style="width: 100px; height: 100px; margin: 100px; outline: 1px solid red;"></div>');
    popover.target = target;
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
    // The default offset is 0px in core styles and 4px in base styles + 0.1px for rounding
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

  describe('viewport constraint', () => {
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

    describe('bottom position near left edge', () => {
      beforeEach(async () => {
        // Place target very close to left edge with small width
        // This ensures centered popover would extend beyond left edge
        constraintTarget = fixtureSync(
          '<div style="width: 50px; height: 50px; position: absolute; left: 5px; top: 100px;"></div>',
        );
        constraintPopover.position = 'bottom';
        constraintPopover.target = constraintTarget;
        await nextUpdate(constraintPopover);
      });

      it('should constrain popover to stay within viewport on left edge', async () => {
        const { overlayRect } = await openAndMeasure();

        // Popover should not extend beyond left edge
        expect(overlayRect.left).to.be.at.least(0);

        // And should not extend beyond right edge
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        expect(overlayRect.right).to.be.at.most(viewportWidth);
      });

      it('should be shifted from centered position when constrained', async () => {
        const { overlayRect, targetRect } = await openAndMeasure();

        // Calculate where popover center would be
        const targetCenter = targetRect.left + targetRect.width / 2;
        const overlayCenter = overlayRect.left + overlayRect.width / 2;

        // Popover should NOT be centered (should be shifted right)
        expect(overlayCenter).to.not.equal(targetCenter);
        expect(overlayRect.left).to.equal(0); // Should be at left edge
      });

      it('should not have arrow-centered attribute when constrained', async () => {
        await openAndMeasure();
        expect(constraintOverlay.hasAttribute('arrow-centered')).to.be.false;
      });
    });

    describe('bottom position near right edge', () => {
      beforeEach(async () => {
        // Place target very close to right edge with small width
        constraintTarget = fixtureSync(
          `<div style="width: 50px; height: 50px; position: absolute; right: 5px; top: 100px;"></div>`,
        );
        constraintPopover.position = 'bottom';
        constraintPopover.target = constraintTarget;
        await nextUpdate(constraintPopover);
      });

      it('should constrain popover to stay within viewport on right edge', async () => {
        const { overlayRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        // Popover should not extend beyond right edge
        expect(overlayRect.right).to.be.at.most(viewportWidth);

        // And should not extend beyond left edge
        expect(overlayRect.left).to.be.at.least(0);
      });

      it('should be shifted from centered position when constrained', async () => {
        const { overlayRect, targetRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        // Calculate where popover center would be
        const targetCenter = targetRect.left + targetRect.width / 2;
        const overlayCenter = overlayRect.left + overlayRect.width / 2;

        // Popover should NOT be centered (should be shifted left)
        expect(overlayCenter).to.not.equal(targetCenter);
        expect(overlayRect.right).to.equal(viewportWidth); // Should be at right edge
      });

      it('should not have arrow-centered attribute when constrained', async () => {
        await openAndMeasure();
        expect(constraintOverlay.hasAttribute('arrow-centered')).to.be.false;
      });
    });

    describe('top position near left edge', () => {
      beforeEach(async () => {
        // Place target near the left edge with enough space above
        constraintTarget = fixtureSync(
          '<div style="width: 50px; height: 50px; position: absolute; left: 5px; top: 300px;"></div>',
        );
        constraintPopover.position = 'top';
        constraintPopover.target = constraintTarget;
        await nextUpdate(constraintPopover);
      });

      it('should constrain popover to stay within viewport on left edge', async () => {
        const { overlayRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        // Popover should not extend beyond left edge
        expect(overlayRect.left).to.be.at.least(0);
        // And should not extend beyond right edge
        expect(overlayRect.right).to.be.at.most(viewportWidth);
      });

      it('should be shifted from centered position when constrained', async () => {
        const { overlayRect, targetRect } = await openAndMeasure();

        const targetCenter = targetRect.left + targetRect.width / 2;
        const overlayCenter = overlayRect.left + overlayRect.width / 2;

        // Popover should NOT be centered
        expect(overlayCenter).to.not.equal(targetCenter);
        expect(overlayRect.left).to.equal(0);
      });

      it('should not have arrow-centered attribute when constrained', async () => {
        await openAndMeasure();
        expect(constraintOverlay.hasAttribute('arrow-centered')).to.be.false;
      });
    });

    describe('top position near right edge', () => {
      beforeEach(async () => {
        // Place target near the right edge with enough space above
        constraintTarget = fixtureSync(
          `<div style="width: 50px; height: 50px; position: absolute; right: 5px; top: 300px;"></div>`,
        );
        constraintPopover.position = 'top';
        constraintPopover.target = constraintTarget;
        await nextUpdate(constraintPopover);
      });

      it('should constrain popover to stay within viewport on right edge', async () => {
        const { overlayRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        // Popover should not extend beyond right edge
        expect(overlayRect.right).to.be.at.most(viewportWidth);
        // And should not extend beyond left edge
        expect(overlayRect.left).to.be.at.least(0);
      });

      it('should be shifted from centered position when constrained', async () => {
        const { overlayRect, targetRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        const targetCenter = targetRect.left + targetRect.width / 2;
        const overlayCenter = overlayRect.left + overlayRect.width / 2;

        // Popover should NOT be centered
        expect(overlayCenter).to.not.equal(targetCenter);
        expect(overlayRect.right).to.equal(viewportWidth);
      });

      it('should not have arrow-centered attribute when constrained', async () => {
        await openAndMeasure();
        expect(constraintOverlay.hasAttribute('arrow-centered')).to.be.false;
      });
    });

    describe('centered position with sufficient space', () => {
      beforeEach(async () => {
        // Place target in center with sufficient space
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        const centerX = viewportWidth / 2 - 50; // Center a 100px wide element
        constraintTarget = fixtureSync(
          `<div style="width: 100px; height: 100px; position: absolute; left: ${centerX}px; top: 200px;"></div>`,
        );
        constraintPopover.position = 'bottom';
        constraintPopover.target = constraintTarget;
        await nextUpdate(constraintPopover);
      });

      it('should center the popover when there is sufficient space', async () => {
        const { overlayRect, targetRect } = await openAndMeasure();
        const targetCenter = targetRect.left + targetRect.width / 2;
        const overlayCenter = overlayRect.left + overlayRect.width / 2;

        // Should be centered (within 2px tolerance for rounding)
        expect(Math.abs(targetCenter - overlayCenter)).to.be.lessThan(2);
      });

      it('should stay within viewport even when centered', async () => {
        const { overlayRect } = await openAndMeasure();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        expect(overlayRect.left).to.be.at.least(0);
        expect(overlayRect.right).to.be.at.most(viewportWidth);
      });

      it('should have arrow-centered attribute when centered', async () => {
        await openAndMeasure();
        expect(constraintOverlay.hasAttribute('arrow-centered')).to.be.true;
      });
    });

    describe('RTL mode near edges', () => {
      before(() => {
        document.documentElement.setAttribute('dir', 'rtl');
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('near left edge', () => {
        beforeEach(async () => {
          // Place target near the left edge in RTL mode
          constraintTarget = fixtureSync(
            `<div style="width: 50px; height: 50px; position: absolute; left: 5px; top: 100px;"></div>`,
          );
          constraintPopover.position = 'bottom';
          constraintPopover.target = constraintTarget;
          await nextUpdate(constraintPopover);
        });

        it('should constrain popover to stay within viewport', async () => {
          const { overlayRect } = await openAndMeasure();
          const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

          // Popover should not extend beyond viewport edges
          expect(overlayRect.left).to.be.at.least(0);
          expect(overlayRect.right).to.be.at.most(viewportWidth);
        });

        it('should be shifted from centered position when constrained', async () => {
          const { overlayRect, targetRect } = await openAndMeasure();

          const targetCenter = targetRect.left + targetRect.width / 2;
          const overlayCenter = overlayRect.left + overlayRect.width / 2;

          // Should be shifted
          expect(overlayCenter).to.not.equal(targetCenter);
          expect(overlayRect.left).to.equal(0);
        });
      });

      describe('near right edge', () => {
        beforeEach(async () => {
          // Place target near the right edge in RTL mode
          constraintTarget = fixtureSync(
            `<div style="width: 50px; height: 50px; position: absolute; right: 5px; top: 100px;"></div>`,
          );
          constraintPopover.position = 'bottom';
          constraintPopover.target = constraintTarget;
          await nextUpdate(constraintPopover);
        });

        it('should constrain popover to stay within viewport', async () => {
          const { overlayRect } = await openAndMeasure();
          const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

          // Popover should not extend beyond viewport edges
          expect(overlayRect.left).to.be.at.least(0);
          expect(overlayRect.right).to.be.at.most(viewportWidth);
        });

        it('should be shifted from centered position when constrained', async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

          const targetCenter = targetRect.left + targetRect.width / 2;
          const overlayCenter = overlayRect.left + overlayRect.width / 2;

          // Should be shifted
          expect(overlayCenter).to.not.equal(targetCenter);
          expect(overlayRect.right).to.equal(viewportWidth);
        });
      });
    });
  });
});
