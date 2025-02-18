import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/dialog';

function getEffectiveColumnCount(layout) {
  const offsets = [...layout.children]
    .filter((child) => getComputedStyle(child).display !== 'none')
    .map((child) => child.offsetLeft);
  return new Set(offsets).size;
}

function getEffectiveRowCount(layout) {
  const offsets = [...layout.children]
    .filter((child) => getComputedStyle(child).display !== 'none')
    .map((child) => child.offsetTop);
  return new Set(offsets).size;
}

describe('form-layout in dialog', () => {
  let dialog, layout;

  beforeEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('basic', () => {
    beforeEach(async () => {
      dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
      dialog.renderer = (root) => {
        root.innerHTML = `
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">First name</label>
            <input />
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Last name</label>
            <input />
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Email</label>
            <input />
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Phone</label>
            <input />
          </vaadin-form-item>
        </vaadin-form-layout>
      `;
      };
      dialog.opened = true;
      await nextRender();
      layout = dialog.$.overlay.querySelector('vaadin-form-layout');
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextFrame();
    });

    it('should arrange form items in two columns', () => {
      expect(getEffectiveColumnCount(layout)).to.equal(2);
      expect(getEffectiveRowCount(layout)).to.equal(2);
    });
  });

  describe('auto-responsive', () => {
    beforeEach(async () => {
      dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
      dialog.renderer = (root) => {
        root.innerHTML = `
        <vaadin-form-layout auto-responsive auto-rows max-columns="3" column-width="100px" style="--vaadin-form-layout-column-spacing: 0px;">
          <input placeholder="First name">
          <input placeholder="Last Name">
          <input placeholder="Email">
          <input placeholder="Phone">
        </vaadin-form-layout>
      `;
      };
      dialog.opened = true;
      await nextRender();
      layout = dialog.$.overlay.querySelector('vaadin-form-layout');
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextFrame();
    });

    it('should have 3 columns and 2 rows', () => {
      expect(getEffectiveColumnCount(layout)).to.equal(3);
      expect(getEffectiveRowCount(layout)).to.equal(2);
    });

    it('should adjust number of columns and rows on viewport resize', async () => {
      // Dialog adds a total gap of 80px between the layout and the viewport
      const dialogGap = 80;

      await setViewport({ width: 200 + dialogGap, height: 768 });
      expect(getEffectiveColumnCount(layout)).to.equal(2);
      expect(getEffectiveRowCount(layout)).to.equal(2);

      await setViewport({ width: 100 + dialogGap, height: 768 });
      expect(getEffectiveColumnCount(layout)).to.equal(1);
      expect(getEffectiveRowCount(layout)).to.equal(4);

      await setViewport({ width: 50 + dialogGap, height: 768 });
      expect(getEffectiveColumnCount(layout)).to.equal(1);
      expect(getEffectiveRowCount(layout)).to.equal(4);

      await setViewport({ width: 200 + dialogGap, height: 768 });
      expect(getEffectiveColumnCount(layout)).to.equal(2);
      expect(getEffectiveRowCount(layout)).to.equal(2);

      await setViewport({ width: 300 + dialogGap, height: 768 });
      expect(getEffectiveColumnCount(layout)).to.equal(3);
      expect(getEffectiveRowCount(layout)).to.equal(2);
    });
  });
});
