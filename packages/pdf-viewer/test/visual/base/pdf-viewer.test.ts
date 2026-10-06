import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
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

  it('error', async () => {
    element.src = fixtureUrl('invalid.pdf');
    await oneEvent(element, 'document-error');
    await nextFrame();
    await visualDiff(div, 'error');
  });
});
