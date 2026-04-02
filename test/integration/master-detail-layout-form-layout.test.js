import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '@vaadin/form-layout';
import '@vaadin/master-detail-layout';
import { assertFormLayoutGrid } from '@vaadin/form-layout/test/helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('form-layout in master-detail-layout', () => {
  let mdl;

  describe('detail auto size', () => {
    beforeEach(async () => {
      mdl = fixtureSync(`
        <vaadin-master-detail-layout style="width: 800px;" master-size="300px">
          <div>Master</div>
        </vaadin-master-detail-layout>
      `);
      await nextFrame();
      await nextResize(mdl);
    });

    it('should expand form layout to max columns', async () => {
      const formLayout = document.createElement('vaadin-form-layout');
      formLayout.autoResponsive = true;
      formLayout.autoRows = true;
      formLayout.maxColumns = 3;

      for (let i = 0; i < 6; i++) {
        formLayout.appendChild(document.createElement('input'));
      }

      await mdl._setDetail(formLayout);

      assertFormLayoutGrid(formLayout, { columns: 3, rows: 2 });
    });
  });
});
