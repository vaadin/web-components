import { visualDiff } from '@web/test-runner-visual-regression';
import { CONTROLS } from '../fixtures/data.js';
import { row, screenshotName } from '../fixtures/html.js';

export function controlsSuite() {
  describe('controls', () => {
    CONTROLS.forEach(({ name, defs, modes }) => {
      describe(name, () => {
        modes.forEach((mode) => {
          describe(mode, () => {
            it('plain', async () => {
              await visualDiff(await row(defs, { mode }), screenshotName(name, mode, 'plain'));
            });
          });
        });
      });
    });
  });
}
