import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-split-layout.js';

describe('vaadin-split-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync('<vaadin-split-layout></vaadin-split-layout>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('vertical', async () => {
      layout.orientation = 'vertical';
      await nextUpdate(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(layout).shadowDom.to.equalSnapshot();
    });

    it('vertical', async () => {
      layout.orientation = 'vertical';
      await nextUpdate(layout);
      await expect(layout).shadowDom.to.equalSnapshot();
    });

    it('i18n', async () => {
      layout.i18n = { separator: 'separator' };
      await nextUpdate(layout);
      await expect(layout).shadowDom.to.equalSnapshot();
    });
  });
});
