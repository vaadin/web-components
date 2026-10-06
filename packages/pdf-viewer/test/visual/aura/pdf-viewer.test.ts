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
