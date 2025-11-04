import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/rich-text-editor.css';
import '../common.js';
import '../../../vaadin-rich-text-editor.js';

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
        { insert: 'Bold\n', attributes: { bold: true } },
        { insert: 'Italic\n', attributes: { italic: true } },
        { insert: 'Underline\n', attributes: { underline: true } },
        { insert: 'Strike-through\n', attributes: { strike: true } },
        { insert: 'Sub', attributes: { script: 'sub' } },
        { insert: 'script and ' },
        { insert: 'super', attributes: { script: 'super' } },
        { insert: 'script\n' },
        { insert: '<vaadin-rich-text-editor></vaadin-rich-text-editor>\n', attributes: { code: true } },
      ]);
      return visualDiff(div, 'rich-content-text-formatting');
    });

    it('text alignment', () => {
      element.value = JSON.stringify([
        { insert: 'Left aligned\n', attributes: { align: 'left' } },
        { insert: 'Center aligned\n', attributes: { align: 'center' } },
        { insert: 'Right aligned\n', attributes: { align: 'right' } },
      ]);
      return visualDiff(div, 'rich-content-text-alignment');
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

  ['ltr', 'rtl'].forEach((dir) => {
    describe(`${dir}`, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('indent', () => {
        it('basic', () => {
          element.value = JSON.stringify([
            { insert: 'A\n', attributes: { indent: 0 } },
            { insert: 'B\n', attributes: { indent: 1 } },
            { insert: 'C\n', attributes: { indent: 2 } },
            { insert: 'D\n', attributes: { indent: 3 } },
            { insert: 'E\n', attributes: { indent: 4 } },
            { insert: 'F\n', attributes: { indent: 5 } },
            { insert: 'G\n', attributes: { indent: 6 } },
            { insert: 'H\n', attributes: { indent: 7 } },
            { insert: 'I\n', attributes: { indent: 8 } },
          ]);
          return visualDiff(div, `${dir}-indent`);
        });
      });

      describe('lists', () => {
        it('basic', () => {
          element.value = JSON.stringify([
            { insert: 'Ordered list item 1\n', attributes: { list: 'ordered' } },
            { insert: 'Ordered list item 2\n', attributes: { list: 'ordered' } },
            { insert: 'Unordered list item 1\n', attributes: { list: 'bullet' } },
            { insert: 'Unordered list item 2\n', attributes: { list: 'bullet' } },
          ]);
          return visualDiff(div, `${dir}-list-basic`);
        });

        it('bullet-indent', () => {
          element.value = JSON.stringify([
            { insert: 'A\n', attributes: { list: 'bullet', indent: 0 } },
            { insert: 'B\n', attributes: { list: 'bullet', indent: 1 } },
            { insert: 'C\n', attributes: { list: 'bullet', indent: 2 } },
            { insert: 'D\n', attributes: { list: 'bullet', indent: 3 } },
            { insert: 'E\n', attributes: { list: 'bullet', indent: 4 } },
            { insert: 'F\n', attributes: { list: 'bullet', indent: 5 } },
            { insert: 'G\n', attributes: { list: 'bullet', indent: 6 } },
            { insert: 'H\n', attributes: { list: 'bullet', indent: 7 } },
            { insert: 'I\n', attributes: { list: 'bullet', indent: 8 } },
          ]);
          return visualDiff(div, `${dir}-list-bullet-indent`);
        });

        it('ordered-indent', () => {
          element.value = JSON.stringify([
            { insert: 'A\n', attributes: { list: 'ordered', indent: 0 } },
            { insert: 'B\n', attributes: { list: 'ordered', indent: 1 } },
            { insert: 'C\n', attributes: { list: 'ordered', indent: 2 } },
            { insert: 'D\n', attributes: { list: 'ordered', indent: 3 } },
            { insert: 'E\n', attributes: { list: 'ordered', indent: 4 } },
            { insert: 'F\n', attributes: { list: 'ordered', indent: 5 } },
            { insert: 'G\n', attributes: { list: 'ordered', indent: 6 } },
            { insert: 'H\n', attributes: { list: 'ordered', indent: 7 } },
            { insert: 'I\n', attributes: { list: 'ordered', indent: 8 } },
          ]);
          return visualDiff(div, `${dir}-list-ordered-indent`);
        });
      });
    });
  });
});
