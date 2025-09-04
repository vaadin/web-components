import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/menu-bar';
import '@vaadin/tabs';

describe('tabs with menu-bar', () => {
  let tabs;

  beforeEach(async () => {
    tabs = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>
          <span>Tab 1</span>
        </vaadin-tab>
      </vaadin-tabs>
    `);
    await nextRender();
  });

  it('should not include menu-bar items in tabs items', async () => {
    const menu = document.createElement('vaadin-menu-bar');
    const item = document.createElement('vaadin-menu-bar-item');
    item.textContent = 'Menu item';
    menu.items = [{ component: item }];

    const tab = document.createElement('vaadin-tab');
    tab.textContent = 'Tab 2';
    tab.appendChild(menu);
    tabs.appendChild(tab);
    await nextRender();

    expect(tabs.items.length).to.equal(2);
    expect(tabs.items.includes(item)).to.be.false;
  });
});
