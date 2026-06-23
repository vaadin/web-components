import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/split-layout.css';
import '../../../vaadin-split-layout.js';

describe('split-layout', () => {
  let element;

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

      afterEach(async () => {
        await resetMouse();
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

      it(`${orientation} minimal`, async () => {
        element.setAttribute('theme', 'minimal');
        await visualDiff(element, `${orientation}-minimal`);
      });

      it(`${orientation} minimal hover`, async () => {
        element.setAttribute('theme', 'minimal');
        await sendMouseToElement({ type: 'move', element: element.$.splitter });
        await visualDiff(element, `${orientation}-minimal-hover`);
      });
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
