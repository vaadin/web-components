import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, isIOS, makeSoloTouchEvent, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('integration', () => {
  let wrapper, menu, button, overlay;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-context-menu></vaadin-context-menu>
        <button style="margin: 20px">Show context menu</button>
      </div>
    `);
    await nextRender();
    [menu, button] = wrapper.children;
    menu.renderer = (root) => {
      root.textContent = 'foo';
    };
    button.addEventListener('click', (e) => {
      menu.open(e);
    });
    overlay = menu._overlayElement;
  });

  it('should open context menu on .open(e)', () => {
    click(button);
    expect(menu.opened).to.eql(true);
  });

  (isIOS ? it.skip : it)('should open context menu below button', async () => {
    makeSoloTouchEvent('click', { y: 0, x: 0 }, button);
    await aTimeout(100);
    const buttonRect = button.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    expect(overlayRect.left).to.be.closeTo(buttonRect.left, 0.1);
    expect(overlayRect.top).to.be.closeTo(buttonRect.top + buttonRect.height, 0.1);
  });
});
