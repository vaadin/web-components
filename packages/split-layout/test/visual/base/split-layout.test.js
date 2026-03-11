import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-split-layout.js';

describe('split-layout', () => {
  let element;

  afterEach(async () => {
    await resetMouse();
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    describe(orientation, () => {
      beforeEach(() => {
        element = fixtureSync(`
          <vaadin-split-layout orientation="${orientation}" style="width: 200px; height: 100px">
            <div></div>
            <div></div>
          </vaadin-split-layout>
        `);
      });

      it(orientation, async () => {
        await visualDiff(element, orientation);
      });

      it(`${orientation} small`, async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(element, `${orientation}-small`);
      });

      it(`${orientation} small hover`, async () => {
        element.setAttribute('theme', 'small');
        await sendMouseToElement({ type: 'move', element: element.$.splitter });
        await visualDiff(element, `${orientation}-small-hover`);
      });
    });
  });

  describe('overflow', () => {
    it('horizontal', async () => {
      element = fixtureSync(`
        <vaadin-split-layout style="width: 300px; height: 100px">
          <div>
            <div style="min-width: 400px; height: 50px; background: #ddd"></div>
          </div>
          <div></div>
        </vaadin-split-layout>
      `);
      // Shrink primary panel smaller than its content
      element.querySelector('div[slot="primary"], div:first-child').style.flex = '1 1 80px';
      await visualDiff(element, 'overflow-horizontal');
    });

    it('vertical', async () => {
      element = fixtureSync(`
        <vaadin-split-layout orientation="vertical" style="width: 200px; height: 200px">
          <div>
            <div style="min-height: 400px; background: #ddd"></div>
          </div>
          <div></div>
        </vaadin-split-layout>
      `);
      // Shrink primary panel smaller than its content
      element.querySelector('div[slot="primary"], div:first-child').style.flex = '1 1 60px';
      await visualDiff(element, 'overflow-vertical');
    });
  });

  describe('nested', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-split-layout orientation="vertical" style="height: 500px">
          <vaadin-split-layout slot="primary" orientation="horizontal">
            <span slot="primary">Foo</span>
            <span slot="secondary">Bar</span>
          </vaadin-split-layout>>
          <div slot="secondary">
            Baz
          </div>
        </vaadin-split-layout>
      `);
    });

    it('horizontal', async () => {
      await visualDiff(element, 'nested');
    });
  });
});
