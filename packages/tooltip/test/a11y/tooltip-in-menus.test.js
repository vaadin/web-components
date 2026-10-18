import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '@vaadin/context-menu/src/vaadin-context-menu.js';
import '@vaadin/menu-bar/src/vaadin-menu-bar.js';
import { getMenuItems } from '@vaadin/context-menu/test/helpers.js';
import { Tooltip } from '../../src/vaadin-tooltip.js';

describe('vaadin-tooltip in menus', () => {
  let tooltip, tooltipOverlay;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('context menu item', () => {
    let wrapper, contextMenu;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-context-menu>
            <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
            <button id="target">Actions</button>
          </vaadin-context-menu>
        </div>
      `);
      contextMenu = wrapper.querySelector('vaadin-context-menu');
      contextMenu.openOn = 'click';
      contextMenu.items = [{ text: 'Copy', tooltip: 'Copy to the clipboard' }, { text: 'Paste' }];
      tooltip = contextMenu.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      await nextRender();
    });

    afterEach(() => {
      contextMenu.close();
    });

    it('tooltip opened', async () => {
      await sendMouseToElement({ type: 'click', element: contextMenu.querySelector('#target') });
      await nextRender();
      const opened = oneEvent(tooltipOverlay, 'vaadin-overlay-open');
      await sendMouseToElement({ type: 'move', element: getMenuItems(contextMenu)[0] });
      await opened;
      await expect(wrapper).to.equalA11yTreeSnapshot();
      // Known issue: menu items have `aria-selected`, which `role="menuitem"` does not support.
      // See https://github.com/vaadin/web-components/issues/165
      await expect(wrapper).to.be.accessible({ expectedViolations: ['aria-allowed-attr'] });
    });
  });

  describe('menu bar root item', () => {
    let menuBar;

    beforeEach(async () => {
      menuBar = fixtureSync(`
        <vaadin-menu-bar aria-label="Main">
          <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
        </vaadin-menu-bar>
      `);
      menuBar.items = [{ text: 'Edit', tooltip: 'Edit the document' }, { text: 'Share' }];
      tooltip = menuBar.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      await nextResize(menuBar);
    });

    it('tooltip opened', async () => {
      const opened = oneEvent(tooltipOverlay, 'vaadin-overlay-open');
      await sendMouseToElement({ type: 'move', element: menuBar._buttons[0] });
      await opened;
      await expect(menuBar).to.equalA11yTreeSnapshot();
      // Known issue: the slotted tooltip content with `role="tooltip"` is a child of the menu bar,
      // which only allows menu items as children.
      await expect(menuBar).to.be.accessible({ expectedViolations: ['aria-required-children'] });
    });
  });
});
