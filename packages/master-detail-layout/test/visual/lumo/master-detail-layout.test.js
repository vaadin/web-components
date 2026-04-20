import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/master-detail-layout.css';
import '../../../vaadin-master-detail-layout.js';
import { onceResized } from '../../helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('master-detail-layout', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-master-detail-layout style="height: 400px">
        <div>Master content</div>
        <div slot="detail">Detail content</div>
      </vaadin-master-detail-layout>
    `);
    await onceResized(element);
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
        beforeEach(async () => {
          element.masterSize = '100%';
          element.detailSize = '300px';
          await onceResized(element);
        });

        it('basic', async () => {
          await visualDiff(element, `${dir}-overlay-default`);
        });

        it('page', async () => {
          element.overlayContainment = 'page';
          await onceResized(element);
          await visualDiff(document.body, `${dir}-overlay-page`);
        });

        it('no detail', async () => {
          element.querySelector('[slot="detail"').remove();
          await onceResized(element);
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
