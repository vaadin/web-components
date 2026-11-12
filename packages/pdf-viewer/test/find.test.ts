import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { createPageText, findInText, normalizeText } from '../src/pdf-viewer-find.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  createPdfUrl,
  failTextOnce,
  fixtureUrl,
  getPdfPagePrototype,
  loadAndRender,
  loadDocument,
  nextRenderIdle,
} from './helpers.js';

describe('find', () => {
  describe('text helpers', () => {
    const pageText = createPageText([
      { str: 'The Quick', hasEOL: true },
      { type: 'beginMarkedContent' } as any,
      { str: 'brown  fox' },
      { str: 'café ﬁsh' },
    ]);

    function find(query: string) {
      return findInText(normalizeText(pageText.text), query).map(({ start, end }) => pageText.text.slice(start, end));
    }

    it('should join the items with line breaks after lines', () => {
      expect(pageText.text).to.equal('The Quick\nbrown  foxcafé ﬁsh');
    });

    it('should ignore case', () => {
      expect(find('quick')).to.deep.equal(['Quick']);
    });

    it('should ignore white space differences and line breaks', () => {
      expect(find('quick brown fox')).to.deep.equal(['Quick\nbrown  fox']);
    });

    it('should ignore diacritics', () => {
      expect(find('cafe')).to.deep.equal(['café']);
    });

    it('should split ligatures', () => {
      expect(find('fish')).to.deep.equal(['ﬁsh']);
    });

    it('should normalize the query like the text', () => {
      expect(find('CAFÉ')).to.deep.equal(['café']);
      expect(find('ﬁsh')).to.deep.equal(['ﬁsh']);
      expect(find('quick   brown')).to.deep.equal(['Quick\nbrown']);
    });

    it('should not ignore the marks that make another letter in other scripts', () => {
      // Japanese voiced kana, and a Devanagari vowel sign
      expect(findInText(normalizeText('がく'), 'かく')).to.be.empty;
      expect(findInText(normalizeText('किताब'), 'कताब')).to.be.empty;
      expect(findInText(normalizeText('がく'), 'がく')).to.have.lengthOf(1);
    });

    it('should find nothing for an empty query', () => {
      expect(find('   ')).to.be.empty;
    });
  });

  describe('viewer', () => {
    let viewer: PdfViewer;

    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
      await nextRender();
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    });

    afterEach(() => {
      sinon.restore();
    });

    describe('find()', () => {
      it('should fire find-result with the text and the number of matches', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('unique word');
        const event = await result;
        expect(event.detail).to.deep.equal({ query: 'unique word', matchCount: 5 });
      });

      it('should fire find-result without matches', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('nonexistent');
        const event = await result;
        expect(event.detail).to.deep.equal({ query: 'nonexistent', matchCount: 0 });
      });

      it('should fire find-result without matches for blank text', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('   ');
        const event = await result;
        expect(event.detail).to.deep.equal({ query: '   ', matchCount: 0 });
      });

      it('should find matches on all pages, including pages not rendered yet', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('quick brown fox');
        const event = await result;
        expect(event.detail.matchCount).to.equal(6);
      });

      it('should find matches when streams are not async iterable', async () => {
        // Safari 26 and earlier cannot iterate a ReadableStream with `for await`.
        const descriptor = Object.getOwnPropertyDescriptor(ReadableStream.prototype, Symbol.asyncIterator);
        delete (ReadableStream.prototype as Partial<ReadableStream>)[Symbol.asyncIterator];
        try {
          const result = oneEvent(viewer, 'find-result');
          viewer.find('unique word');
          expect((await result).detail.matchCount).to.equal(5);
        } finally {
          if (descriptor) {
            Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, descriptor);
          }
        }
      });

      it('should run only the last of two find() calls in a row', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.find('marker1');
        viewer.find('marker2');
        await oneEvent(viewer, 'find-result');
        await nextFrame();
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].detail.query).to.equal('marker2');
      });

      it('should find matches on pages after the first ten', async () => {
        await loadAndRender(viewer, createPdfUrl(12));
        const result = oneEvent(viewer, 'find-result');
        viewer.find('Page 12');
        expect((await result).detail.matchCount).to.equal(1);
      });

      it('should find once the document has loaded when called while it loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        viewer.find('internal link');
        const event = await oneEvent(viewer, 'find-result');
        expect(event.detail).to.deep.equal({ query: 'internal link', matchCount: 1 });
      });

      it('should do nothing when not attached', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        const parent = viewer.parentElement!;
        viewer.remove();
        viewer.find('marker1');
        // The viewer releases the document when it stays detached
        await nextFrame();
        const idle = nextRenderIdle(viewer);
        parent.appendChild(viewer);
        await idle;
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should do nothing without src', async () => {
        viewer.src = '';
        await nextUpdate(viewer);
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.find('marker1');
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should do nothing when the document could not be loaded', async () => {
        viewer.src = fixtureUrl('invalid.pdf');
        await oneEvent(viewer, 'document-error');
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.find('marker1');
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should search the new document when called after src changes', async () => {
        viewer.find('marker1');
        await oneEvent(viewer, 'find-result');
        await loadDocument(viewer, 'links.pdf');
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker1');
        const event = await result;
        expect(event.detail.matchCount).to.equal(0);
      });

      it('should load the text of a page again after it failed to load', async () => {
        clearWarnings();
        const warn = sinon.stub(console, 'warn');
        await failTextOnce(5, 'Read failed');
        let result = oneEvent(viewer, 'find-result');
        viewer.find('marker5');
        expect((await result).detail.matchCount).to.equal(0);
        expect(warn).to.be.calledWithMatch(/load the text of page 5/u);
        result = oneEvent(viewer, 'find-result');
        viewer.find('marker5');
        expect((await result).detail.matchCount).to.equal(1);
      });
    });

    describe('detached', () => {
      let spy: sinon.SinonSpy;

      beforeEach(() => {
        spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
      });

      it('should not run find() called while detached once the document loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        await nextUpdate(viewer);
        const parent = viewer.parentElement!;
        viewer.remove();
        viewer.find('internal link');
        // Attached again in the same task, so that the viewer keeps loading the document
        parent.appendChild(viewer);
        await nextRenderIdle(viewer);
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should not run find() when detached as the document loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        viewer.find('internal link');
        const parent = viewer.parentElement!;
        await new Promise((resolve) => {
          viewer.addEventListener('document-load', () => resolve(viewer.remove()), { once: true });
        });
        await nextFrame();
        const idle = nextRenderIdle(viewer);
        parent.appendChild(viewer);
        await idle;
        await nextFrame();
        expect(spy).to.be.not.called;
      });
    });

    describe('text of a previous document', () => {
      let settle: { resolve(value: unknown): void; reject(error: Error): void } | undefined;
      let url: string;

      beforeEach(async () => {
        // A document with the query on its last page, which the current document has not rendered.
        url = createPdf([
          { content: 'BT /F1 24 Tf 72 700 Td (First page) Tj ET' },
          { content: 'BT /F1 24 Tf 72 700 Td (Second page) Tj ET' },
          { content: 'BT /F1 24 Tf 72 700 Td (Third page) Tj ET' },
          { content: 'BT /F1 24 Tf 72 700 Td (Fourth page with the needle) Tj ET' },
        ]);
        // Delay the text of the fourth page of the current document until settled.
        settle = undefined;
        let held!: () => void;
        const textHeld = new Promise<void>((resolve) => {
          held = resolve;
        });
        const prototype = await getPdfPagePrototype();
        const streamTextContent = prototype.streamTextContent;
        function fakeStreamTextContent(this: PDFPageProxy, ...args: Parameters<PDFPageProxy['streamTextContent']>) {
          if (this.pageNumber === 4 && !settle) {
            return new ReadableStream({
              start(controller) {
                settle = {
                  resolve(value) {
                    controller.enqueue(value);
                    controller.close();
                  },
                  reject(error) {
                    controller.error(error);
                  },
                };
                held();
              },
            });
          }
          return streamTextContent.apply(this, args);
        }
        sinon.stub(prototype, 'streamTextContent').callsFake(fakeStreamTextContent);
        viewer.find('the needle');
        await textHeld;
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        const result = oneEvent(viewer, 'find-result');
        viewer.find('the needle');
        const event = await result;
        expect(event.detail.matchCount).to.equal(1);
      });

      afterEach(() => {
        URL.revokeObjectURL(url);
      });

      it('should not mix text that arrives late with the text of the new document', async () => {
        settle!.resolve({ items: [{ str: 'x'.repeat(500) }, { str: 'y' }] });
        await nextFrame();
        let result = oneEvent(viewer, 'find-result');
        viewer.find('xxx');
        expect((await result).detail.matchCount).to.equal(0);
        result = oneEvent(viewer, 'find-result');
        viewer.find('the needle');
        expect((await result).detail.matchCount).to.equal(1);
      });

      it('should ignore text of the previous document that fails to load', async () => {
        clearWarnings();
        const stub = sinon.stub(console, 'warn');
        settle!.reject(new Error('Worker was destroyed'));
        const result = oneEvent(viewer, 'find-result');
        viewer.find('the needle');
        expect((await result).detail.matchCount).to.equal(1);
        expect(stub).to.not.be.calledWithMatch(/text of page/u);
      });
    });
  });
});
