import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../vaadin-tabsheet.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-tabsheet', () => {
  let tabsheet;

  beforeEach(async () => {
    resetUniqueId();
    tabsheet = fixtureSync(`
      <vaadin-tabsheet>
        <div slot="prefix">Prefix</div>
        <div slot="suffix">Suffix</div>

        <vaadin-tabs slot="tabs">
          <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
          <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
          <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
        </vaadin-tabs>

        <div tab="tab-1"></div>
        <div tab="tab-2"></div>
        <div tab="tab-3"></div>
      </vaadin-tabsheet>
    `);

    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(tabsheet).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(tabsheet).shadowDom.to.equalSnapshot();
    });
  });
});
