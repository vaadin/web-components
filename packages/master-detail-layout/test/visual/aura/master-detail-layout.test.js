import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('master-detail-layout', () => {
  let element, mdl;

  beforeEach(async () => {
    element = fixtureSync(`
      <div style="padding: 30px;">
        <vaadin-master-detail-layout style="height: 400px;">
          <div>Master content</div>
          <div slot="detail">Detail content</div>
        </vaadin-master-detail-layout>
      </div>
    `);
    mdl = element.querySelector('vaadin-master-detail-layout');
    await nextRender();
  });

  describe('split', () => {
    it('basic', async () => {
      await visualDiff(element, 'split');
    });
  });

  describe('drawer', () => {
    beforeEach(() => {
      mdl.masterSize = '600px';
      mdl.detailSize = '300px';
      mdl.forceOverlay = true;
    });

    it('basic', async () => {
      await visualDiff(element, 'drawer-default');
    });

    it('viewport', async () => {
      mdl.containment = 'viewport';
      await visualDiff(document.body, 'drawer-viewport');
    });

    it('inset-drawer', async () => {
      mdl.setAttribute('theme', 'inset-drawer');
      await visualDiff(element, 'drawer-inset');
    });
  });
});
