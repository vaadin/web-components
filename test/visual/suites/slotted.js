import { visualDiff } from '@web/test-runner-visual-regression';
import { SLOTTED } from '../fixtures/data.js';
import { row, screenshotName, useMode } from '../fixtures/html.js';

export function slottedSuite() {
  describe('slotted', () => {
    SLOTTED.forEach(({ name, states }) => {
      describe(name, () => {
        ['default', 'small', 'rtl'].forEach((mode) => {
          describe(mode, () => {
            useMode(mode);

            Object.entries(states).forEach(([state, defs]) => {
              it(state, async () => {
                await visualDiff(await row(defs, { mode }), screenshotName(name, mode, state));
              });
            });
          });
        });
      });
    });
  });
}
