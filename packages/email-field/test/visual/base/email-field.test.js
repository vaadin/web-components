import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-email-field.js';

describe('email-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-email-field></vaadin-email-field>', div);
  });

  describe('states', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it('value', async () => {
          element.value = 'value';
          await visualDiff(div, `${dir}-value`);
        });

        it('placeholder', async () => {
          element.placeholder = 'Placeholder';
          await visualDiff(div, `${dir}-placeholder`);
        });
      });
    });
  });
});
