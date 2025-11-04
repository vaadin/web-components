import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/split-layout.css';
import '../../../vaadin-split-layout.js';

describe('split-layout', () => {
  let element;

  describe('basic', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-split-layout style="width: 200px; height: 100px">
          <div></div>
          <div></div>
        </vaadin-split-layout>
      `);
    });

    it('horizontal', async () => {
      await visualDiff(element, 'horizontal');
    });

    it('vertical', async () => {
      element.orientation = 'vertical';
      await visualDiff(element, 'vertical');
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
