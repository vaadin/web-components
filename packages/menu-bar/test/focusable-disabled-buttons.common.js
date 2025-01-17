import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';

describe('focusable disabled buttons', () => {
  let menuBar, buttons;

  before(() => {
    window.Vaadin.featureFlags ??= {};
    window.Vaadin.featureFlags.accessibleDisabledButtons = true;
  });

  after(() => {
    window.Vaadin.featureFlags.accessibleDisabledButtons = false;
  });

  beforeEach(async () => {
    menuBar = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menuBar.items = [
      { text: 'Item 0' },
      { text: 'Item 1', disabled: true, children: [{ text: 'SubItem 0' }] },
      { text: 'Item 2' },
    ];
    await nextRender(menuBar);
    buttons = menuBar._buttons;
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should not open sub-menu on disabled button click', async () => {
    const { x, y } = middleOfNode(buttons[1]);
    await sendMouse({ type: 'click', position: [Math.floor(x), Math.floor(y)] });
    expect(buttons[1].hasAttribute('expanded')).to.be.false;
  });

  it('should not open sub-menu on disabled button hover', async () => {
    menuBar.openOnHover = true;
    const { x, y } = middleOfNode(buttons[1]);
    await sendMouse({ type: 'move', position: [Math.floor(x), Math.floor(y)] });
    expect(buttons[1].hasAttribute('expanded')).to.be.false;
  });

  it('should include disabled buttons in arrow key navigation', async () => {
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(buttons[0]);

    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(buttons[1]);

    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(buttons[2]);

    await sendKeys({ press: 'ArrowLeft' });
    expect(document.activeElement).to.equal(buttons[1]);

    await sendKeys({ press: 'ArrowLeft' });
    expect(document.activeElement).to.equal(buttons[0]);
  });

  it('should include disabled buttons in Tab navigation', async () => {
    menuBar.tabNavigation = true;

    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(buttons[0]);

    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(buttons[1]);

    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(buttons[2]);

    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    expect(document.activeElement).to.equal(buttons[1]);

    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    expect(document.activeElement).to.equal(buttons[0]);
  });
});
