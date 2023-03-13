import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-rich-text-editor.js';

describe('rich-text-editor', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>', div);
  });

  it('basic', async () => {
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
    element.style.minHeight = '400px';
    await visualDiff(div, 'min-height');
  });

  it('max-height', async () => {
    element.style.maxHeight = '500px';
    element.value = `[
      {"insert":"High quality rich text editor for the web"},
      {"attributes":{"header":2},"insert":"\\n"},
      {"attributes":{"bold":true},"insert":"Bold"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"attributes":{"italic":true},"insert":"Italic"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"attributes":{"underline":true},"insert":"Underline"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"attributes":{"strike":true},"insert":"Strike-through"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"insert":"Headings (H1, H2, H3)"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"insert":"Lists (ordered and unordered)"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"insert":"Text align (left, center, right)"},
      {"attributes":{"list":"bullet"},"insert":"\\n"},
      {"attributes":{"script":"sub"},"insert":"Sub"},
      {"insert":"script and "},{"attributes":{"script":"super"},"insert":"super"},
      {"insert":"script"},{"attributes":{"list":"bullet"},"insert":"\\n"},
      {"insert":"In addition to text formatting, additional content blocks can be added.\\nBlockquotes"},
      {"attributes":{"header":3},"insert":"\\n"},
      {"attributes":{"blockquote":true},"insert":"\\n"},
      {"insert":"Code blocks"},
      {"attributes":{"header":3},"insert":"\\n"},{"insert":"<body>"},
      {"attributes":{"code-block":true},"insert":"\\n"},
      {"insert":"  <vaadin-rich-text-editor></vaadin-rich-text-editor>"},
      {"attributes":{"code-block":true},"insert":"\\n"},
      {"insert":"</body>"},
      {"attributes":{"code-block":true},"insert":"\\n"},
      {"insert":"\\n"}
    ]`;
    await visualDiff(div, 'max-height');
  });
});
