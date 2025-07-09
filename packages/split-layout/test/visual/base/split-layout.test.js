import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-split-layout.js';

describe('split-layout', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync(`
      <vaadin-split-layout style="width: 200px; height: 100px">
        <div></div>
        <div></div>
      </vaadin-split-layout>
    `);
  });

  afterEach(async () => {
    await resetMouse();
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    describe(orientation, () => {
      beforeEach(() => {
        element.orientation = orientation;
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
});
