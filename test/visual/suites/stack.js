import { visualDiff } from '@web/test-runner-visual-regression';
import { STACK_FIELDS } from '../fixtures/data.js';
import { screenshotName, stack } from '../fixtures/html.js';

export function stackSuite() {
  describe('stack', () => {
    describe('vertical-layout', () => {
      ['default', 'small'].forEach((mode) => {
        describe(mode, () => {
          ['plain', 'label'].forEach((state) => {
            it(state, async () => {
              await visualDiff(
                await stack(STACK_FIELDS, { mode, state }),
                screenshotName('vertical-layout', mode, state),
              );
            });
          });
        });
      });
    });
  });
}
