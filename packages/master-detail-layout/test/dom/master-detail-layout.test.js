import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

import '../../src/vaadin-master-detail-layout.js';

describe('vaadin-master-detail-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync('<vaadin-master-detail-layout></vaadin-master-detail-layout>');
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize', async () => {
      layout.masterSize = '300px';
      await expect(layout).dom.to.equalSnapshot();
    });

    it('detailSize', async () => {
      layout.detailSize = '400px';
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize and detailSize', async () => {
      layout.masterSize = '300px';
      layout.detailSize = '400px';
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(layout).shadowDom.to.equalSnapshot();
    });
  });
});
