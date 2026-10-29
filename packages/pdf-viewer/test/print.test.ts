import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, fixtureUrl, getPdfDocumentPrototype, holdPages, loadDocument } from './helpers.js';

describe('print', () => {
  let viewer: PdfViewer;
  let observer: MutationObserver;
  /** Called with the print frame instead of opening the print dialog. */
  let printSpy: sinon.SinonSpy;
  let release: (() => void) | undefined;

  function getButton() {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>('vaadin-pdf-viewer-button[icon="print"]');
  }

  function getFrame() {
    return document.body.querySelector<HTMLIFrameElement>(':scope > iframe');
  }

  function getImages() {
    return [...getFrame()!.contentDocument!.images];
  }

  function getProgress() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="print-progress"]')!;
  }

  function getProgressBar() {
    return viewer.querySelector<HTMLElement & { value: number }>('vaadin-progress-bar[slot="print-progress"]');
  }

  function getCancelButton() {
    return viewer.querySelector<HTMLElement>('vaadin-button[slot="print-progress"]');
  }

  /** Returns the width and height in points of the `@page` rule of a printed page. */
  function getPageSize(image: HTMLImageElement) {
    const frameWindow = getFrame()!.contentWindow as typeof window;
    const [styleSheet] = frameWindow.document.adoptedStyleSheets;
    const rule = [...styleSheet.cssRules].find(
      (rule) => rule instanceof frameWindow.CSSPageRule && rule.selectorText === image.style.getPropertyValue('page'),
    ) as CSSPageRule;
    return rule.style.getPropertyValue('size').split(' ').map(parseFloat);
  }

  /** Waits until the given number of pages is prepared for printing. */
  async function pagesPrepared(count: number) {
    for (let i = 0; i < 100 && !(getFrame() && getImages().length >= count); i++) {
      await nextFrame();
    }
  }

  beforeEach(async () => {
    printSpy = sinon.spy();
    // Replace the print dialog of each print frame as soon as the frame is added.
    observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            sinon.stub(node.contentWindow!, 'print').callsFake(() => printSpy(node));
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  afterEach(() => {
    release?.();
    release = undefined;
    observer.disconnect();
    sinon.restore();
  });

  describe('button', () => {
    it('should disable the button without document', () => {
      expect(getButton()!.disabled).to.be.true;
    });

    it('should enable the button when the document has loaded', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
      expect(getButton()!.disabled).to.be.false;
    });

    it('should show the button after the download button', () => {
      const download = viewer.querySelector('vaadin-pdf-viewer-button[icon="download"]')!;
      expect(download.getBoundingClientRect().right).to.be.at.most(getButton()!.getBoundingClientRect().left);
    });

    it('should use i18n for the tooltip', async () => {
      const getTooltipText = () => getButton()!.querySelector<Tooltip>('vaadin-tooltip')!.text;
      expect(getTooltipText()).to.equal('Print');
      viewer.i18n = { print: 'Tulosta' };
      await nextUpdate(viewer);
      expect(getTooltipText()).to.equal('Tulosta');
    });

    it('should toggle the button on printButtonHidden change', async () => {
      viewer.printButtonHidden = true;
      await nextUpdate(viewer);
      expect(getButton()!.checkVisibility()).to.be.false;
      viewer.printButtonHidden = false;
      await nextUpdate(viewer);
      expect(getButton()!.checkVisibility()).to.be.true;
    });

    it('should hide the button with the attribute', async () => {
      viewer.setAttribute('print-button-hidden', '');
      await nextUpdate(viewer);
      expect(viewer.printButtonHidden).to.be.true;
      expect(getButton()!.checkVisibility()).to.be.false;
    });
  });

  describe('with document', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextUpdate(viewer);
    });

    it('should print every page at the size of the page', async () => {
      await viewer.print();
      expect(printSpy).to.be.calledOnceWith(getFrame());
      const images = getImages();
      expect(images).to.have.lengthOf(6);
      expect(parseFloat(images[0].style.width)).to.be.closeTo(595.92, 0.01);
      expect(parseFloat(images[0].style.height)).to.be.closeTo(842.88, 0.01);
      expect(parseFloat(images[5].style.width)).to.be.closeTo(842.88, 0.01);
      const [width, height] = getPageSize(images[0]);
      expect(width).to.be.closeTo(595.92, 0.01);
      expect(height).to.be.closeTo(842.88, 0.01);
      const [landscapeWidth, landscapeHeight] = getPageSize(images[5]);
      expect(landscapeWidth).to.be.closeTo(842.88, 0.01);
      expect(landscapeHeight).to.be.closeTo(595.92, 0.01);
    });

    it('should use one named page for each page size', async () => {
      await viewer.print();
      const names = new Set(getImages().map((image) => image.style.getPropertyValue('page')));
      expect(names.size).to.equal(2);
    });

    it('should print the pages at 150 DPI', async () => {
      await viewer.print();
      const [image] = getImages();
      expect(image.naturalWidth).to.equal(Math.floor((595.92 * 150) / 72));
      expect(image.naturalHeight).to.equal(Math.floor((842.88 * 150) / 72));
    });

    it('should print a large page at a lower resolution', async () => {
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = createPdf([{ content: 'BT /F1 48 Tf 72 700 Td (Large) Tj ET', mediaBox: [0, 0, 5000, 5000] }]);
      await loaded;
      await viewer.print();
      const [image] = getImages();
      expect(image.style.width).to.equal('5000pt');
      expect(image.naturalWidth * image.naturalHeight).to.be.at.most(2 ** 24);
      expect(image.naturalWidth).to.be.closeTo(4096, 1);
    });

    it('should print the annotations that are printed, not the ones that are viewed', async () => {
      const loaded = oneEvent(viewer, 'document-load');
      // Red squares, the first one is printed but not viewed, the second one viewed but not printed.
      viewer.src = createPdf([
        {
          content: 'BT /F1 12 Tf 72 72 Td (Annotations) Tj ET',
          annotations: [
            '<< /Type /Annot /Subtype /Square /Rect [100 600 300 800] /C [1 0 0] /IC [1 0 0] /F 36 >>',
            '<< /Type /Annot /Subtype /Square /Rect [300 100 500 300] /C [1 0 0] /IC [1 0 0] /F 0 >>',
          ],
        },
      ]);
      await loaded;
      await viewer.print();
      const [image] = getImages();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const scale = 150 / 72;
      const getPixel = (x: number, y: number) => [
        ...context.getImageData(Math.round(x * scale), Math.round((842 - y) * scale), 1, 1).data,
      ];
      expect(getPixel(200, 700)).to.deep.equal([255, 0, 0, 255]);
      expect(getPixel(400, 200)).to.deep.equal([255, 255, 255, 255]);
    });

    it('should print on button click', async () => {
      getButton()!.click();
      await pagesPrepared(6);
      for (let i = 0; i < 50 && !printSpy.called; i++) {
        await nextFrame();
      }
      expect(printSpy).to.be.calledOnce;
    });

    describe('custom button', () => {
      let button: HTMLButtonElement;

      beforeEach(async () => {
        button = document.createElement('button');
        button.slot = 'print-button';
        button.textContent = 'Print';
        viewer.appendChild(button);
        await nextFrame();
      });

      it('should replace the default button', () => {
        expect(getButton()).to.be.null;
        expect(button.checkVisibility()).to.be.true;
      });

      it('should print on custom button click', async () => {
        button.click();
        await pagesPrepared(6);
        for (let i = 0; i < 50 && !printSpy.called; i++) {
          await nextFrame();
        }
        expect(printSpy).to.be.calledOnce;
      });

      it('should not disable the custom button while preparing to print', async () => {
        const printed = viewer.print();
        await nextUpdate(viewer);
        expect(getProgress().hidden).to.be.false;
        expect(button.disabled).to.be.false;
        await printed;
      });
    });

    it('should print with print() while the button is hidden', async () => {
      viewer.printButtonHidden = true;
      await nextUpdate(viewer);
      await viewer.print();
      expect(printSpy).to.be.calledOnce;
    });

    it('should not request the document again', async () => {
      const url = fixtureUrl('links.pdf');
      performance.clearResourceTimings();
      await loadDocument(viewer, 'links.pdf');
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
      await viewer.print();
      expect(printSpy).to.be.calledOnce;
      expect(performance.getEntriesByName(url)).to.have.lengthOf(1);
    });

    it('should show the progress while preparing to print', async () => {
      const printed = viewer.print();
      await nextUpdate(viewer);
      expect(getProgress().hidden).to.be.false;
      await printed;
      expect(getProgress().hidden).to.be.true;
      expect(getProgressBar()).to.be.null;
    });

    it('should show the part of the pages that are prepared', async () => {
      release = await holdPages(3);
      viewer.print();
      await pagesPrepared(2);
      await nextUpdate(viewer);
      expect(getProgressBar()!.value).to.equal(2 / 6);
    });

    it('should use i18n for the progress', async () => {
      viewer.i18n = { printing: 'Valmistellaan', cancelPrint: 'Peruuta' };
      release = await holdPages(1);
      viewer.print();
      await nextUpdate(viewer);
      expect(getProgress().textContent!.trim()).to.equal('Valmistellaan');
      expect(getProgressBar()!.getAttribute('aria-label')).to.equal('Valmistellaan');
      expect(getCancelButton()!.textContent!.trim()).to.equal('Peruuta');
    });

    it('should disable the print button while preparing to print', async () => {
      const printed = viewer.print();
      await nextUpdate(viewer);
      expect(getButton()!.disabled).to.be.true;
      await printed;
      expect(getButton()!.disabled).to.be.false;
    });

    it('should not print again while preparing to print', async () => {
      const printed = viewer.print();
      await viewer.print();
      expect(printSpy).to.be.not.called;
      await printed;
      expect(printSpy).to.be.calledOnce;
    });

    it('should remove the print frame after printing', async () => {
      await viewer.print();
      getFrame()!.contentWindow!.dispatchEvent(new Event('afterprint'));
      expect(getFrame()).to.be.null;
    });

    it('should remove the frame of a previous print when printing again', async () => {
      await viewer.print();
      const firstFrame = getFrame()!;
      const printed = viewer.print();
      await nextUpdate(viewer);
      expect(firstFrame.isConnected).to.be.false;
      await printed;
      expect(printSpy).to.be.calledTwice;
      expect(getFrame()).to.be.ok;
    });

    it('should remove the frame of the last print when detached', async () => {
      await viewer.print();
      viewer.remove();
      expect(getFrame()).to.be.null;
    });

    it('should remove the frame of the last print when another document loads', async () => {
      await viewer.print();
      await loadDocument(viewer, 'links.pdf');
      expect(getFrame()).to.be.null;
    });

    it('should cancel printing with the cancel button', async () => {
      release = await holdPages(3);
      const printed = viewer.print();
      await nextUpdate(viewer);
      getCancelButton()!.click();
      await nextUpdate(viewer);
      expect(getFrame()).to.be.null;
      expect(getProgress().hidden).to.be.true;
      release();
      await printed;
      expect(printSpy).to.be.not.called;
    });

    it('should release the prepared pages when cancelled', async () => {
      release = await holdPages(3);
      const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
      viewer.print();
      await pagesPrepared(2);
      const urls = getImages().map((image) => image.src);
      getCancelButton()!.click();
      expect(revokeSpy).to.be.calledTwice;
      expect(revokeSpy.args.flat()).to.have.members(urls);
    });

    it('should cancel printing with Escape', async () => {
      release = await holdPages(3);
      getButton()!.focus();
      getButton()!.click();
      await nextUpdate(viewer);
      await sendKeys({ press: 'Escape' });
      await nextUpdate(viewer);
      expect(getFrame()).to.be.null;
      expect(getProgress().hidden).to.be.true;
    });

    it('should prevent the default of the Escape that cancels printing', async () => {
      release = await holdPages(3);
      viewer.print();
      await nextUpdate(viewer);
      getCancelButton()!.focus();
      const spy = sinon.spy();
      const onKeyDown = (event: KeyboardEvent) => spy(event.defaultPrevented);
      document.addEventListener('keydown', onKeyDown);
      await sendKeys({ press: 'Escape' });
      document.removeEventListener('keydown', onKeyDown);
      expect(spy.lastCall.args[0]).to.be.true;
    });

    it('should not prevent the default of Escape while not printing', async () => {
      await viewer.print();
      viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.focus();
      const spy = sinon.spy();
      const onKeyDown = (event: KeyboardEvent) => spy(event.defaultPrevented);
      document.addEventListener('keydown', onKeyDown);
      await sendKeys({ press: 'Escape' });
      document.removeEventListener('keydown', onKeyDown);
      expect(spy.lastCall.args[0]).to.be.false;
    });

    it('should not cancel printing on Escape that is handled already', async () => {
      release = await holdPages(3);
      viewer.print();
      await nextUpdate(viewer);
      getCancelButton()!.addEventListener('keydown', (event) => event.preventDefault());
      getCancelButton()!.focus();
      await sendKeys({ press: 'Escape' });
      await nextUpdate(viewer);
      expect(getProgress().hidden).to.be.false;
    });

    it('should cancel printing when detached', async () => {
      release = await holdPages(3);
      const printed = viewer.print();
      await pagesPrepared(2);
      viewer.remove();
      expect(getFrame()).to.be.null;
      release();
      await printed;
      expect(printSpy).to.be.not.called;
    });

    it('should cancel printing when another document loads', async () => {
      release = await holdPages(3);
      const printed = viewer.print();
      await pagesPrepared(2);
      viewer.src = fixtureUrl('links.pdf');
      await oneEvent(viewer, 'document-load');
      expect(getFrame()).to.be.null;
      release();
      await printed;
      expect(printSpy).to.be.not.called;
    });

    it('should warn and stop when a page cannot be printed', async () => {
      const warnStub = sinon.stub(console, 'warn');
      sinon.stub(await getPdfDocumentPrototype(), 'getPage').rejects(new Error('Broken page'));
      await viewer.print();
      expect(warnStub).to.be.calledOnceWith('Failed to print the PDF document: Broken page');
      expect(printSpy).to.be.not.called;
      expect(getFrame()).to.be.null;
      await nextUpdate(viewer);
      expect(getProgress().hidden).to.be.true;
    });

    describe('focus', () => {
      it('should move focus to the cancel button and back when printing from the print button', async () => {
        release = await holdPages(3);
        getButton()!.focus();
        getButton()!.click();
        await nextUpdate(viewer);
        expect(document.activeElement).to.equal(getCancelButton());
        getCancelButton()!.click();
        await nextUpdate(viewer);
        expect(document.activeElement).to.equal(getButton());
      });

      it('should return focus to the print button after printing', async () => {
        getButton()!.focus();
        await viewer.print();
        expect(document.activeElement).to.equal(getButton());
      });

      it('should return focus to the pages when the print button was hidden meanwhile', async () => {
        release = await holdPages(3);
        getButton()!.focus();
        getButton()!.click();
        await nextUpdate(viewer);
        viewer.printButtonHidden = true;
        await sendKeys({ press: 'Escape' });
        await nextUpdate(viewer);
        expect(viewer.shadowRoot!.activeElement).to.equal(viewer.shadowRoot!.querySelector('[part="content"]'));
      });

      it('should keep focus on an element outside the viewer when printing from it', async () => {
        const button = document.createElement('button');
        document.body.append(button);
        try {
          button.focus();
          await viewer.print();
          expect(document.activeElement).to.equal(button);
        } finally {
          button.remove();
        }
      });
    });
  });

  describe('before load', () => {
    it('should print the document once loaded when called in the same task as setting src', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await viewer.print();
      expect(printSpy).to.be.calledOnce;
      expect(getImages()).to.have.lengthOf(6);
    });

    it('should print the document once loaded when called while it loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      // The update that starts loading
      await nextUpdate(viewer);
      await viewer.print();
      expect(printSpy).to.be.calledOnce;
    });

    it('should print once when called twice while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await Promise.all([viewer.print(), viewer.print()]);
      expect(printSpy).to.be.calledOnce;
    });

    it('should resolve without printing without src', async () => {
      await viewer.print();
      expect(getFrame()).to.be.null;
    });

    it('should resolve without printing when the document could not be loaded', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await viewer.print();
      expect(getFrame()).to.be.null;
    });

    it('should resolve without printing when detached while loading', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextUpdate(viewer);
      const printed = viewer.print();
      viewer.remove();
      await printed;
      expect(getFrame()).to.be.null;
    });

    it('should resolve without printing when detached as the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      const printed = viewer.print();
      viewer.addEventListener('document-load', () => viewer.remove(), { once: true });
      await printed;
      expect(getFrame()).to.be.null;
      expect(printSpy).to.be.not.called;
    });

    it('should do nothing when not attached', async () => {
      viewer.remove();
      await viewer.print();
      expect(getFrame()).to.be.null;
    });

    it('should not print once attached again when called while not attached', async () => {
      const parent = viewer.parentElement!;
      viewer.remove();
      viewer.src = fixtureUrl('multi-page.pdf');
      await viewer.print();
      const loaded = oneEvent(viewer, 'document-load');
      parent.appendChild(viewer);
      await loaded;
      await nextUpdate(viewer);
      expect(getFrame()).to.be.null;
      expect(getProgress().hidden).to.be.true;
    });
  });
});
