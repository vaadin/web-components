import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { arrowDownKeyDown, arrowUpKeyDown, fixtureSync, mousedown, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/context-menu/src/vaadin-context-menu.js';
import { getMenuItems, getSubMenu } from '@vaadin/context-menu/test/helpers.js';
import { isLastOverlay } from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('context-menu with tooltip', () => {
  let contextMenu, target, tooltip, tooltipOverlay, tooltipContent;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    contextMenu = fixtureSync(`
      <vaadin-context-menu>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    contextMenu.openOn = 'click';
    target = contextMenu.querySelector('#target');
    tooltip = contextMenu.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    tooltipContent = tooltip.querySelector('[slot="overlay"]');
    contextMenu.items = [
      { text: 'Item 0', tooltip: 'Tooltip 0' },
      { text: 'Item 1' },
      { text: 'Item 2', disabled: true, tooltip: 'Disabled tooltip' },
    ];
    await nextRender();
  });

  afterEach(async () => {
    contextMenu.close();
    await resetMouse();
    // Reset focus-utils' keyboardActive state (set on keydown, only cleared on
    // mousedown) so it doesn't leak into subsequent mouse-driven tests.
    mousedown(document.body);
  });

  it('should set manual on the slotted tooltip to true', () => {
    expect(tooltip.manual).to.be.true;
  });

  it('should show tooltip when hovering an item with a tooltip', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Tooltip 0');
  });

  it('should not show tooltip when hovering an item without a tooltip', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[1] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when hovering from a tooltipped item to a non-tooltipped item', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();

    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[1] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when mouse leaves the list box', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    await sendMouse({ type: 'move', position: [0, 0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when the menu closes', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    contextMenu.close();
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should show tooltip on keyboard focus', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    const items = getMenuItems(contextMenu);

    items[1].focus();
    arrowUpKeyDown(items[1]);
    await nextRender();

    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Tooltip 0');
  });

  it('should hide tooltip when keyboard focus moves to an item without a tooltip', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    const items = getMenuItems(contextMenu);

    items[1].focus();
    arrowUpKeyDown(items[1]);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    arrowDownKeyDown(items[0]);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should pass the hovered item to the tooltip generator context', async () => {
    tooltip.generator = ({ item }) => (item ? `custom: ${item.text}` : '');
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();

    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipContent.textContent.trim()).to.equal('custom: Item 0');
  });

  it('should not override a custom tooltip generator', async () => {
    tooltip.generator = () => 'Custom tooltip';
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();

    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipContent.textContent.trim()).to.equal('Custom tooltip');
  });

  it('should default tooltip position to end for items without a sub-menu', async () => {
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.position).to.equal('end');
  });

  it('should default tooltip position to start for items with a sub-menu', async () => {
    contextMenu.items = [{ text: 'Item 0', tooltip: 'Tooltip 0', children: [{ text: 'Child 0' }] }, { text: 'Item 1' }];
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.position).to.equal('start');
  });

  it('should stack tooltip above the sub-menu overlay', async () => {
    contextMenu.items = [{ text: 'Parent', tooltip: 'Parent tooltip', children: [{ text: 'Child 0' }] }];
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(isLastOverlay(tooltipOverlay)).to.be.true;
  });

  it('should use per-item tooltipPosition over the default', async () => {
    contextMenu.items = [{ text: 'Item 0', tooltip: 'Tooltip 0', tooltipPosition: 'top-start' }, { text: 'Item 1' }];
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.position).to.equal('top-start');
  });

  it('should respect the position set on the tooltip element over the default', async () => {
    tooltip.position = 'top';
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.position).to.equal('top');
  });

  it('should respect the position set on the tooltip element over per-item tooltipPosition', async () => {
    tooltip.position = 'top';
    contextMenu.items = [{ text: 'Item 0', tooltip: 'Tooltip 0', tooltipPosition: 'bottom-end' }];
    await sendMouseToElement({ type: 'click', element: target });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
    await nextRender();
    expect(tooltipOverlay.position).to.equal('top');
  });

  describe('disabled item', () => {
    before(() => {
      window.Vaadin.featureFlags ??= {};
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
    });

    after(() => {
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
    });

    it('should show tooltip for disabled item on hover', async () => {
      await sendMouseToElement({ type: 'click', element: target });
      await nextRender();

      await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[2] });
      await nextRender();
      expect(tooltipOverlay.opened).to.be.true;
      expect(tooltipContent.textContent.trim()).to.equal('Disabled tooltip');
    });

    it('should default tooltip position to end for a disabled item with a sub-menu', async () => {
      contextMenu.items = [
        { text: 'Item 0', tooltip: 'Tooltip 0', disabled: true, children: [{ text: 'Child 0' }] },
        { text: 'Item 1' },
      ];
      await sendMouseToElement({ type: 'click', element: target });
      await nextRender();
      await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
      await nextRender();
      expect(tooltipOverlay.position).to.equal('end');
    });
  });

  describe('sub-menu items', () => {
    let subMenu;

    beforeEach(async () => {
      contextMenu.items = [
        {
          text: 'Parent',
          children: [
            { text: 'Child 0', tooltip: 'Child tooltip 0' },
            { text: 'Child 1' },
            { text: 'Child 2', tooltip: 'Child tooltip 2', tooltipPosition: 'top' },
          ],
        },
      ];
      await sendMouseToElement({ type: 'click', element: target });
      await nextRender();
      await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
      await nextRender();
      subMenu = getSubMenu(contextMenu);
    });

    it('should share the tooltip controller with the sub-menu', () => {
      expect(subMenu._tooltipController).to.equal(contextMenu._tooltipController);
    });

    it('should show tooltip when hovering a sub-menu item with a tooltip', async () => {
      await sendMouseToElement({ type: 'move', element: getMenuItems(subMenu)[0] });
      await nextRender();

      expect(tooltipOverlay.opened).to.be.true;
      expect(tooltipContent.textContent.trim()).to.equal('Child tooltip 0');
    });

    it('should not show tooltip when hovering a sub-menu item without a tooltip', async () => {
      await sendMouseToElement({ type: 'move', element: getMenuItems(subMenu)[1] });
      await nextRender();
      expect(tooltipOverlay.opened).to.be.not.ok;
    });

    it('should use per-item tooltipPosition for sub-menu items', async () => {
      await sendMouseToElement({ type: 'move', element: getMenuItems(subMenu)[2] });
      await nextRender();
      expect(tooltipOverlay.position).to.equal('top');
    });
  });
});
