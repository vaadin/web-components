import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { loadPdfjs } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument } from './helpers.js';

const NativeWorker = window.Worker;

describe('pdfjs-loader', () => {
  let viewers: PdfViewer[];
  let terminateSpy: sinon.SinonSpy;

  beforeEach(async () => {
    const wrapper = fixtureSync<HTMLDivElement>(`
      <div>
        <vaadin-pdf-viewer></vaadin-pdf-viewer>
        <vaadin-pdf-viewer></vaadin-pdf-viewer>
      </div>
    `);
    viewers = [...wrapper.querySelectorAll('vaadin-pdf-viewer')];
    await nextRender();
    terminateSpy = sinon.spy(NativeWorker.prototype, 'terminate');
  });

  afterEach(async () => {
    // Each test starts without a worker, so wait until the worker of the test is gone.
    viewers.forEach((viewer) => viewer.remove());
    for (let i = 0; i < 100 && terminateSpy.notCalled; i++) {
      await nextFrame();
    }
    sinon.restore();
  });

  describe('shared worker', () => {
    let workerSpy: sinon.SinonSpy;

    beforeEach(() => {
      workerSpy = sinon.spy(window, 'Worker');
    });

    it('should share one worker between viewers', async () => {
      await Promise.all([loadDocument(viewers[0], 'links.pdf'), loadDocument(viewers[1], 'multi-page.pdf')]);
      expect(workerSpy).to.be.calledOnce;
    });

    it('should keep the worker while another viewer uses it', async () => {
      await Promise.all([loadDocument(viewers[0], 'links.pdf'), loadDocument(viewers[1], 'multi-page.pdf')]);
      viewers[0].remove();
      // The worker handles the release of the first document before this load.
      await loadDocument(viewers[1], 'standard-font.pdf');
      expect(terminateSpy).to.be.not.called;
      expect(workerSpy).to.be.calledOnce;
    });

    it('should terminate the worker after the last viewer releases its document', async () => {
      await Promise.all([loadDocument(viewers[0], 'links.pdf'), loadDocument(viewers[1], 'multi-page.pdf')]);
      viewers.forEach((viewer) => viewer.remove());
      for (let i = 0; i < 100 && terminateSpy.notCalled; i++) {
        await nextFrame();
      }
      expect(terminateSpy).to.be.calledOnce;
    });

    it('should not change the global worker options of pdf.js', async () => {
      await loadDocument(viewers[0], 'links.pdf');
      const { GlobalWorkerOptions } = await loadPdfjs();
      expect(GlobalWorkerOptions.workerSrc).to.equal('');
      expect(GlobalWorkerOptions.workerPort).to.be.null;
    });
  });

  it('should fire document-error event with network reason and warn once when the worker fails to load', async () => {
    const warnStub = sinon.stub(console, 'warn');
    // Loading the worker script fails, as when the Content Security Policy blocks it.
    sinon.stub(window, 'Worker').callsFake(function (_url: string | URL, options?: WorkerOptions) {
      return new NativeWorker(new URL('./missing-worker.js', import.meta.url), options);
    });
    const error = oneEvent(viewers[0], 'document-error');
    viewers[0].src = fixtureUrl('links.pdf');
    const event = (await error) as CustomEvent;
    expect(event.detail.reason).to.equal('network');
    expect(warnStub).to.be.calledOnce;
    expect(warnStub.firstCall.args[0]).to.include('worker-src');
  });
});
