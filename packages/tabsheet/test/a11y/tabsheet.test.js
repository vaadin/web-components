import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-tabsheet.js';

// The tabs scroll container has `tabindex="-1"` so that Firefox does not make it a Tab stop.
// axe reports it as a child of the tablist that is not a tab.
const AXE_OPTIONS = { ignoredRules: ['aria-required-children'] };

describe('vaadin-tabsheet', () => {
  let tabsheet;

  beforeEach(async () => {
    tabsheet = fixtureSync(`
      <vaadin-tabsheet>
        <vaadin-tabs slot="tabs">
          <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
          <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
          <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
        </vaadin-tabs>

        <div tab="tab-1">Content 1</div>
        <div tab="tab-2">Content 2</div>
        <div tab="tab-3">Content 3</div>
      </vaadin-tabsheet>
    `);
    await nextRender();
  });

  it('default', async () => {
    await expect(tabsheet).to.equalAriaSnapshot();
    await expect(tabsheet).to.be.accessible(AXE_OPTIONS);
  });

  it('selected', async () => {
    tabsheet.selected = 2;
    await nextUpdate(tabsheet);
    await expect(tabsheet).to.equalAriaSnapshot();
    await expect(tabsheet).to.be.accessible(AXE_OPTIONS);
  });

  it('prefix and suffix', async () => {
    tabsheet.insertAdjacentHTML('afterbegin', '<button slot="prefix">Back</button><button slot="suffix">Add</button>');
    await nextUpdate(tabsheet);
    await expect(tabsheet).to.equalAriaSnapshot();
    await expect(tabsheet).to.be.accessible(AXE_OPTIONS);
  });
});
