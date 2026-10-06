import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument } from './helpers.js';

describe('download and print', () => {
  let viewer: PdfViewer;

  function getButton(icon: string) {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>(`vaadin-pdf-viewer-button[icon="${icon}"]`)!;
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  it('should disable the buttons without document', () => {
    expect(getButton('download').disabled).to.be.true;
    expect(getButton('print').disabled).to.be.true;
  });

  describe('download', () => {
    let clickStub: sinon.SinonStub;
    let link: HTMLAnchorElement | undefined;

    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      link = undefined;
      clickStub = sinon.stub(HTMLAnchorElement.prototype, 'click');
      clickStub.callsFake(() => {
        link = clickStub.lastCall.thisValue;
      });
    });

    afterEach(() => {
      clickStub.restore();
    });

    async function download() {
      getButton('download').click();
      for (let i = 0; i < 50 && !link; i++) {
        await nextFrame();
      }
      return link!;
    }

    it('should download the original file', async () => {
      const link = await download();
      const [downloaded, original] = await Promise.all([
        fetch(link.href).then((response) => response.arrayBuffer()),
        fetch(fixtureUrl('multi-page.pdf')).then((response) => response.arrayBuffer()),
      ]);
      expect(new Uint8Array(downloaded)).to.deep.equal(new Uint8Array(original));
    });

    it('should use the file name of the URL', async () => {
      const link = await download();
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should use the title for a blob URL', async () => {
      const blob = await fetch(fixtureUrl('multi-page.pdf')).then((response) => response.blob());
      const url = URL.createObjectURL(blob);
      try {
        const loaded = new Promise((resolve) => {
          viewer.addEventListener('document-load', resolve, { once: true });
        });
        viewer.src = url;
        await loaded;
        const link = await download();
        expect(link.download).to.equal('Multi-page fixture.pdf');
      } finally {
        URL.revokeObjectURL(url);
      }
    });

    it('should decode the file name and ignore the query string', async () => {
      const original = viewer.src;
      viewer.src = `${original!.replace('multi-page.pdf', 'multi%2Dpage.pdf')}?version=2`;
      await new Promise((resolve) => {
        viewer.addEventListener('document-load', resolve, { once: true });
      });
      const link = await download();
      expect(link.download).to.equal('multi-page.pdf');
    });

    it('should use the file name set with fileName', async () => {
      viewer.fileName = 'report.pdf';
      const link = await download();
      expect(link.download).to.equal('report.pdf');
    });
  });

  describe('print', () => {
    let printStub: sinon.SinonStub | undefined;
    let observer: MutationObserver;

    function getFrame() {
      return document.body.querySelector<HTMLIFrameElement>(':scope > iframe');
    }

    function getProgress() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="print-progress"]')!;
    }

    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      printStub = undefined;
      // Replace the print dialog of the print frame as soon as it is added.
      observer = new MutationObserver(() => {
        const frame = getFrame();
        if (frame && !printStub) {
          printStub = sinon.stub(frame.contentWindow!, 'print');
        }
      });
      observer.observe(document.body, { childList: true });
    });

    afterEach(() => {
      observer.disconnect();
      getFrame()?.remove();
    });

    async function waitForPrint() {
      for (let i = 0; i < 200 && !(printStub && printStub.called); i++) {
        await nextFrame();
      }
    }

    it('should print every page at the size of the page', async () => {
      viewer.print();
      await waitForPrint();
      expect(printStub).to.be.calledOnce;
      const images = [...getFrame()!.contentDocument!.images];
      expect(images).to.have.lengthOf(6);
      expect(parseFloat(images[0].style.width)).to.be.closeTo(595.92, 0.01);
      expect(parseFloat(images[5].style.width)).to.be.closeTo(842.88, 0.01);
    });

    it('should show the progress while preparing to print', async () => {
      viewer.print();
      await nextRender();
      expect(getProgress().hidden).to.be.false;
      await waitForPrint();
      await nextRender();
      expect(getProgress().hidden).to.be.true;
    });

    it('should remove the print frame after printing', async () => {
      viewer.print();
      await waitForPrint();
      getFrame()!.contentWindow!.dispatchEvent(new Event('afterprint'));
      expect(getFrame()).to.be.null;
    });

    it('should cancel printing with the cancel button', async () => {
      viewer.print();
      await nextRender();
      viewer.querySelector<HTMLElement>('vaadin-button[slot="print-progress"]')!.click();
      await nextRender();
      expect(getFrame()).to.be.null;
      expect(getProgress().hidden).to.be.true;
      await nextFrame();
      expect(printStub?.called).to.not.be.true;
    });

    it('should remove the frame of a previous print when printing again', async () => {
      viewer.print();
      await waitForPrint();
      const firstFrame = getFrame()!;
      printStub = undefined;
      viewer.print();
      await nextFrame();
      expect(firstFrame.isConnected).to.be.false;
      await waitForPrint();
    });

    it('should release the prepared pages when cancelled', async () => {
      const revokeSpy = sinon.spy(URL, 'revokeObjectURL');
      try {
        viewer.print();
        // Wait for the first page
        for (
          let i = 0;
          i < 100 &&
          viewer.shadowRoot!.querySelector('[part="print-progress"]') &&
          !getFrame()?.contentDocument!.images.length;
          i++
        ) {
          await nextFrame();
        }
        const created = getFrame()!.contentDocument!.images.length;
        viewer.querySelector<HTMLElement>('vaadin-button[slot="print-progress"]')!.click();
        await nextFrame();
        await nextFrame();
        expect(revokeSpy.callCount).to.be.at.least(created);
        expect(getFrame()).to.be.null;
      } finally {
        revokeSpy.restore();
      }
    });

    it('should disable the print button while preparing to print', async () => {
      viewer.print();
      await nextRender();
      expect(getButton('print').disabled).to.be.true;
      await waitForPrint();
      await nextRender();
      expect(getButton('print').disabled).to.be.false;
    });

    it('should move focus to the cancel button and back when printing from the print button', async () => {
      getButton('print').focus();
      getButton('print').click();
      await nextRender();
      const cancel = viewer.querySelector<HTMLElement>('vaadin-button[slot="print-progress"]')!;
      expect(document.activeElement).to.equal(cancel);
      cancel.click();
      await nextRender();
      await nextRender();
      expect(document.activeElement).to.equal(getButton('print'));
    });

    it('should cancel printing with Escape', async () => {
      getButton('print').focus();
      getButton('print').click();
      await nextRender();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(getFrame()).to.be.null;
      expect(getProgress().hidden).to.be.true;
    });

    it('should not print when not attached', async () => {
      viewer.remove();
      await viewer.print();
      expect(getFrame()).to.be.null;
    });
  });
});
