import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/form-layout/theme/lumo/vaadin-form-layout.js';
import '@vaadin/form-layout/theme/lumo/vaadin-form-item.js';
import '../../../theme/lumo/vaadin-upload.js';

describe('upload', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      beforeEach(() => {
        element = fixtureSync('<vaadin-upload></vaadin-upload>', div);
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
          { name: 'Hamlet.pdf', progress: 100, complete: true },
        ];
        await visualDiff(div, `${dir}-files`);
      });
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      element = fixtureSync('<vaadin-upload></vaadin-upload>', div);
      element.files = [
        {
          name: 'Don Quixote.pdf',
          held: true, // Show the start button
          error: 'Could not upload file', // Show the retry button
        },
        { name: 'Hamlet.pdf', progress: 100, complete: true },
      ];
      element.querySelector('[slot="add-button"]').focus();
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
    beforeEach(() => {
      element = fixtureSync('<vaadin-upload></vaadin-upload>', div);
    });

    it('max files reached', async () => {
      element.maxFiles = 1;
      element.files = [{ name: 'Don Quixote.pdf' }];

      await visualDiff(div, 'state-max-files-reached');
    });
  });

  describe('form-item', () => {
    beforeEach(() => {
      element = fixtureSync(
        `<vaadin-form-layout>
          <vaadin-upload></vaadin-upload>
          <vaadin-form-item>
            <label slot="label">Description</label>
            <textarea></textarea>
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">File</label>
            <vaadin-upload></vaadin-upload>
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Description</label>
            <textarea></textarea>
          </vaadin-form-item>
        </vaadin-form-layout>`,
        div,
      );
    });

    it('form-item', async () => {
      await visualDiff(div, 'form-item');
    });
  });
});
