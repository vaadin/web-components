import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../src/vaadin-dialog.js';
import { createRenderer } from '../../helpers.js';

describe('dialog', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync(`<vaadin-dialog></vaadin-dialog>`, div);
    element.renderer = createRenderer('Simple dialog with text');
    element.opened = true;
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('modeless', async () => {
    element.modeless = true;
    await nextUpdate(element);
    await visualDiff(div, 'modeless');
  });

  it('title', async () => {
    element.headerTitle = 'Title';
    await nextUpdate(element);
    await visualDiff(div, 'header-title');
  });

  it('header renderer', async () => {
    element.headerRenderer = createRenderer('Header');
    await nextUpdate(element);
    await visualDiff(div, 'header-renderer');
  });

  it('title and header renderer', async () => {
    element.headerTitle = 'Title';
    element.headerRenderer = createRenderer('Header');
    await nextUpdate(element);
    await visualDiff(div, 'header-title-renderer');
  });

  it('footer renderer', async () => {
    element.footerRenderer = createRenderer('Footer');
    await nextUpdate(element);
    await visualDiff(div, 'footer-renderer');
  });

  it('header and footer renderer', async () => {
    element.headerRenderer = createRenderer('Header');
    element.footerRenderer = createRenderer('Footer');
    await nextUpdate(element);
    await visualDiff(div, 'header-footer-renderer');
  });

  it('long title and header renderer', async () => {
    element.$.overlay.style.maxWidth = '20rem';
    element.headerTitle = 'Long title that wraps in multiple lines';
    element.headerRenderer = createRenderer('Header');
    await nextUpdate(element);
    await visualDiff(div, 'header-title-multiple-lines');
  });

  it('long single word title and header renderer', async () => {
    element.$.overlay.style.maxWidth = '20rem';
    element.headerTitle = 'InternationalizationConfigurationHelper';
    element.headerRenderer = createRenderer('Header');
    await nextUpdate(element);
    await visualDiff(div, 'header-title-long-single-word');
  });

  it('no-padding theme', async () => {
    element.setAttribute('theme', 'no-padding');
    const contentStyles = new CSSStyleSheet();
    contentStyles.insertRule('vaadin-dialog::part(content) { padding: 20px; }');
    document.adoptedStyleSheets = [contentStyles];
    await nextUpdate(element);
    await visualDiff(div, 'content-no-padding-theme');
  });

  describe('slotted content', () => {
    it('slotted header', async () => {
      const header = document.createElement('div');
      header.setAttribute('slot', 'header-content');
      header.textContent = 'Slotted Header';
      element.appendChild(header);
      await nextUpdate(element);
      await visualDiff(div, 'slotted-header');
    });

    it('slotted footer', async () => {
      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.textContent = 'Slotted Footer';
      element.appendChild(footer);
      await nextUpdate(element);
      await visualDiff(div, 'slotted-footer');
    });

    it('slotted header and footer', async () => {
      const header = document.createElement('div');
      header.setAttribute('slot', 'header-content');
      header.textContent = 'Slotted Header';
      element.appendChild(header);

      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.textContent = 'Slotted Footer';
      element.appendChild(footer);

      await nextUpdate(element);
      await visualDiff(div, 'slotted-header-footer');
    });

    it('title with slotted header', async () => {
      element.headerTitle = 'Dialog Title';

      const header = document.createElement('div');
      header.setAttribute('slot', 'header-content');
      header.textContent = 'Close';
      element.appendChild(header);

      await nextUpdate(element);
      await visualDiff(div, 'title-slotted-header');
    });
  });
});
