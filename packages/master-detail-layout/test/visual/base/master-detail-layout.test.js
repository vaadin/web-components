import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-master-detail-layout.js';
import { onceResized } from '../../helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('master-detail-layout', () => {
  let div, mdl;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '30px';
  });

  describe('default', () => {
    beforeEach(async () => {
      mdl = fixtureSync(
        `
          <vaadin-master-detail-layout style="height: 400px; border: 1px solid lightgray;">
            <div>Master content</div>
            <div slot="detail">Detail content</div>
            <div slot="detail-placeholder">Detail placeholder</div>
          </vaadin-master-detail-layout>
        `,
        div,
      );
      await onceResized(mdl);
    });

    it('no detail', async () => {
      mdl.querySelector('[slot="detail"]').remove();
      mdl.querySelector('[slot="detail-placeholder"]').remove();
      await onceResized(mdl);
      await visualDiff(div, 'no-detail');
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
            await visualDiff(div, `${dir}-split-default`);
          });

          it('expand both', async () => {
            mdl.expand = 'both';
            await onceResized(mdl);
            await visualDiff(div, `${dir}-split-expand-both`);
          });

          it('expand detail', async () => {
            mdl.expand = 'detail';
            await onceResized(mdl);
            await visualDiff(div, `${dir}-split-expand-detail`);
          });

          it('dark', async () => {
            document.documentElement.style.setProperty('color-scheme', 'dark');
            await visualDiff(div, `${dir}-split-dark`);
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
            await visualDiff(div, `${dir}-overlay-default`);
          });

          it('viewport', async () => {
            mdl.overlayContainment = 'viewport';
            await onceResized(mdl);
            await visualDiff(document.body, `${dir}-overlay-viewport`);
          });

          it('overlay size', async () => {
            mdl.overlaySize = '100%';
            await onceResized(mdl);
            await visualDiff(div, `${dir}-overlay-size`);
          });

          it('dark', async () => {
            document.documentElement.style.setProperty('color-scheme', 'dark');
            await visualDiff(div, `${dir}-overlay-dark`);
            document.documentElement.style.removeProperty('color-scheme');
          });
        });
      });
    });
  });

  describe('detail placeholder', () => {
    beforeEach(async () => {
      mdl = fixtureSync(
        `
          <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="height: 400px; border: 1px solid lightgray;">
            <div>Master content</div>
            <div slot="detail-placeholder">Detail placeholder</div>
          </vaadin-master-detail-layout>
        `,
        div,
      );
      await onceResized(mdl);
    });

    it('default', async () => {
      await onceResized(mdl);
      await visualDiff(div, 'detail-placeholder');
    });

    it('overflow', async () => {
      div.style.width = '400px';
      await onceResized(mdl);
      await visualDiff(div, 'detail-placeholder-overflow');
    });

    it('expand both', async () => {
      mdl.expand = 'both';
      await onceResized(mdl);
      await visualDiff(div, `detail-placeholder-expand-both`);
    });

    it('expand detail', async () => {
      mdl.expand = 'detail';
      await onceResized(mdl);
      await visualDiff(div, `detail-placeholder-expand-detail`);
    });
  });

  describe('auto detail size', () => {
    let layouts;

    function openDetail(layout) {
      layout._setDetail(layout.querySelector(':scope > [slot="hidden"]'));
    }

    beforeEach(async () => {
      mdl = fixtureSync(
        `
          <vaadin-master-detail-layout master-size="300px" no-animation style="height: 400px; border: 1px solid lightgray;">
            <div>Master 0</div>
            <vaadin-master-detail-layout master-size="250px" no-animation slot="hidden">
              <div>Master 1</div>
              <vaadin-master-detail-layout master-size="200px" no-animation slot="hidden">
                <div>Master 2</div>
                <div slot="hidden" style="min-width: 100px">Detail 2</div>
              </vaadin-master-detail-layout>
            </vaadin-master-detail-layout>
          </vaadin-master-detail-layout>
        `,
        div,
      );

      layouts = [...div.querySelectorAll('vaadin-master-detail-layout')];
      await onceResized(mdl);
    });

    it('default', async () => {
      await visualDiff(div, 'auto-detail-size-default');
    });

    [0, 1, 2].forEach((depth) => {
      it(`detail opened (depth ${depth})`, async () => {
        layouts.slice(0, depth + 1).forEach(openDetail);
        await onceResized(mdl);
        await visualDiff(div, `auto-detail-size-detail-opened-depth-${depth}`);
      });
    });

    describe('overflow', () => {
      beforeEach(async () => {
        layouts.forEach(openDetail);
        await onceResized(mdl);
      });

      ['600px', '400px', '200px'].forEach((width, depth) => {
        it(`depth ${depth}`, async () => {
          div.style.width = width;
          await onceResized(mdl);
          await visualDiff(div, `auto-detail-size-overflow-depth-${depth}`);
        });
      });
    });
  });
});
