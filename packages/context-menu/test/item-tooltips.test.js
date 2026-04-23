import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { arrowDownKeyDown, arrowUpKeyDown, fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, openMenu } from './helpers.js';

describe('item tooltips', () => {
  let contextMenu, target, tooltip, tooltipOverlay, tooltipContent;

  before(() => {
    const Tooltip = customElements.get('vaadin-tooltip');
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
    contextMenu.openOn = isTouch ? 'click' : 'mouseover';
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
  });

  it('should show tooltip when hovering a menu item with a tooltip', async () => {
    await openMenu(target);
    const [item0] = getMenuItems(contextMenu);
    await sendMouseToElement({ type: 'move', element: item0 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Tooltip 0');
  });

  it('should not show tooltip when hovering a menu item without a tooltip', async () => {
    await openMenu(target);
    const [, item1] = getMenuItems(contextMenu);
    await sendMouseToElement({ type: 'move', element: item1 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when hovering from a tooltipped item to a non-tooltipped item', async () => {
    await openMenu(target);
    const [item0, item1] = getMenuItems(contextMenu);

    await sendMouseToElement({ type: 'move', element: item0 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    await sendMouseToElement({ type: 'move', element: item1 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when mouse leaves the overlay', async () => {
    await openMenu(target);
    const [item0] = getMenuItems(contextMenu);
    await sendMouseToElement({ type: 'move', element: item0 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    fire(contextMenu._overlayElement, 'mouseleave');
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should hide tooltip when menu closes', async () => {
    await openMenu(target);
    const [item0] = getMenuItems(contextMenu);
    await sendMouseToElement({ type: 'move', element: item0 });
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    contextMenu.close();
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should show tooltip on keyboard focus', async () => {
    await openMenu(target);
    const items = getMenuItems(contextMenu);

    // Focus item 1 (no tooltip) and arrow up to land on item 0 (has tooltip)
    items[1].focus();
    arrowUpKeyDown(items[1]);
    await nextRender();

    expect(tooltipOverlay.opened).to.be.true;
    expect(tooltipContent.textContent.trim()).to.equal('Tooltip 0');
  });

  it('should hide tooltip when moving keyboard focus to an item without a tooltip', async () => {
    await openMenu(target);
    const items = getMenuItems(contextMenu);

    items[1].focus();
    arrowUpKeyDown(items[1]);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.true;

    arrowDownKeyDown(items[0]);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should pass item to tooltip generator context', async () => {
    tooltip.generator = ({ item }) => (item ? `custom: ${item.text}` : '');
    await openMenu(target);
    const [item0] = getMenuItems(contextMenu);

    await sendMouseToElement({ type: 'move', element: item0 });
    await nextRender();
    expect(tooltipContent.textContent.trim()).to.equal('custom: Item 0');
  });

  describe('disabled item', () => {
    before(() => {
      window.Vaadin.featureFlags ??= {};
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
    });

    after(() => {
      window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
    });

    it('should show tooltip for disabled item on hover when accessibleDisabledMenuItems is enabled', async () => {
      await openMenu(target);
      const items = getMenuItems(contextMenu);
      const disabledItem = items[2];

      await sendMouseToElement({ type: 'move', element: disabledItem });
      await nextRender();
      expect(tooltipOverlay.opened).to.be.true;
      expect(tooltipContent.textContent.trim()).to.equal('Disabled tooltip');
    });
  });
});
