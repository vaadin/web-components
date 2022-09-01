import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-tabsheet.js';

describe('tabsheet', () => {
  let tabsheet, tabs;

  beforeEach(async () => {
    tabsheet = fixtureSync(`
      <vaadin-tabsheet>
        <div slot="prefix">Prefix</div>
        <div slot="suffix">Suffix</div>

        <vaadin-tabs slot="tabs">
          <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
          <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
          <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
        </vaadin-tabs>

        <div tab="tab-1">Panel 1</div>
        <div tab="tab-2">Panel 2</div>
        <div tab="tab-3">Panel 3</div>
      </vaadin-tabsheet>
    `);
    tabs = tabsheet.querySelector('vaadin-tabs');

    await nextFrame();
  });

  function getPanels() {
    return [...tabsheet.querySelectorAll(`[tab]`)];
  }

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tabsheet.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('items', () => {
    it('should set items to the array of child tabs', () => {
      expect(tabsheet.items).to.be.an('array');
      expect(tabsheet.items.length).to.be.equal(3);
    });

    it('should update items value when the tabs items change', () => {
      tabs.removeChild(tabsheet.items[2]);
      tabs._observer.flush();
      expect(tabsheet.items.length).to.be.equal(2);
    });

    it('should not update items value when a detached tabs items change', async () => {
      tabs.remove();
      await nextFrame();
      tabs.removeChild(tabs.items[2]);
      tabs._observer.flush();
      expect(tabsheet.items.length).not.to.be.equal(2);
    });

    it('should empty items value when the tabs is detached', async () => {
      tabs.remove();
      await nextFrame();
      expect(tabsheet.items.length).to.be.equal(0);
    });
  });

  describe('selected', () => {
    it('should select the first tab by default', () => {
      expect(tabsheet.selected).to.equal(0);
      expect(tabsheet.items[0].selected).to.be.true;
    });

    it('should reflect selected property to attribute', () => {
      expect(tabsheet.hasAttribute('selected')).to.be.true;
    });

    it('should update selected to new index when other tab is selected', () => {
      tabs.items[1].click();
      expect(tabsheet.items[1].selected).to.be.true;
      expect(tabsheet.selected).to.equal(1);
    });

    it('should not update selected on selection on a detached tabs', async () => {
      tabs.remove();
      await nextFrame();
      tabs.selected = 1;
      tabs.items[1].click();
      expect(tabsheet.selected).not.to.equal(1);
    });

    it('should close currently selected tab when another one is selected', () => {
      tabs.items[1].click();
      expect(tabsheet.items[1].selected).to.be.true;
      expect(tabsheet.items[0].selected).to.be.false;
    });

    it('should not change selected state if tab has been removed', () => {
      const tab = tabsheet.items[1];
      tabs.removeChild(tab);
      tabs._observer.flush();
      tab.selected = true;
      expect(tabsheet.selected).to.equal(0);
    });

    it('should dispatch selected-changed event when selected changes', () => {
      const spy = sinon.spy();
      tabsheet.addEventListener('selected-changed', spy);
      tabs.items[1].click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('syncing properties', () => {
    it('should propagate selected value to tabs', () => {
      expect(tabs.selected).to.equal(tabsheet.selected);
      tabsheet.selected = 1;
      expect(tabs.selected).to.equal(tabsheet.selected);
    });

    it('should not propagate value to a detached tabs', async () => {
      tabs.remove();
      await nextFrame();
      tabsheet.selected = 1;
      expect(tabs.selected).not.to.equal(tabsheet.selected);
    });
  });

  describe('panels', () => {
    it('should only show the first panel by default', () => {
      expect(getPanels()[0].hidden).to.be.false;
      expect(getPanels()[1].hidden).to.be.true;
      expect(getPanels()[2].hidden).to.be.true;
    });

    it('should show another panel on tab change', () => {
      tabsheet.selected = 1;
      expect(getPanels()[0].hidden).to.be.true;
      expect(getPanels()[1].hidden).to.be.false;
    });

    it('should not show a panel if no matching panel found', () => {
      tabsheet.selected = 3;
      expect(getPanels()[0].hidden).to.be.true;
      expect(getPanels()[1].hidden).to.be.true;
      expect(getPanels()[2].hidden).to.be.true;
    });

    it('should bind dynamically added tab and panel', async () => {
      // Create a new tab and panel
      const tab = document.createElement('vaadin-tab');
      const panel = document.createElement('div');
      tab.id = 'tab-4';
      panel.setAttribute('tab', 'tab-4');
      tabs.appendChild(tab);
      tabsheet.appendChild(panel);

      await nextFrame();

      expect(panel.role).to.equal('tabpanel');
      expect(panel.hidden).to.be.true;
      expect(panel.getAttribute('aria-labelledby')).to.equal(tab.id);
      expect(panel.id).to.be.ok;

      const panelId = panel.id;
      expect(tab.getAttribute('aria-controls')).to.equal(panelId);
    });

    it('should not overwrite the id of a dynamically added panel', async () => {
      // Create a new tab and panel
      const tab = document.createElement('vaadin-tab');
      const panel = document.createElement('div');
      tab.id = 'tab-4';
      panel.setAttribute('tab', 'tab-4');
      panel.id = 'custom-id';
      tabs.appendChild(tab);
      tabsheet.appendChild(panel);

      await nextFrame();

      expect(panel.id).to.equal('custom-id');
    });
  });

  describe('loading', () => {
    let newTab, newPanel;

    beforeEach(async () => {
      newTab = fixtureSync(`<vaadin-tab id="new-tab">New Tab</vaadin-tab>`);
      tabs.appendChild(newTab);

      newPanel = fixtureSync(`<div tab="new-tab">New Panel</div>`);
      await nextFrame();
    });

    it('should not be in loading state initially', () => {
      expect(tabsheet.hasAttribute('loading')).to.be.false;
    });

    it('should be in loading state after opening a tab with no panel', () => {
      newTab.click();
      expect(tabsheet.hasAttribute('loading')).to.be.true;
      expect(tabsheet.getAttribute('loading')).to.equal('');
    });

    it('should exit loading state after the missing panel is added', async () => {
      newTab.click();
      tabsheet.appendChild(newPanel);
      await nextFrame();
      expect(tabsheet.hasAttribute('loading')).to.be.false;
    });

    it('should not change height when entering loading state', () => {
      const height = tabsheet.offsetHeight;
      newTab.click();
      expect(tabsheet.offsetHeight).to.equal(height);
    });

    it('should allow changing height when leaving loading state', async () => {
      newTab.click();
      const height = tabsheet.offsetHeight;
      newPanel.textContent = '';
      tabsheet.appendChild(newPanel);
      await nextFrame();
      expect(tabsheet.offsetHeight).to.be.below(height);
    });

    it('should not have height on loading state when there are no panels', async () => {
      const height = tabsheet.offsetHeight;
      // Remove all the panels
      [...tabsheet.querySelectorAll('[tab]')].forEach((panel) => panel.remove());
      await nextFrame();
      expect(tabsheet.offsetHeight).to.be.below(height);
    });

    it('should not have height on loading state when there are too many non-hidden panels', async () => {
      const height = tabsheet.offsetHeight;

      // Remove all the panels
      [...tabsheet.querySelectorAll('[tab]')].forEach((panel) => panel.remove());

      await nextFrame();

      // Add two panels
      tabsheet.appendChild(fixtureSync(`<div tab="new-tab-1">New Panel 1</div>`));
      tabsheet.appendChild(fixtureSync(`<div tab="new-tab-2">New Panel 2</div>`));

      await nextFrame();
      expect(tabsheet.offsetHeight).to.be.below(height);
    });
  });

  describe('overflow attribute', () => {
    let scrollTarget;

    beforeEach(async () => {
      tabsheet.style.maxHeight = `${tabsheet.offsetHeight - 10}px`;
      scrollTarget = tabsheet.shadowRoot.querySelector('[part~="content"]');

      await nextFrame();
    });

    it('should set overflow attribute to "bottom" when scroll is at the beginning', () => {
      expect(tabsheet.getAttribute('overflow')).to.equal('bottom');
    });

    it('should set overflow attribute to "top bottom" when scroll is at the middle', async () => {
      scrollTarget.scrollTop = 1;
      await nextFrame();
      expect(tabsheet.getAttribute('overflow')).to.equal('top bottom');
    });

    it('should set overflow attribute to "top" when scroll is at the end', async () => {
      scrollTarget.scrollTop = scrollTarget.scrollHeight - scrollTarget.clientHeight;
      await nextFrame();
      expect(tabsheet.getAttribute('overflow')).to.equal('top');
    });
  });

  describe('theme propagation', () => {
    it('should set the theme attribute to the slotted tabs', () => {
      tabsheet.setAttribute('theme', 'foo');
      expect(tabs.getAttribute('theme')).to.equal('foo');
    });

    it('should remove the theme attribute to the slotted tabs', () => {
      tabsheet.setAttribute('theme', 'foo');
      tabsheet.removeAttribute('theme');
      expect(tabs.hasAttribute('theme')).to.be.false;
    });

    it('set the theme attribute to newly added tabs', async () => {
      tabsheet.setAttribute('theme', 'foo');
      tabs.remove();

      const newTabs = document.createElement('vaadin-tabs');
      newTabs.setAttribute('slot', 'tabs');
      tabsheet.appendChild(newTabs);
      await nextFrame();
      expect(newTabs.getAttribute('theme')).to.equal('foo');
    });
  });
});
