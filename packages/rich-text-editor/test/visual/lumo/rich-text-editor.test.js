import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-rich-text-editor.js';

describe('rich-text-editor', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>', div);
  });

  it('basic', async () => {
    element.shadowRoot.querySelector('.ql-editor').focus();
    await visualDiff(div, 'basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('min-height', async () => {
    element.style.minHeight = '250px';
    await visualDiff(div, 'min-height');
  });

  it('max-height', async () => {
    element.style.maxHeight = '500px';
    element.value = JSON.stringify(
      Array.from({ length: 12 }, () => ({
        insert: 'High quality rich text editor for the web\n',
      })),
    );
    await visualDiff(div, 'max-height');
  });

  describe('rich content', () => {
    it('headings', async () => {
      element.value = JSON.stringify([
        { insert: 'Heading 1\n', attributes: { header: 1 } },
        { insert: 'Heading 2\n', attributes: { header: 2 } },
        { insert: 'Heading 3\n', attributes: { header: 3 } },
        { insert: 'Heading 4\n', attributes: { header: 4 } },
        { insert: 'Heading 5\n', attributes: { header: 5 } },
      ]);
      await visualDiff(div, 'rich-content-headings');
    });

    it('text formatting', () => {
      element.value = JSON.stringify([
        { insert: 'Bold\n', attributes: { list: 'bullet', bold: true } },
        { insert: 'Italic\n', attributes: { list: 'bullet', italic: true } },
        { insert: 'Underline\n', attributes: { list: 'bullet', underline: true } },
        { insert: 'Strike-through\n', attributes: { list: 'bullet', strike: true } },
        { insert: 'Sub', attributes: { script: 'sub' } },
        { insert: 'script and ' },
        { insert: 'super', attributes: { script: 'super' } },
        { insert: 'script' },
        { insert: '\n', attributes: { list: 'bullet' } },
      ]);
      return visualDiff(div, 'rich-content-text-formatting');
    });

    it('blocks', () => {
      element.value = JSON.stringify([
        { insert: 'This is a blockquote\n', attributes: { blockquote: true } },
        { insert: '<body>\n', attributes: { 'code-block': true } },
        { insert: '  <vaadin-rich-text-editor></vaadin-rich-text-editor>\n', attributes: { 'code-block': true } },
        { insert: '</body>\n', attributes: { 'code-block': true } },
      ]);
      return visualDiff(div, 'rich-content-blocks');
    });
  });
});
