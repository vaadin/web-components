import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/button.css';
import '@vaadin/vaadin-lumo-styles/components/integer-field.css';
import '@vaadin/vaadin-lumo-styles/components/pdf-viewer.css';
import '@vaadin/vaadin-lumo-styles/components/select.css';
import '@vaadin/vaadin-lumo-styles/components/tooltip.css';
import '../not-animated-styles.css';
import '../../enable-feature-flag.js';
import '../../../vaadin-pdf-viewer.js';
import type { IntegerField } from '@vaadin/integer-field';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import type { PdfViewer } from '../../../vaadin-pdf-viewer.js';
import { createPdf, loadAndRender, openSidebar, uriLink } from '../../helpers.js';

describe('pdf-viewer', () => {
  let div: HTMLDivElement;
  let viewer: PdfViewer;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>', div);
    await nextRender();
  });

  async function load() {
    await loadAndRender(viewer, createPdf(Array.from({ length: 6 }, () => ({ content: '' }))));
  }

  it('empty', async () => {
    await visualDiff(div, 'empty');
  });

  it('document', async () => {
    await load();
    await visualDiff(div, 'document');
  });

  it('actions', async () => {
    const button = document.createElement('vaadin-button');
    button.slot = 'toolbar-actions';
    button.textContent = 'Approve';
    viewer.appendChild(button);
    await load();
    await visualDiff(div, 'actions');
  });

  it('toolbar hidden', async () => {
    viewer.toolbarHidden = true;
    await load();
    await visualDiff(div, 'toolbar-hidden');
  });

  it('sidebar', async () => {
    await load();
    await openSidebar(viewer);
    await visualDiff(div, 'sidebar');
  });

  it('sidebar RTL', async () => {
    viewer.setAttribute('dir', 'rtl');
    await load();
    await openSidebar(viewer);
    await visualDiff(div, 'sidebar-rtl');
  });

  it('page error', async () => {
    await load();
    const field = viewer.querySelector<IntegerField>('[slot="toolbar-page"]')!;
    field.focus();
    (field.inputElement as HTMLInputElement).select();
    await sendKeys({ type: '999' });
    await sendKeys({ press: 'Enter' });
    await nextFrame();
    await visualDiff(div, 'page-error');
  });

  describe('focus', () => {
    it('content', async () => {
      await load();
      viewer.focus();
      await visualDiff(div, 'content-focus');
    });

    it('button', async () => {
      await load();
      viewer.querySelector('vaadin-integer-field')!.focus();
      await sendKeys({ press: 'Shift+Tab' });
      await visualDiff(div, 'button-focus');
    });

    it('header', async () => {
      await load();
      viewer.shadowRoot!.querySelector<HTMLElement>('[part="header"]')!.focus({ focusVisible: true });
      await visualDiff(div, 'header-focus');
    });

    it('thumbnail', async () => {
      await load();
      await openSidebar(viewer);
      viewer.shadowRoot!.querySelector<HTMLElement>('[part~="thumbnail"]')!.focus({ focusVisible: true });
      await visualDiff(div, 'thumbnail-focus');
    });

    it('link', async () => {
      await loadAndRender(viewer, createPdf([{ content: '', annotations: [uriLink([72, 700, 272, 740])] }]));
      viewer.focus();
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'link-focus');
    });
  });
});
