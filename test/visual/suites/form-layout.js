import { visualDiff } from '@web/test-runner-visual-regression';
import { FORM_FIELDS } from '../fixtures/data.js';
import { form, FORM_LAYOUTS, screenshotName } from '../fixtures/html.js';

export function formLayoutSuite() {
  describe('form layout', () => {
    describe('form-layout', () => {
      Object.keys(FORM_LAYOUTS).forEach((layout) => {
        describe(layout, () => {
          ['label', 'required with helper above'].forEach((state) => {
            it(state, async () => {
              await visualDiff(
                await form(FORM_FIELDS, { layout, state }),
                screenshotName('form-layout', layout, state),
              );
            });
          });
        });
      });
    });
  });
}
