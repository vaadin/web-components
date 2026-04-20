import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-master-detail-layout.js';
import { onceResized } from '../../helpers.js';

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
    await onceResized(mdl);
  });

  describe('split', () => {
    it('basic', async () => {
      mdl.masterSize = '300px';
      mdl.detailSize = '300px';
      await onceResized(mdl);
      await visualDiff(element, 'split');
    });
  });

  describe('drawer', () => {
    beforeEach(async () => {
      mdl.masterSize = '100%';
      mdl.detailSize = '300px';
      await onceResized(mdl);
    });

    it('basic', async () => {
      await visualDiff(element, 'drawer-default');
    });

    it('page', async () => {
      mdl.overlayContainment = 'page';
      await onceResized(mdl);
      await visualDiff(document.body, 'drawer-page');
    });

    it('inset-drawer', async () => {
      mdl.setAttribute('theme', 'inset-drawer');
      await visualDiff(element, 'drawer-inset');
    });
  });
});
