import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../enable-feature-flag.js';
import '../../../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../../../vaadin-pdf-viewer.js';
import { fixtureUrl, nextRenderIdle } from '../../helpers.js';

describe('pdf-viewer', () => {
  let div: HTMLElement;
  let element: PdfViewer;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.padding = '10px';
    div.style.width = '600px';
    element = fixtureSync('<vaadin-pdf-viewer></vaadin-pdf-viewer>', div);
    await nextRender();
  });

  it('document', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'document');
  });

  it('zoom', async () => {
    element.zoom = 0.25;
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'zoom');
  });

  it('toolbar-focus', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    element.querySelector<HTMLElement>('vaadin-integer-field')!.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'toolbar-focus');
  });

  it('narrow', async () => {
    div.style.width = '375px';
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'narrow');
  });

  it('text-selection', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    const textLayer = element.shadowRoot!.querySelector('.text-layer')!;
    const span = [...textLayer.querySelectorAll('span')].find((item) => item.textContent!.startsWith('The quick'))!;
    const range = document.createRange();
    range.selectNodeContents(span);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    await visualDiff(div, 'text-selection');
    selection.removeAllRanges();
  });

  it('link-focus', async () => {
    element.src = fixtureUrl('links.pdf');
    await nextRenderIdle(element);
    element.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'link-focus');
  });

  it('content-focus', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="print"]')!.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'content-focus');
  });

  it('find', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
    await nextRender();
    await sendKeys({ type: 'quick' });
    // Wait for the search and the highlights
    for (let i = 0; i < 50 && !element.shadowRoot!.querySelector('.find-match.current'); i++) {
      await nextFrame();
    }
    await visualDiff(div, 'find');
  });

  it('sidebar', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    // Opened after loading, so that the pages fit the smaller width
    element.sidebarOpened = true;
    await nextRenderIdle(element);
    element.page = 2;
    await nextRenderIdle(element);
    // Wait for the visible thumbnails
    for (let i = 0; i < 100 && element.shadowRoot!.querySelectorAll('.thumbnail-image canvas').length < 3; i++) {
      await nextFrame();
    }
    await visualDiff(div, 'sidebar');
  });

  it('sidebar-narrow', async () => {
    div.style.width = '375px';
    element.src = fixtureUrl('multi-page.pdf');
    element.sidebarOpened = true;
    await nextRenderIdle(element);
    for (let i = 0; i < 100 && element.shadowRoot!.querySelectorAll('.thumbnail-image canvas').length < 2; i++) {
      await nextFrame();
    }
    await visualDiff(div, 'sidebar-narrow');
  });

  it('outline', async () => {
    element.src = fixtureUrl('outline.pdf');
    element.sidebarOpened = true;
    await nextRenderIdle(element);
    for (let i = 0; i < 50 && !element.querySelector('vaadin-pdf-viewer-button[slot="sidebar-header"]'); i++) {
      await nextFrame();
    }
    element.querySelectorAll<HTMLElement>('vaadin-pdf-viewer-button[slot="sidebar-header"]')[1].click();
    await nextRender();
    element.shadowRoot!.querySelector<HTMLElement>('[part="outline-toggle"]')!.click();
    await nextRender();
    element.shadowRoot!.querySelector<HTMLElement>('[role="treeitem"]')!.focus();
    await sendKeys({ press: 'ArrowDown' });
    await nextRender();
    await visualDiff(div, 'outline');
  });

  it('print-progress', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    // Show the progress without printing
    (element as any).__printProgress = 0.4;
    await nextRender();
    await visualDiff(div, 'print-progress');
  });

  it('rtl', async () => {
    div.setAttribute('dir', 'rtl');
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'rtl');
  });

  it('error', async () => {
    element.src = fixtureUrl('invalid.pdf');
    await oneEvent(element, 'document-error');
    await nextFrame();
    await visualDiff(div, 'error');
  });
});
