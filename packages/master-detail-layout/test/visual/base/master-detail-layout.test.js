import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-master-detail-layout.js';
import { onceResized } from '../../helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('master-detail-layout', () => {
  let element, mdl;

  beforeEach(async () => {
    element = fixtureSync(`
      <div style="padding: 30px;">
        <vaadin-master-detail-layout style="height: 400px; border: 1px solid lightgray;">
          <div>Master content</div>
          <div slot="detail">Detail content</div>
        </vaadin-master-detail-layout>
      </div>
    `);
    mdl = element.querySelector('vaadin-master-detail-layout');
    await onceResized(mdl);
  });

  it('no detail', async () => {
    mdl.querySelector('[slot="detail"').remove();
    await onceResized(mdl);
    await visualDiff(element, `no-detail`);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('split', () => {
        beforeEach(async () => {
          mdl.masterSize = '300px';
          mdl.detailSize = '300px';
          await onceResized(mdl);
        });

        it('basic', async () => {
          await visualDiff(element, `${dir}-split-default`);
        });

        it('dark', async () => {
          document.documentElement.style.setProperty('color-scheme', 'dark');
          await visualDiff(element, `${dir}-split-dark`);
          document.documentElement.style.removeProperty('color-scheme');
        });
      });

      describe('overlay', () => {
        beforeEach(async () => {
          mdl.masterSize = '100%';
          mdl.detailSize = '300px';
          await onceResized(mdl);
        });

        it('basic', async () => {
          await visualDiff(element, `${dir}-overlay-default`);
        });

        it('viewport', async () => {
          mdl.detailOverlayMode = 'drawer-viewport';
          await onceResized(mdl);
          await visualDiff(document.body, `${dir}-overlay-viewport`);
        });

        it('dark', async () => {
          document.documentElement.style.setProperty('color-scheme', 'dark');
          await visualDiff(element, `${dir}-overlay-dark`);
          document.documentElement.style.removeProperty('color-scheme');
        });
      });
    });
  });
});
