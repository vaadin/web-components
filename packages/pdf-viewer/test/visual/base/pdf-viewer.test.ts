import { resetMouse, sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../enable-feature-flag.js';
import '@vaadin/button/src/vaadin-button.js';
import '../../../src/vaadin-pdf-viewer.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import type { PdfViewer } from '../../../src/vaadin-pdf-viewer.js';
import { createPdf, loadAndRender } from '../../helpers.js';

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

  afterEach(async () => {
    await resetMouse();
  });

  async function load() {
    await loadAndRender(viewer, createPdf(Array.from({ length: 6 }, () => ({ content: '' }))));
  }

  function addAction() {
    const button = document.createElement('vaadin-button');
    button.slot = 'toolbar-actions';
    button.textContent = 'Approve';
    viewer.appendChild(button);
  }

  it('empty', async () => {
    await visualDiff(div, 'empty');
  });

  it('document', async () => {
    await load();
    await visualDiff(div, 'document');
  });

  it('actions', async () => {
    addAction();
    await load();
    await visualDiff(div, 'actions');
  });

  it('actions wide', async () => {
    viewer.style.width = '900px';
    addAction();
    await load();
    await visualDiff(div, 'actions-wide');
  });

  it('narrow', async () => {
    viewer.style.width = '240px';
    addAction();
    await load();
    await visualDiff(div, 'narrow');
  });

  it('narrow RTL', async () => {
    viewer.setAttribute('dir', 'rtl');
    viewer.style.width = '240px';
    addAction();
    await load();
    await visualDiff(div, 'narrow-rtl');
  });

  it('large text', async () => {
    viewer.style.cssText = 'width: 200px; height: 200px; font-size: 32px';
    await load();
    await visualDiff(div, 'large-text');
  });

  it('page error', async () => {
    await load();
    const field = viewer.querySelector('vaadin-integer-field')!;
    field.focus();
    (field.inputElement as HTMLInputElement).select();
    await sendKeys({ type: '999' });
    await sendKeys({ press: 'Enter' });
    await nextFrame();
    await visualDiff(div, 'page-error');
  });

  it('content focus', async () => {
    await load();
    viewer.focus();
    await visualDiff(div, 'content-focus');
  });

  it('button focus', async () => {
    await load();
    viewer.querySelector('vaadin-integer-field')!.focus();
    await sendKeys({ press: 'Shift+Tab' });
    await visualDiff(div, 'button-focus');
  });
});
