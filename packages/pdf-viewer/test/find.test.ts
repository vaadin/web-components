import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { createPageText, findInText, getMatchParts, normalizeText } from '../src/pdf-viewer-find.js';
import { loadPdfjs } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  currentMatchShown,
  fixtureUrl,
  getPdfPagePrototype,
  loadAndRender,
  loadDocument,
  nextRenderIdle,
  scrollSettled,
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

    it('should find nothing for an empty query', () => {
      expect(find('   ')).to.be.empty;
    });

    it('should return the parts of the items that a match covers', () => {
      const [match] = findInText(normalizeText(pageText.text), 'quick brown');
      expect(getMatchParts(pageText, match)).to.deep.equal([
        { itemIndex: 0, start: 4, end: 9 },
        { itemIndex: 1, start: 0, end: 5 },
      ]);
    });
  });

  describe('viewer', () => {
    let viewer: PdfViewer;

    function getContent() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    }

    function getMatches(pageNumber?: number) {
      const root = pageNumber
        ? viewer.shadowRoot!.querySelectorAll('[part~="page"]')[pageNumber - 1]
        : viewer.shadowRoot!;
      return [...root.querySelectorAll<HTMLElement>('.find-match')];
    }

    function getCurrentMatch() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('.find-match.current');
    }

    /** Returns the text layer span that contains the given text. */
    function getTextSpan(text: string) {
      return [...viewer.shadowRoot!.querySelectorAll('.text-layer span')].find((element) =>
        element.textContent!.includes(text),
      )!;
    }

    /** Returns the rectangle of the given text in the text layer. */
    function getTextRect(text: string) {
      const textNode = getTextSpan(text).firstChild as Text;
      const start = textNode.data.indexOf(text);
      const range = document.createRange();
      range.setStart(textNode, start);
      range.setEnd(textNode, start + text.length);
      return range.getBoundingClientRect();
    }

    function expectInView(element: HTMLElement) {
      const rect = element.getBoundingClientRect();
      const content = getContent().getBoundingClientRect();
      expect(rect.top).to.be.greaterThan(content.top);
      expect(rect.bottom).to.be.lessThan(content.bottom);
    }

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

      it('should fire find-result without matches and remove the highlights for blank text', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        const result = oneEvent(viewer, 'find-result');
        viewer.find('   ');
        const event = await result;
        expect(event.detail).to.deep.equal({ query: '   ', matchCount: 0 });
        expect(getMatches()).to.be.empty;
      });

      it('should find matches on all pages, including pages not rendered yet', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('quick brown fox');
        const event = await result;
        expect(event.detail.matchCount).to.equal(6);
      });

      it('should highlight the matches on rendered pages', async () => {
        viewer.find('quick');
        await currentMatchShown(viewer);
        expect(getMatches(1)).to.have.lengthOf(2);
      });

      it('should place the highlight over the matching text', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        const highlight = getCurrentMatch()!.getBoundingClientRect();
        const text = getTextRect('marker1');
        expect(highlight.left).to.be.closeTo(text.left, 1);
        expect(highlight.right).to.be.closeTo(text.right, 1);
        expect(highlight.top).to.be.closeTo(text.top, 1);
        expect(highlight.bottom).to.be.closeTo(text.bottom, 1);
      });

      it('should mark the first match as current', async () => {
        viewer.find('quick');
        await currentMatchShown(viewer);
        expect(viewer.shadowRoot!.querySelectorAll('.find-match.current')).to.have.lengthOf(1);
        expect(getCurrentMatch()).to.equal(getMatches(1)[0]);
      });

      it('should scroll to the first match of the document', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        const result = oneEvent(viewer, 'find-result');
        viewer.find('unique word');
        await result;
        await currentMatchShown(viewer, 1);
        expect(viewer.page).to.equal(1);
        expectInView(getCurrentMatch()!);
      });

      it('should go to the first match on a page that is not rendered yet', async () => {
        viewer.find('marker5');
        await currentMatchShown(viewer, 5);
        expect(viewer.page).to.equal(5);
        expect(getCurrentMatch()).to.equal(getMatches(5)[0]);
        expectInView(getCurrentMatch()!);
      });

      it('should not move focus', async () => {
        const outside = document.createElement('button');
        viewer.after(outside);
        outside.focus();
        viewer.find('marker1');
        await currentMatchShown(viewer);
        expect(document.activeElement).to.equal(outside);
      });

      it('should replace the matches of a previous find()', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        viewer.find('marker2');
        await currentMatchShown(viewer, 2);
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should run only the last of two find() calls in a row', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.find('marker1');
        viewer.find('marker2');
        await currentMatchShown(viewer, 2);
        await nextFrame();
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].detail.query).to.equal('marker2');
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should highlight each line of a match that spans a line break', async () => {
        viewer.find('five dozen liquor');
        await currentMatchShown(viewer);
        expect(viewer.shadowRoot!.querySelectorAll('.find-match.current')).to.have.lengthOf(2);
      });

      it('should scroll to a match on a page whose text layer renders when find() runs', async () => {
        // The match is below the view, at the bottom of the first page.
        const url = createPdf([
          { content: 'BT /F1 24 Tf 72 80 Td (Needle at the bottom) Tj ET' },
          { content: 'BT /F1 24 Tf 72 700 Td (Second page) Tj ET' },
        ]);
        // Hold the text layers while they render.
        const { TextLayer } = await loadPdfjs();
        const render = TextLayer.prototype.render;
        let release!: () => void;
        const released = new Promise<void>((resolve) => {
          release = resolve;
        });
        sinon.stub(TextLayer.prototype, 'render').callsFake(async function (this: InstanceType<typeof TextLayer>) {
          await released;
          return render.call(this);
        });
        try {
          const loaded = oneEvent(viewer, 'document-load');
          viewer.src = url;
          await loaded;
          for (let i = 0; i < 50 && !viewer.shadowRoot!.querySelector('.text-layer'); i++) {
            await nextFrame();
          }
          const result = oneEvent(viewer, 'find-result');
          viewer.find('needle');
          await result;
          release();
          await currentMatchShown(viewer, 1);
          expectInView(getCurrentMatch()!);
        } finally {
          URL.revokeObjectURL(url);
        }
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
        expect(getMatches()).to.be.empty;
      });

      it('should search the new document when called after src changes', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        await loadDocument(viewer, 'links.pdf');
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker1');
        const event = await result;
        expect(event.detail.matchCount).to.equal(0);
      });
    });

    describe('highlight()', () => {
      it('should highlight the text on the given page only', async () => {
        viewer.highlight(1, 'unique word');
        await currentMatchShown(viewer);
        expect(getMatches(1)).to.have.lengthOf(1);
        expect(getMatches()).to.have.lengthOf(1);
        expect(getCurrentMatch()).to.equal(getMatches(1)[0]);
      });

      it('should scroll to the text', async () => {
        viewer.highlight(3, 'marker3');
        await currentMatchShown(viewer, 3);
        expect(viewer.page).to.equal(3);
        expectInView(getCurrentMatch()!);
      });

      it('should not fire find-result', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        expect(spy).to.be.not.called;
      });

      it('should clear the previous highlight', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        viewer.highlight(2, 'marker2');
        await currentMatchShown(viewer, 2);
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should be cleared by find()', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker2');
        await result;
        expect(getMatches(1)).to.be.empty;
      });

      it('should drop the highlight when src changes', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        const idle = nextRenderIdle(viewer);
        await loadDocument(viewer, 'links.pdf');
        await idle;
        await nextFrame();
        expect(getMatches()).to.be.empty;
      });

      it('should warn and clear the previous highlight for a page out of range', async () => {
        const stub = sinon.stub(console, 'warn');
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        viewer.highlight(7, 'marker1');
        await nextFrame();
        expect(stub).to.be.calledOnce;
        expect(stub.firstCall.args[0]).to.include('out of range');
        expect(getMatches()).to.be.empty;
      });

      it('should highlight once the document has loaded when called while it loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        viewer.highlight(1, 'internal link');
        await nextRenderIdle(viewer);
        await currentMatchShown(viewer);
        expect(getMatches(1)).to.have.lengthOf(1);
      });

      it('should do nothing when not attached', async () => {
        const parent = viewer.parentElement!;
        viewer.remove();
        viewer.highlight(1, 'marker1');
        // Attached again in the same task, so that the viewer keeps the document
        parent.appendChild(viewer);
        await nextRender();
        await nextFrame();
        expect(getMatches()).to.be.empty;
      });
    });

    describe('detached', () => {
      let spy: sinon.SinonSpy;

      beforeEach(() => {
        spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
      });

      [
        ['find()', () => viewer.find('internal link')],
        ['highlight()', () => viewer.highlight(1, 'internal link')],
      ].forEach(([name, call]) => {
        it(`should not run ${name} called while detached once the document loads`, async () => {
          viewer.src = fixtureUrl('links.pdf');
          await nextUpdate(viewer);
          const parent = viewer.parentElement!;
          viewer.remove();
          (call as () => void)();
          // Attached again in the same task, so that the viewer keeps loading the document
          parent.appendChild(viewer);
          await nextRenderIdle(viewer);
          await nextFrame();
          expect(spy).to.be.not.called;
          expect(getMatches()).to.be.empty;
        });
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
        expect(getMatches()).to.be.empty;
      });
    });

    describe('highlights', () => {
      it('should go to the page of the match when its text differs from the text layer', async () => {
        // The text for searching has one more item than the text layer of the first page.
        const prototype = await getPdfPagePrototype();
        const getTextContent = prototype.getTextContent;
        sinon.stub(prototype, 'getTextContent').callsFake(async function (this: PDFPageProxy, ...args) {
          const content = await getTextContent.apply(this, args);
          return this.pageNumber === 1 ? { ...content, items: [...content.items, { str: 'extra' } as any] } : content;
        });
        getContent().scrollTop = 100;
        await scrollSettled(getContent());
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker1');
        await result;
        await nextFrame();
        expect(getMatches()).to.be.empty;
        expect(viewer.page).to.equal(1);
        expect(getContent().scrollTop).to.be.closeTo(0, 1);
      });

      it('should load the text of a page again after it failed to load', async () => {
        clearWarnings();
        const warn = sinon.stub(console, 'warn');
        const prototype = await getPdfPagePrototype();
        const getTextContent = prototype.getTextContent;
        let failed = false;
        sinon.stub(prototype, 'getTextContent').callsFake(function (this: PDFPageProxy, ...args) {
          if (this.pageNumber === 5 && !failed) {
            failed = true;
            return Promise.reject(new Error('Read failed'));
          }
          return getTextContent.apply(this, args);
        });
        let result = oneEvent(viewer, 'find-result');
        viewer.find('marker5');
        expect((await result).detail.matchCount).to.equal(0);
        expect(warn).to.be.calledWithMatch(/text of page 5/u);
        result = oneEvent(viewer, 'find-result');
        viewer.find('marker5');
        expect((await result).detail.matchCount).to.equal(1);
      });

      it('should remove the highlights of a page that is released and show them again when it renders', async () => {
        viewer.find('unique word');
        await currentMatchShown(viewer);
        viewer.page = 6;
        await nextRenderIdle(viewer);
        expect(viewer.shadowRoot!.querySelectorAll('[part~="page"]')[0].querySelector('.text-layer')).to.be.null;
        expect(getMatches(1)).to.be.empty;
        viewer.page = 1;
        await nextRenderIdle(viewer);
        await nextFrame();
        expect(getMatches(1)).to.have.lengthOf(1);
      });

      it('should update the highlights when zooming', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        const before = getMatches(1)[0].getBoundingClientRect().width;
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
        await nextFrame();
        const after = getMatches(1)[0].getBoundingClientRect().width;
        expect(after / before).to.be.greaterThan(1.5);
      });

      it('should keep the highlights over the text right after zooming', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        viewer.zoom = 2;
        await nextFrame();
        const highlight = getMatches(1)[0].getBoundingClientRect();
        const text = getTextSpan('marker1').getBoundingClientRect();
        expect(highlight.top + highlight.height / 2).to.be.within(text.top, text.bottom);
      });

      it('should drop the highlights when src changes', async () => {
        viewer.find('marker1');
        await currentMatchShown(viewer);
        await loadAndRender(viewer, fixtureUrl('links.pdf'));
        await nextFrame();
        expect(getMatches()).to.be.empty;
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
        const prototype = await getPdfPagePrototype();
        const getTextContent = prototype.getTextContent;
        sinon.stub(prototype, 'getTextContent').callsFake(function (this: PDFPageProxy, ...args) {
          if (this.pageNumber === 4 && !settle) {
            return new Promise((resolve, reject) => {
              settle = { resolve, reject };
            });
          }
          return getTextContent.apply(this, args);
        });
        viewer.find('the needle');
        for (let i = 0; i < 50 && !settle; i++) {
          await nextFrame();
        }
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
        await currentMatchShown(viewer, 4);
        expect(getMatches()).to.have.lengthOf(1);
        expect(getCurrentMatch()).to.equal(getMatches(4)[0]);
        const highlight = getCurrentMatch()!.getBoundingClientRect();
        const text = getTextRect('the needle');
        expect(highlight.left).to.be.closeTo(text.left, 1);
        expect(highlight.right).to.be.closeTo(text.right, 1);
      });

      it('should ignore text of the previous document that fails to load', async () => {
        clearWarnings();
        const stub = sinon.stub(console, 'warn');
        settle!.reject(new Error('Worker was destroyed'));
        await currentMatchShown(viewer, 4);
        expect(getCurrentMatch()).to.equal(getMatches(4)[0]);
        expect(stub).to.not.be.calledWithMatch(/text of page/u);
      });
    });

    describe('scrolling', () => {
      /** Collects the scroll positions of the pages until stopped. */
      function recordScroll() {
        const positions: number[] = [];
        const onScroll = () => positions.push(getContent().scrollTop);
        getContent().addEventListener('scroll', onScroll);
        return {
          positions,
          stop: () => getContent().removeEventListener('scroll', onScroll),
        };
      }

      beforeEach(async () => {
        // Also loads the text of all pages, so that the matches below are found without waiting for the worker
        viewer.find('marker1');
        await currentMatchShown(viewer);
      });

      it('should jump to a match on a page that is not rendered', async () => {
        const { positions, stop } = recordScroll();
        viewer.find('marker5');
        await currentMatchShown(viewer, 5);
        stop();
        expect(viewer.page).to.equal(5);
        expect(new Set(positions.map(Math.round)).size).to.be.at.most(2);
      });

      it('should not scroll to a match when the user goes to another page before it is shown', async () => {
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker5');
        await result;
        viewer.page = 2;
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(2);
        // Back on the page of the match, with the match above the view
        viewer.page = 5;
        await nextUpdate(viewer);
        getContent().scrollTop += 300;
        const top = getContent().scrollTop;
        await nextRenderIdle(viewer);
        await nextFrame();
        await scrollSettled(getContent());
        expect(getMatches(5)).to.have.lengthOf(1);
        expect(getContent().scrollTop).to.equal(top);
      });

      it('should scroll a match below the view to the middle of the view', async () => {
        viewer.highlight(2, 'marker2');
        await currentMatchShown(viewer, 2);
        const match = getCurrentMatch()!.getBoundingClientRect();
        const top = getContent().getBoundingClientRect().top;
        const bottom = top + getContent().clientHeight;
        expect(viewer.page).to.equal(2);
        expect(match.top + match.height / 2).to.be.closeTo((top + bottom) / 2, 1);
      });

      it('should not scroll to a match well inside the view', async () => {
        // A match in the middle of the view, which can scroll in both directions
        viewer.highlight(2, 'quick brown');
        await currentMatchShown(viewer, 2);
        const top = getContent().scrollTop;
        const previous = getCurrentMatch()!.getBoundingClientRect();
        // Further down in the same paragraph
        viewer.highlight(2, 'vexingly');
        await nextFrame();
        await scrollSettled(getContent());
        expect(getCurrentMatch()!.getBoundingClientRect().top).to.be.greaterThan(previous.bottom);
        expect(getContent().scrollTop).to.equal(top);
      });
    });
  });
});
