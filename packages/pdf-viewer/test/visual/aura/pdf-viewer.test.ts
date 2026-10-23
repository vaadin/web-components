import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../enable-feature-flag.js';
import '../../../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../../../vaadin-pdf-viewer.js';
import { currentMatchShown, fixtureUrl, nextRenderIdle } from '../../helpers.js';

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

  it('page-error', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    const field = element.querySelector<HTMLElement & { inputElement: HTMLInputElement }>('vaadin-integer-field')!;
    field.focus();
    field.inputElement.select();
    await sendKeys({ type: '99' });
    await sendKeys({ press: 'Enter' });
    await nextRender();
    await visualDiff(div, 'page-error');
  });

  it('header', async () => {
    element.headerVisible = true;
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'header');
  });

  it('toolbar-collapsed', async () => {
    element.headerVisible = true;
    element.toolbarCollapsed = true;
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'toolbar-collapsed');
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

  it('rotated-text-selection', async () => {
    element.src = fixtureUrl('rotated.pdf');
    await nextRenderIdle(element);
    const textLayer = element.shadowRoot!.querySelector('.text-layer')!;
    const span = [...textLayer.querySelectorAll('span')].find((item) => item.textContent!.startsWith('Rotated'))!;
    const range = document.createRange();
    range.selectNodeContents(span);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    await visualDiff(div, 'rotated-text-selection');
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
    element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="download"]')!.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'content-focus');
  });

  it('download-button', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'download-button');
  });

  it('find', async () => {
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
    await nextRender();
    // Entered at once, as a search for each typed key can stop the scroll to the match short
    const input = element.querySelector<HTMLInputElement>('vaadin-text-field[slot="find"] > input')!;
    input.value = 'quick';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await currentMatchShown(element);
    await visualDiff(div, 'find');
  });

  describe('large text', () => {
    beforeEach(() => {
      // Like a larger default font size in the browser settings
      document.documentElement.style.fontSize = '32px';
      div.style.width = '320px';
    });

    afterEach(() => {
      document.documentElement.style.fontSize = '';
    });

    it('large-text-find', async () => {
      element.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(element);
      element.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="find"]')!.click();
      await nextRender();
      // Entered at once, as a search for each typed key can stop the scroll to the match short
      const input = element.querySelector<HTMLInputElement>('vaadin-text-field[slot="find"] > input')!;
      input.value = 'quick';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await currentMatchShown(element);
      await visualDiff(div, 'large-text-find');
    });
  });

  it('wide', async () => {
    div.style.width = '900px';
    element.src = fixtureUrl('multi-page.pdf');
    await nextRenderIdle(element);
    await visualDiff(div, 'wide');
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
