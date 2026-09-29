import { visualDiff } from '@web/test-runner-visual-regression';
import { FIELD_MODES, FIELDS } from '../fixtures/data.js';
import { row, screenshotName, useMode } from '../fixtures/html.js';

export function fieldBaselineSuite() {
  describe('field baseline', () => {
    FIELDS.forEach((def) => {
      const component = def.tag.replace('vaadin-', '');

      describe(component, () => {
        Object.entries(def.modes || FIELD_MODES).forEach(([mode, states]) => {
          describe(mode, () => {
            useMode(mode);

            states.forEach((state) => {
              it(state, async () => {
                await visualDiff(await row(def, { mode, state }), screenshotName(component, mode, state));
              });
            });
          });
        });
      });
    });
  });
}
