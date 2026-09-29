import { visualDiff } from '@web/test-runner-visual-regression';
import { ITEM_LISTS } from '../fixtures/data.js';
import { row, screenshotName } from '../fixtures/html.js';

export function itemsSuite() {
  describe('items', () => {
    ITEM_LISTS.forEach(({ name, defs }) => {
      describe(name, () => {
        ['default', 'small'].forEach((mode) => {
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
