import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
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
        await visualDiff(div, `${dir}-basic`);
      });

      it('nodrop', async () => {
        element.nodrop = true;
        await visualDiff(div, `${dir}-nodrop`);
      });

      it('files', async () => {
        element.files = [
          { name: 'Don Quixote.pdf', progress: 100, complete: true },
          { name: 'Hamlet.pdf', progress: 100, complete: true }
        ];
        await visualDiff(div, `${dir}-files`);
      });
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      element.files = [{ name: 'Don Quixote.pdf' }, { name: 'Hamlet.pdf', progress: 100, complete: true }];
      // To show the start button
      element.files[0].held = true;
      // To show the retry button
      element.files[0].error = 'Could not upload file';
      element.shadowRoot.querySelector('[part=upload-button]').focus();
    });

    it('file', async () => {
      // Focus the file
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-file');
    });

    it('start', async () => {
      // Focus the file
      await sendKeys({ press: 'Tab' });

      // Focus the start button
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-start');
    });

    it('retry', async () => {
      // Focus the file
      await sendKeys({ press: 'Tab' });

      // Focus the start button
      await sendKeys({ press: 'Tab' });

      // Focus the retry button
      await sendKeys({ press: 'Tab' });

      await visualDiff(div, 'focus-retry');
    });

    it('clear', async () => {
      // Focus the file
      await sendKeys({ press: 'Tab' });

      // Focus the start button
      await sendKeys({ press: 'Tab' });

      // Focus the retry button
      await sendKeys({ press: 'Tab' });

      // Focus the clear button
      await sendKeys({ press: 'Tab' });

      await visualDiff(div, 'focus-clear');
    });
  });

  describe('states', () => {
    it('max files reached', async () => {
      element.maxFiles = 1;
      element.files = [{ name: 'Don Quixote.pdf' }];

      await visualDiff(div, 'state-max-files-reached');
    });
  });
});
