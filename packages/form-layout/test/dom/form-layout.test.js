import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-layout.js';

describe('vaadin-form-layout', () => {
  let layout;

  describe('auto-responsive', () => {
    describe('basic', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout auto-responsive>
            <input placeholder="First name" />
            <input placeholder="Last name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>
        `);
        await nextFrame();
      });

      describe('host', () => {
        it('default', async () => {
          await expect(layout).dom.to.equalSnapshot();
        });

        it('maxColumns', async () => {
          layout.maxColumns = 3;
          await expect(layout).dom.to.equalSnapshot();
        });

        it('columnWidth', async () => {
          layout.columnWidth = '15em';
          await expect(layout).dom.to.equalSnapshot();
        });

        it('labelsAside', async () => {
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).dom.to.equalSnapshot();
        });
      });

      describe('shadow', () => {
        it('default', async () => {
          await expect(layout).shadowDom.to.equalSnapshot();
        });

        it('labelsAside', async () => {
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).shadowDom.to.equalSnapshot();
        });

        it('labelsAside with too narrow layout', async () => {
          layout.style.width = '8em';
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).shadowDom.to.equalSnapshot();
        });
      });
    });

    describe('autoRows', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout auto-responsive auto-rows>
            <input placeholder="First name" />
            <input placeholder="Last name" />
            <br>
            <input placeholder="Address" hidden />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>
        `);
        await nextFrame();
      });

      it('default', async () => {
        await expect(layout).dom.to.equalSnapshot();
      });
    });
  });
});
