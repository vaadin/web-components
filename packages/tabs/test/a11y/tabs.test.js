import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-tabs.js';

// The tabs scroll container has `tabindex="-1"` so that Firefox does not make it a Tab stop.
// axe reports it as a child of the tablist that is not a tab.
const AXE_OPTIONS = { ignoredRules: ['aria-required-children'] };

describe('vaadin-tabs', () => {
  let tabs;

  beforeEach(async () => {
    tabs = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Tab 1</vaadin-tab>
        <vaadin-tab>Tab 2</vaadin-tab>
        <vaadin-tab>Tab 3</vaadin-tab>
      </vaadin-tabs>
    `);
    await nextRender();
  });

  it('default', async () => {
    await expect(tabs).to.equalAriaSnapshot();
    await expect(tabs).to.be.accessible(AXE_OPTIONS);
  });

  it('selected', async () => {
    tabs.selected = 1;
    await nextUpdate(tabs);
    await expect(tabs).to.equalAriaSnapshot();
    await expect(tabs).to.be.accessible(AXE_OPTIONS);
  });

  it('disabled tab', async () => {
    tabs.items[2].disabled = true;
    await nextUpdate(tabs.items[2]);
    await expect(tabs).to.equalAriaSnapshot();
    await expect(tabs).to.be.accessible(AXE_OPTIONS);
  });

  it('aria-label', async () => {
    tabs.setAttribute('aria-label', 'Sections');
    await expect(tabs).to.equalAriaSnapshot();
    await expect(tabs).to.be.accessible(AXE_OPTIONS);
  });
});
