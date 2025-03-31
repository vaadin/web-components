import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-material-styles/color-global.js';
import '../../../theme/material/vaadin-master-detail-layout.js';

describe('master-detail-layout', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-master-detail-layout style="height: 400px">
        <div>Master content</div>
        <div slot="detail">Detail content</div>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('overlay', () => {
        beforeEach(() => {
          element.masterSize = '600px';
          element.detailSize = '300px';
          element.forceOverlay = true;
        });

        it('basic', async () => {
          await visualDiff(element, `${dir}-overlay-default`);
        });

        it('viewport', async () => {
          element.containment = 'viewport';
          await visualDiff(document.body, `${dir}-overlay-viewport`);
        });

        it('no detail', async () => {
          element.querySelector('[slot="detail"').remove();
          await visualDiff(document.body, `${dir}-overlay-no-detail`);
        });

        it('dark', async () => {
          document.documentElement.setAttribute('theme', 'dark');
          await visualDiff(element, `${dir}-overlay-dark`);
          document.documentElement.removeAttribute('theme');
        });
      });
    });
  });
});
