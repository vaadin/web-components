import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-upload.js';

describe('upload', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-upload></vaadin-upload>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('nodrop', async () => {
    element.nodrop = true;
    await visualDiff(div, 'nodrop');
  });

  it('dragover-valid', async () => {
    element.setAttribute('dragover-valid', '');
    await visualDiff(div, 'dragover-valid');
  });

  it('files', async () => {
    element.files = [
      { name: 'Don Quixote.pdf', progress: 100, complete: true },
      { name: 'Hamlet.pdf', progress: 100, complete: true },
    ];
    await visualDiff(div, 'files');
  });

  it('disabled', async () => {
    element.disabled = true;
    element.files = [
      {
        name: 'Don Quixote.pdf',
        held: true, // Show the start button
        error: 'Could not upload file', // Show the retry button
      },
    ];

    await visualDiff(div, 'disabled');
  });

  it('max files reached', async () => {
    element.maxFiles = 1;
    element.files = [{ name: 'Don Quixote.pdf' }];

    await visualDiff(div, 'max-files-reached');
  });
});
