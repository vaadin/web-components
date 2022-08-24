import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-tooltip.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tooltip-overlay',
  css`
    [part='overlay'] {
      width: 50px;
      border: 1px solid blue;
    }
  `,
);

describe('position', () => {
  let tooltip, target, overlay;

  beforeEach(() => {
    tooltip = fixtureSync('<vaadin-tooltip text="tooltip"></vaadin-tooltip>');
    target = fixtureSync(`
      <div style="display: flex; width: 100px; height: 100px; margin: 100px; outline: 1px solid red;"></div>
    `);
    tooltip.target = target;
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  async function openAndMeasure() {
    fire(target, 'mouseenter');
    await oneEvent(overlay, 'vaadin-overlay-open');
    const overlayRect = overlay.$.overlay.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    return { overlayRect, targetRect };
  }

  // Overlay above the target (position="top-*")
  function assertPlacedAbove(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.equal(targetRect.top);
  }

  // Overlay below the target (position="bottom-*")
  function assertPlacedBelow(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.equal(targetRect.bottom);
  }

  // Overlay before the target (position="start-*")
  function assertPlacedBefore(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'left' : 'right';
    const x2 = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x1]).to.be.equal(targetRect[x2]);
  }

  // Overlay after the target (position="end-*")
  function assertPlacedAfter(overlayRect, targetRect, dir) {
    const x1 = dir === 'rtl' ? 'right' : 'left';
    const x2 = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x1]).to.be.equal(targetRect[x2]);
  }

  function assertStartAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'right' : 'left';
    expect(overlayRect[x]).to.be.equal(targetRect[x]);
  }

  function assertEndAligned(overlayRect, targetRect, dir) {
    const x = dir === 'rtl' ? 'left' : 'right';
    expect(overlayRect[x]).to.be.equal(targetRect[x]);
  }

  function assertTopAligned(overlayRect, targetRect) {
    expect(overlayRect.top).to.be.equal(targetRect.top);
  }

  function assertBottomAligned(overlayRect, targetRect) {
    expect(overlayRect.bottom).to.be.equal(targetRect.bottom);
  }

  function assertCenteredHorizontally(overlayRect, targetRect, dir) {
    const coord = dir === 'rtl' ? 'right' : 'left';
    const offset = dir === 'rtl' ? -overlayRect.width / 2 : overlayRect.width / 2;
    expect(overlayRect[coord]).to.be.equal(targetRect[coord] + offset);
  }

  function assertCenteredVertically(overlayRect, targetRect) {
    const offset = targetRect.height / 2 - overlayRect.height / 2;
    expect(overlayRect.top).to.be.equal(targetRect.top + offset);
  }

  describe('top-start', () => {
    beforeEach(() => {
      tooltip.position = 'top-start';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`top-start ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target top start with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAbove(overlayRect, targetRect);
          assertStartAligned(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('top', () => {
    beforeEach(() => {
      tooltip.position = 'top';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`top ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target top with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAbove(overlayRect, targetRect);
          assertCenteredHorizontally(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('top-end', () => {
    beforeEach(() => {
      tooltip.position = 'top-end';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`top-end ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target top with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAbove(overlayRect, targetRect);
          assertEndAligned(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('bottom-start', () => {
    beforeEach(() => {
      tooltip.position = 'bottom-start';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`bottom-start ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target bottom start with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBelow(overlayRect, targetRect);
          assertStartAligned(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('bottom', () => {
    beforeEach(() => {
      tooltip.position = 'bottom';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`bottom ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target bottom with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBelow(overlayRect, targetRect);
          assertCenteredHorizontally(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('bottom-end', () => {
    beforeEach(() => {
      tooltip.position = 'bottom-end';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`bottom-end ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target bottom end with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBelow(overlayRect, targetRect);
          assertEndAligned(overlayRect, targetRect, dir);
        });
      });
    });
  });

  describe('start-top', () => {
    beforeEach(() => {
      tooltip.position = 'start-top';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`start-top ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target start top with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBefore(overlayRect, targetRect, dir);
          assertTopAligned(overlayRect, targetRect);
        });
      });
    });
  });

  describe('start', () => {
    beforeEach(() => {
      tooltip.position = 'start';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`start ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target start with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBefore(overlayRect, targetRect, dir);
          assertCenteredVertically(overlayRect, targetRect);
        });
      });
    });
  });

  describe('start-bottom', () => {
    beforeEach(() => {
      tooltip.position = 'start-bottom';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`start-top ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target start bottom with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedBefore(overlayRect, targetRect, dir);
          assertBottomAligned(overlayRect, targetRect);
        });
      });
    });
  });

  describe('end-top', () => {
    beforeEach(() => {
      tooltip.position = 'end-top';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`end-top ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target end top with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAfter(overlayRect, targetRect, dir);
          assertTopAligned(overlayRect, targetRect);
        });
      });
    });
  });

  describe('end', () => {
    beforeEach(() => {
      tooltip.position = 'end';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`end ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target end with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAfter(overlayRect, targetRect, dir);
          assertCenteredVertically(overlayRect, targetRect);
        });
      });
    });
  });

  describe('end-bottom', () => {
    beforeEach(() => {
      tooltip.position = 'end-bottom';
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(`end-bottom ${dir}`, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it(`should position overlay against target end-bottom with ${dir}`, async () => {
          const { overlayRect, targetRect } = await openAndMeasure();
          assertPlacedAfter(overlayRect, targetRect, dir);
          assertBottomAligned(overlayRect, targetRect);
        });
      });
    });
  });
});
