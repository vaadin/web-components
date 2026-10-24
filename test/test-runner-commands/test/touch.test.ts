import { expect } from '@vaadin/chai-plugins';
import { dispatchTouch, setTouchEmulation } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome } from '@vaadin/testing-helpers';

describe('touch commands', () => {
  // Only Chromium can emulate a touch device and send touch input in the tests.
  (isChrome ? describe : describe.skip)('Chromium', () => {
    afterEach(async () => {
      await setTouchEmulation(false);
    });

    it('should make the coarse pointer media query match while touch emulation is on', async () => {
      expect(matchMedia('(pointer: coarse)').matches).to.be.false;
      expect(await setTouchEmulation(true)).to.be.true;
      expect(matchMedia('(pointer: coarse)').matches).to.be.true;
      expect(await setTouchEmulation(false)).to.be.true;
      expect(matchMedia('(pointer: coarse)').matches).to.be.false;
    });

    it('should send touch input to the element under the touch points', async () => {
      const element = fixtureSync('<div style="width: 100px; height: 100px; touch-action: none"></div>');
      const events: Array<{ type: string; touches: number[][] }> = [];
      ['touchstart', 'touchmove', 'touchend'].forEach((type) => {
        element.addEventListener(type, (event) => {
          const touches = [...(event as TouchEvent).touches].map((touch) => [
            touch.identifier,
            touch.clientX,
            touch.clientY,
          ]);
          events.push({ type, touches });
        });
      });
      const { left, top } = element.getBoundingClientRect();
      const [x, y] = [Math.round(left) + 10, Math.round(top) + 10];
      await setTouchEmulation(true);
      expect(
        await dispatchTouch('touchStart', [
          { x, y, id: 0 },
          { x: x + 50, y, id: 1 },
        ]),
      ).to.be.true;
      await dispatchTouch('touchMove', [
        { x, y: y + 20, id: 0 },
        { x: x + 50, y: y + 20, id: 1 },
      ]);
      await dispatchTouch('touchEnd', []);
      expect(events.find((event) => event.type === 'touchmove')!.touches).to.deep.equal([
        [0, x, y + 20],
        [1, x + 50, y + 20],
      ]);
      expect(events.at(-1)).to.deep.equal({ type: 'touchend', touches: [] });
    });
  });

  (isChrome ? describe.skip : describe)('other browsers', () => {
    it('should return false from the commands', async () => {
      expect(await setTouchEmulation(true)).to.be.false;
      expect(await dispatchTouch('touchStart', [{ x: 10, y: 10, id: 0 }])).to.be.false;
      expect(matchMedia('(pointer: coarse)').matches).to.be.false;
    });
  });
});
