import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('vaadin-master-detail-layout', () => {
  let layout;

  beforeEach(() => {
    layout = fixtureSync('<vaadin-master-detail-layout></vaadin-master-detail-layout>');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(layout).shadowDom.to.equalSnapshot();
    });
  });
});
