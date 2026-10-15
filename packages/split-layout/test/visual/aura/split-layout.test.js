import { resetMouse } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-split-layout.js';

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
    });
  });
});
