import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import '../src/vaadin-menu-bar.js';

describe('sub-menu item tooltips', () => {
  let menuBar, buttons, tooltip, tooltipOverlay, tooltipContent, subMenu;

  before(() => {
    const Tooltip = customElements.get('vaadin-tooltip');
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    menuBar = fixtureSync(`
      <vaadin-menu-bar>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
      </vaadin-menu-bar>
    `);
    menuBar.items = [
      {
        text: 'Item 0',
        children: [
          { text: 'SubItem 0', tooltip: 'Sub tooltip 0' },
          { text: 'SubItem 1' },
          { text: 'SubItem 2', disabled: true, tooltip: 'Disabled sub tooltip' },
        ],
      },
    ];
    await nextRender();
    tooltip = menuBar.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    tooltipContent = tooltip.querySelector('[slot="overlay"]');
    buttons = menuBar._buttons;
    subMenu = menuBar._subMenu;
  });

  afterEach(async () => {
    await resetMouse();
  });

  function getSubMenuItems() {
    return [...subMenu.querySelectorAll('vaadin-menu-bar-item')];
  }

  it('should share the same tooltip element with root-level buttons', () => {
    expect(subMenu._tooltipController).to.equal(menuBar._tooltipController);
  });

  it('should show tooltip on sub-menu item hover', async () => {
    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();

    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Sub tooltip 0');
  });

  it('should not show tooltip on sub-menu item without tooltip', async () => {
    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[1] });
    await nextRender();

    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should show tooltip on keyboard focus', async () => {
    buttons[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    await nextRender();

    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Sub tooltip 0');
  });

  it('should hide tooltip when sub-menu closes', async () => {
    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    subMenu.close();
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when mouse leaves sub-menu overlay', async () => {
    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    fire(subMenu._overlayElement, 'mouseleave');
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should not leak the end position back to menu-bar button tooltips', async () => {
    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();
    expect(tooltip.position).to.equal('end');

    subMenu.close();
    await nextRender();
    expect(tooltip.position).to.be.undefined;
  });

  it('should ignore the position set on the tooltip element for sub-menu items', async () => {
    tooltip.position = 'top';

    await sendMouseToElement({ type: 'click', element: buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();
    expect(tooltip.position).to.equal('end');

    subMenu.close();
    await nextRender();
    expect(tooltip.position).to.equal('top');
  });

  it('should use per-item tooltipPosition for sub-menu items', async () => {
    menuBar.items = [
      {
        text: 'Item 0',
        children: [{ text: 'SubItem 0', tooltip: 'Sub tooltip 0', tooltipPosition: 'top-start' }],
      },
    ];
    await nextRender();

    await sendMouseToElement({ type: 'click', element: menuBar._buttons[0] });
    await nextRender();

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'move', element: items[0] });
    await nextRender();
    expect(tooltip.position).to.equal('top-start');
  });

  describe('root button tooltipPosition', () => {
    beforeEach(async () => {
      menuBar.items = [
        { text: 'Button 0', tooltip: 'Tooltip 0', tooltipPosition: 'bottom-end' },
        { text: 'Button 1', tooltip: 'Tooltip 1' },
      ];
      await nextRender();
      buttons = menuBar._buttons;
    });

    it('should use per-button tooltipPosition', async () => {
      await sendMouseToElement({ type: 'move', element: buttons[0] });
      await nextRender();
      expect(tooltip.position).to.equal('bottom-end');
    });

    it('should fall back to the tooltip element position when tooltipPosition is not set', async () => {
      tooltip.position = 'top';
      await sendMouseToElement({ type: 'move', element: buttons[1] });
      await nextRender();
      expect(tooltip.position).to.equal('top');
    });

    it('should restore the tooltip element position after hiding', async () => {
      tooltip.position = 'top';
      await sendMouseToElement({ type: 'move', element: buttons[0] });
      await nextRender();
      expect(tooltip.position).to.equal('bottom-end');

      await sendMouseToElement({ type: 'move', element: document.body });
      await nextRender();
      expect(tooltip.position).to.equal('top');
    });
  });

  describe('disabled item', () => {
    before(() => {
      window.Vaadin.featureFlags ??= {};
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
    });

    after(() => {
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
    });

    it('should show tooltip for disabled sub-menu item on hover', async () => {
      await sendMouseToElement({ type: 'click', element: buttons[0] });
      await nextRender();

      const items = getSubMenuItems();
      await sendMouseToElement({ type: 'move', element: items[2] });
      await nextRender();
      expect(tooltipOverlay.opened).to.be.true;
      expect(tooltipContent.textContent.trim()).to.equal('Disabled sub tooltip');
    });
  });
});
