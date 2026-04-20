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

          it('page', async () => {
            mdl.overlayContainment = 'page';
            await onceResized(mdl);
            await visualDiff(document.body, `${dir}-overlay-page`);
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

  describe('nested layouts', () => {
    let outer, inner;

    function openDetail(layout) {
      // Set detail content and skip animation
      return layout._setDetail(layout.querySelector(':scope > [slot="detail-hidden"]'), true);
    }

    beforeEach(async () => {
      outer = fixtureSync(
        `
          <vaadin-master-detail-layout master-size="300px" style="height: 400px; border: 1px solid lightgray;">
            <div>
              Outer Master
            </div>
            <vaadin-master-detail-layout master-size="200px" slot="detail-hidden">
              <div>
                Inner Master
              </div>
              <div slot="detail-hidden" style="min-width: 100px">
                Inner Detail
              </div>
            </vaadin-master-detail-layout>
          </vaadin-master-detail-layout>
        `,
        div,
      );
      inner = outer.querySelector('vaadin-master-detail-layout');
      await onceResized(div);
    });

    it('default', async () => {
      await visualDiff(div, `nested-layouts`);
    });

    describe('outer opened', () => {
      beforeEach(async () => {
        await openDetail(outer);
      });

      it('default', async () => {
        await visualDiff(div, `nested-layouts-outer-opened`);
      });

      it('overflow', async () => {
        div.style.width = '400px';
        await onceResized(div);
        await visualDiff(div, `nested-layouts-outer-opened-overflow`);
      });
    });

    describe('inner opened', () => {
      beforeEach(async () => {
        await openDetail(outer);
        await openDetail(inner);
      });

      it('default', async () => {
        await visualDiff(div, `nested-layouts-inner-opened`);
      });

      it('outer overflow', async () => {
        div.style.width = '400px';
        await onceResized(div);
        await visualDiff(div, `nested-layouts-inner-opened-outer-overflow`);
      });

      it('inner overflow', async () => {
        div.style.width = '200px';
        await onceResized(div);
        await visualDiff(div, `nested-layouts-inner-opened-inner-overflow`);
      });
    });
  });
});
