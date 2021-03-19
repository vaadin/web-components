import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-upload.js';

describe('upload', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-upload></vaadin-upload>', div);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('basic', async () => {
        await visualDiff(div, `upload:${dir}-basic`);
      });

      it('nodrop', async () => {
        element.nodrop = true;
        await visualDiff(div, `upload:${dir}-nodrop`);
      });

      it('files', async () => {
        element.files = [
          { name: 'Don Quixote.pdf', progress: 100, complete: true },
          { name: 'Hamlet.pdf', progress: 100, complete: true }
        ];
        await visualDiff(div, `upload:${dir}-files`);
      });
    });
  });
});
