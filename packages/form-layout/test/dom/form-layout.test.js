import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-layout.js';

describe('vaadin-form-layout', () => {
  let layout;

  describe('auto-responsive', () => {
    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout auto-responsive>
          <input placeholder="First name" />
          <input placeholder="Last name" />
          <input placeholder="Email" />
          <input placeholder="Phone" />
        </vaadin-form-layout>
      `);
    });

    describe('host', () => {
      it('default', async () => {
        await expect(layout).dom.to.equalSnapshot();
      });

      it('autoRows', async () => {
        layout.autoRows = true;
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
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(layout).shadowDom.to.equalSnapshot();
      });
    });
  });
});
