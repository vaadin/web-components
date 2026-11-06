import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { TextField } from '@vaadin/text-field';
import { createPageText, findInText, getMatchParts, normalizeText, readTextItems } from '../src/pdf-viewer-find.js';
import { loadPdfjs } from '../src/pdfjs-loader.js';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  createPdfUrl,
  currentMatchShown,
  failTextOnce,
  fixtureUrl,
  getPdfPagePrototype,
  getViewCenter,
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

    it('should return the parts of the items that a match covers', () => {
      const [match] = findInText(normalizeText(pageText.text), 'quick brown');
      expect(getMatchParts(pageText, match)).to.deep.equal([
        { itemIndex: 0, start: 4, end: 9 },
        { itemIndex: 1, start: 0, end: 5 },
      ]);
    });

    it('should not return a part of the next item for a match that ends with an item', () => {
      // "fox" ends the second item, which the third item follows without a line break.
      const [match] = findInText(normalizeText(pageText.text), 'fox');
      expect(getMatchParts(pageText, match)).to.deep.equal([{ itemIndex: 1, start: 7, end: 10 }]);
    });

    it('should read the text items of all chunks of the stream', async () => {
      const chunks = [{ items: [{ str: 'First' }] }, { items: [{ str: 'Second', hasEOL: true }] }];
      const pdfPage = {
        streamTextContent: () =>
          new ReadableStream({
            start(controller) {
              chunks.forEach((chunk) => controller.enqueue(chunk));
              controller.close();
            },
          }),
      } as unknown as PDFPageProxy;
      expect(await readTextItems(pdfPage)).to.deep.equal([{ str: 'First' }, { str: 'Second', hasEOL: true }]);
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

    function getFindBar() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="find-bar"]')!;
    }

    function getFindField() {
      return viewer.querySelector<TextField>('vaadin-text-field[slot="find-field"]')!;
    }

    function getButton(icon: string) {
      return viewer.querySelector<PdfViewerButton>(`vaadin-pdf-viewer-button[icon="${icon}"]`)!;
    }

    function getResultText() {
      return getFindField()?.querySelector('[slot="suffix"]')!.textContent!.trim() ?? '';
    }

    async function waitForResult() {
      // Searching loads the text of all pages from the worker.
      for (let i = 0; i < 50 && !getResultText(); i++) {
        await nextFrame();
      }
      await nextFrame();
    }

    function input(query: string) {
      const field = getFindField();
      field.value = query;
      field.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    async function search(query: string) {
      input(query);
      await waitForResult();
    }

    async function openFindBar() {
      getButton('find').click();
      await nextRender();
    }

    /** Spies on whether the keydown events that reach the document are prevented. */
    function spyOnKeyDown() {
      const spy = sinon.spy();
      const onKeyDown = (event: KeyboardEvent) => spy(event.defaultPrevented);
      document.addEventListener('keydown', onKeyDown);
      return { spy, restore: () => document.removeEventListener('keydown', onKeyDown) };
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

    describe('find bar', () => {
      it('should hide the find bar by default', () => {
        expect(getFindBar().checkVisibility()).to.be.false;
        expect(getFindField()).to.be.null;
      });

      it('should open the find bar and focus the field with the find button', async () => {
        await openFindBar();
        expect(getFindBar().checkVisibility()).to.be.true;
        expect(document.activeElement).to.equal(getFindField().inputElement);
      });

      it('should toggle aria-pressed on the find button', async () => {
        await openFindBar();
        expect(getButton('find').getAttribute('aria-pressed')).to.equal('true');
        getButton('find').click();
        await nextRender();
        expect(getButton('find').getAttribute('aria-pressed')).to.equal('false');
      });

      it('should disable the find button without a document', async () => {
        viewer.src = null;
        await nextUpdate(viewer);
        expect(getButton('find').disabled).to.be.true;
      });

      it('should open the find bar with Ctrl+F inside the viewer', async () => {
        getContent().focus();
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        expect(getFindBar().checkVisibility()).to.be.true;
        expect(document.activeElement).to.equal(getFindField().inputElement);
      });

      it('should leave Ctrl+F to the browser outside the viewer', async () => {
        const outside = document.createElement('input');
        viewer.after(outside);
        outside.focus();
        const { spy, restore } = spyOnKeyDown();
        await sendKeys({ press: 'Control+KeyF' });
        restore();
        outside.remove();
        expect(spy.lastCall.args[0]).to.be.false;
        await nextRender();
        expect(getFindBar().checkVisibility()).to.be.false;
      });

      it('should leave Ctrl+G to the browser while the find bar is closed', async () => {
        getContent().focus();
        const { spy, restore } = spyOnKeyDown();
        await sendKeys({ press: 'Control+KeyG' });
        restore();
        // The keydown of G, after the one of Control
        expect(spy.lastCall.args[0]).to.be.false;
      });

      it('should return focus to the pages when closing the find bar opened from the pages', async () => {
        getContent().focus();
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
      });

      it('should show the find bar over the pages without moving them', async () => {
        const before = getContent().getBoundingClientRect();
        await openFindBar();
        const after = getContent().getBoundingClientRect();
        expect(after.top).to.equal(before.top);
        expect(after.height).to.equal(before.height);
        const findBar = getFindBar().getBoundingClientRect();
        expect(findBar.top).to.be.at.least(after.top);
      });

      it('should place the find bar next to the scrollbar of the pages', async () => {
        await openFindBar();
        const content = getContent();
        expect(getFindBar().getBoundingClientRect().right).to.be.at.most(
          content.getBoundingClientRect().left + content.clientWidth,
        );
      });

      it('should place the find bar next to the scrollbar of the pages in RTL', async () => {
        viewer.setAttribute('dir', 'rtl');
        await openFindBar();
        const content = getContent();
        // The client area starts after the scrollbar, which is on the left in RTL.
        expect(getFindBar().getBoundingClientRect().left).to.be.at.least(
          content.getBoundingClientRect().left + content.clientLeft,
        );
      });

      describe('find button hidden', () => {
        beforeEach(async () => {
          viewer.findButtonHidden = true;
          await nextUpdate(viewer);
        });

        it('should toggle the find button on findButtonHidden', async () => {
          expect(getButton('find').checkVisibility()).to.be.false;
          viewer.findButtonHidden = false;
          await nextUpdate(viewer);
          expect(getButton('find').checkVisibility()).to.be.true;
        });

        it('should hide the find button with the attribute', async () => {
          viewer.findButtonHidden = false;
          await nextUpdate(viewer);
          viewer.setAttribute('find-button-hidden', '');
          await nextUpdate(viewer);
          expect(getButton('find').checkVisibility()).to.be.false;
        });

        it('should leave Ctrl+F to the browser', async () => {
          getContent().focus();
          const { spy, restore } = spyOnKeyDown();
          await sendKeys({ press: 'Control+KeyF' });
          restore();
          expect(spy.lastCall.args[0]).to.be.false;
          await nextRender();
          expect(getFindBar().checkVisibility()).to.be.false;
        });

        it('should open the find bar with find()', async () => {
          viewer.find('marker1');
          await waitForResult();
          expect(getFindBar().checkVisibility()).to.be.true;
          expect(getResultText()).to.equal('1 of 1');
        });
      });

      describe('opened', () => {
        beforeEach(async () => {
          await openFindBar();
        });

        it('should find matches on all pages, including pages not rendered yet', async () => {
          await search('quick brown fox');
          expect(getResultText()).to.equal('1 of 6');
        });

        it('should highlight the matches on rendered pages', async () => {
          await search('marker1');
          expect(getMatches(1)).to.have.lengthOf(1);
        });

        it('should show no matches and disable the match buttons', async () => {
          await search('nonexistent');
          expect(getResultText()).to.equal('No matches');
          expect(getButton('previous-match').disabled).to.be.true;
          expect(getButton('next-match').disabled).to.be.true;
        });

        it('should show no result while searching', async () => {
          input('quick');
          await nextUpdate(viewer);
          // The search has not gone through all pages yet
          expect(getResultText()).to.equal('');
        });

        it('should show the result of the last text when typing quickly', async () => {
          getFindField().focus();
          await sendKeys({ type: 'unique word on this page: marker2' });
          await waitForResult();
          expect(getResultText()).to.equal('1 of 1');
        });

        it('should start from the first match on or after the current page', async () => {
          viewer.page = 3;
          await nextRenderIdle(viewer);
          await search('unique word');
          expect(getResultText()).to.equal('3 of 5');
        });

        it('should go to the next match on a page that is not rendered yet', async () => {
          await search('unique word');
          getButton('next-match').click();
          getButton('next-match').click();
          await currentMatchShown(viewer, 3);
          expect(viewer.page).to.equal(3);
          expect(getResultText()).to.equal('3 of 5');
          expectInView(getCurrentMatch()!);
        });

        it('should go to the next match with Enter', async () => {
          await search('unique word');
          getFindField().focus();
          await sendKeys({ press: 'Enter' });
          await nextUpdate(viewer);
          expect(getResultText()).to.equal('2 of 5');
        });

        it('should go to the previous match with Shift+Enter, wrapping around', async () => {
          await search('unique word');
          getFindField().focus();
          await sendKeys({ press: 'Shift+Enter' });
          await nextUpdate(viewer);
          expect(getResultText()).to.equal('5 of 5');
        });

        it('should go to the next match with Ctrl+G and to the previous one with Shift+Ctrl+G', async () => {
          await search('unique word');
          getFindField().focus();
          await sendKeys({ press: 'Control+KeyG' });
          await nextUpdate(viewer);
          expect(getResultText()).to.equal('2 of 5');
          await sendKeys({ press: 'Shift+Control+KeyG' });
          await nextUpdate(viewer);
          expect(getResultText()).to.equal('1 of 5');
        });

        it('should go to the next match with F3 on the pages', async () => {
          await search('unique word');
          getContent().focus();
          await sendKeys({ press: 'F3' });
          await nextUpdate(viewer);
          expect(getResultText()).to.equal('2 of 5');
        });

        it('should not change the layout of the find bar when the result appears', async () => {
          const elements = [getFindBar(), getFindField(), getButton('next-match')];
          const before = elements.map((element) => element.getBoundingClientRect().toJSON());
          await search('quick');
          const after = elements.map((element) => element.getBoundingClientRect().toJSON());
          expect(after).to.deep.equal(before);
        });

        it('should fire find-result when the user searches', async () => {
          const spy = sinon.spy();
          viewer.addEventListener('find-result', spy);
          await search('unique word');
          expect(spy).to.be.calledOnce;
          expect(spy.firstCall.args[0].detail).to.deep.equal({ query: 'unique word', matchCount: 5 });
        });

        it('should not let the input and change events of the find field reach the application', async () => {
          const spy = sinon.spy();
          viewer.addEventListener('input', spy);
          viewer.addEventListener('change', spy);
          getFindField().focus();
          await sendKeys({ type: 'a' });
          await sendKeys({ press: 'Tab' });
          expect(spy).to.be.not.called;
        });

        it('should continue from the same match when opened again', async () => {
          await search('unique word');
          getButton('next-match').click();
          getButton('next-match').click();
          await nextUpdate(viewer);
          getButton('close').click();
          await nextRender();
          await openFindBar();
          await waitForResult();
          expect(getResultText()).to.equal('3 of 5');
        });

        it('should show the results again when opened again', async () => {
          await search('marker1');
          getButton('close').click();
          await nextRender();
          await openFindBar();
          await waitForResult();
          expect(getResultText()).to.equal('1 of 1');
          expect(getMatches(1)).to.have.lengthOf(1);
        });

        it('should search the new document when src changes', async () => {
          await search('marker1');
          await loadDocument(viewer, 'links.pdf');
          await waitForResult();
          expect(getResultText()).to.equal('No matches');
        });

        it('should select the current match when closing', async () => {
          await search('marker1');
          getButton('close').click();
          await nextRender();
          expect(window.getSelection()!.toString()).to.equal('marker1');
          window.getSelection()!.removeAllRanges();
        });

        it('should close the find bar and remove the highlights with Escape', async () => {
          await search('marker1');
          getFindField().focus();
          await sendKeys({ press: 'Escape' });
          await nextRender();
          expect(getFindBar().checkVisibility()).to.be.false;
          expect(getMatches()).to.be.empty;
        });

        it('should close the find bar with Escape on the find bar buttons', async () => {
          await search('unique word');
          getButton('next-match').focus();
          await sendKeys({ press: 'Escape' });
          await nextRender();
          expect(getFindBar().checkVisibility()).to.be.false;
        });

        it('should prevent the default of Escape that closes the find bar', async () => {
          getFindField().focus();
          const { spy, restore } = spyOnKeyDown();
          await sendKeys({ press: 'Escape' });
          restore();
          expect(spy.lastCall.args[0]).to.be.true;
        });

        it('should not close the find bar on Escape that is handled already', async () => {
          getFindField().inputElement.addEventListener('keydown', (event) => event.preventDefault());
          getFindField().focus();
          await sendKeys({ press: 'Escape' });
          await nextRender();
          expect(getFindBar().checkVisibility()).to.be.true;
        });

        describe('space above the pages', () => {
          let page: HTMLElement;
          let initialTop: number;

          beforeEach(async () => {
            // The heading "Page 1" is under the find bar at the top of the pages
            viewer.style.setProperty('--vaadin-pdf-viewer-padding', '0px');
            viewer.zoom = 0.3;
            await nextRenderIdle(viewer);
            page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
            initialTop = page.getBoundingClientRect().top;
            await search('page');
            await currentMatchShown(viewer, 1);
          });

          it('should add space above the pages for a match at the top of the first page', () => {
            expect(page.getBoundingClientRect().top).to.be.greaterThan(initialTop);
            expect(getCurrentMatch()!.getBoundingClientRect().top).to.be.at.least(
              getFindBar().getBoundingClientRect().bottom,
            );
          });

          it('should remove the space above the pages when the find bar closes', async () => {
            getButton('close').click();
            await nextFrame();
            expect(page.getBoundingClientRect().top).to.be.closeTo(initialTop, 1);
          });

          it('should keep the pages in place when the space is removed while scrolled down', async () => {
            getContent().scrollTop += 300;
            await nextFrame();
            const second = viewer.shadowRoot!.querySelectorAll('[part~="page"]')[1];
            const top = second.getBoundingClientRect().top;
            getButton('close').click();
            await nextFrame();
            expect(second.getBoundingClientRect().top).to.be.closeTo(top, 1);
          });
        });

        it('should keep the current match out from under the find bar', async () => {
          // A low viewer, so that the margin at the edges of the view is smaller than the find bar
          viewer.style.height = '220px';
          await search('marker');
          await currentMatchShown(viewer, 1);
          // Place the next match where the find bar covers it, but outside the margin of the view without the find bar.
          const findBar = getFindBar().getBoundingClientRect();
          const next = getMatches(2)[0].getBoundingClientRect();
          getContent().scrollTop += next.top - (findBar.bottom - next.height / 2);
          await nextFrame();
          getButton('next-match').click();
          await currentMatchShown(viewer, 2);
          expect(getCurrentMatch()!.getBoundingClientRect().top).to.be.at.least(
            getFindBar().getBoundingClientRect().bottom,
          );
        });
      });
    });

    describe('find()', () => {
      it('should open the find bar with the text and show the result', async () => {
        viewer.find('quick brown fox');
        await waitForResult();
        expect(getFindBar().checkVisibility()).to.be.true;
        expect(getFindField().value).to.equal('quick brown fox');
        expect(getResultText()).to.equal('1 of 6');
      });

      it('should replace the text of the open find bar', async () => {
        await openFindBar();
        await search('marker1');
        viewer.find('marker2');
        await currentMatchShown(viewer, 2);
        expect(getFindField().value).to.equal('marker2');
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

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

      it('should run only the last of a find() and a highlight() call in a row', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.find('marker1');
        viewer.highlight(2, 'marker2');
        await currentMatchShown(viewer, 2);
        await nextFrame();
        expect(spy).to.be.not.called;
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should find matches on pages after the first ten', async () => {
        await loadAndRender(viewer, createPdfUrl(12));
        const result = oneEvent(viewer, 'find-result');
        viewer.find('Page 12');
        expect((await result).detail.matchCount).to.equal(1);
        await currentMatchShown(viewer, 12);
        expect(viewer.page).to.equal(12);
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
        async function fakeRender(this: InstanceType<typeof TextLayer>) {
          await released;
          return render.call(this);
        }
        sinon.stub(TextLayer.prototype, 'render').callsFake(fakeRender);
        try {
          const loaded = oneEvent(viewer, 'document-load');
          viewer.src = url;
          await loaded;
          for (let i = 0; i < 50 && !viewer.shadowRoot!.querySelector('.text-layer'); i++) {
            await nextFrame();
          }
          expect(viewer.shadowRoot!.querySelector('.text-layer')).to.be.ok;
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

      it('should not open the find bar or fire find-result', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        expect(getFindBar().checkVisibility()).to.be.false;
        expect(spy).to.be.not.called;
      });

      it('should clear the text of the open find bar', async () => {
        await openFindBar();
        await search('marker2');
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer, 1);
        expect(getFindField().value).to.equal('');
        expect(getResultText()).to.equal('');
        expect(getMatches(1)).to.have.lengthOf(1);
        expect(getMatches(2)).to.be.empty;
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

      it('should highlight the text on the last page', async () => {
        viewer.highlight(6, 'landscape');
        await currentMatchShown(viewer, 6);
        expect(getMatches(6)).to.have.lengthOf(1);
      });

      [0, 1.5, 7].forEach((page) => {
        it(`should warn and clear the previous highlight for page ${page}, which is out of range`, async () => {
          // The warning is issued once per page.
          clearWarnings();
          const stub = sinon.stub(console, 'warn');
          viewer.highlight(1, 'marker1');
          await currentMatchShown(viewer);
          viewer.highlight(page, 'marker1');
          await nextFrame();
          expect(stub).to.be.calledOnce;
          expect(stub.firstCall.args[0]).to.include('out of range');
          expect(getMatches()).to.be.empty;
        });
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

      it('should drop the matches when detached', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        const parent = viewer.parentElement!;
        viewer.remove();
        // The viewer releases the document when it stays detached
        await nextFrame();
        const idle = nextRenderIdle(viewer);
        parent.appendChild(viewer);
        await idle;
        await nextFrame();
        expect(getMatches()).to.be.empty;
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
        // The text for searching has one more item than the text layer of the first page, which has rendered already.
        const prototype = await getPdfPagePrototype();
        const streamTextContent = prototype.streamTextContent;
        function fakeStreamTextContent(this: PDFPageProxy, ...args: Parameters<PDFPageProxy['streamTextContent']>) {
          const stream = streamTextContent.apply(this, args);
          if (this.pageNumber !== 1) {
            return stream;
          }
          return stream.pipeThrough(
            new TransformStream({
              transform(content, controller) {
                controller.enqueue({ ...content, items: [...content.items, { str: 'extra' }] });
              },
            }),
          );
        }
        sinon.stub(prototype, 'streamTextContent').callsFake(fakeStreamTextContent);
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

      it('should highlight and scroll to the matches of a hidden viewer once it is shown', async () => {
        // As in an inactive tab
        viewer.parentElement!.hidden = true;
        await nextResize(viewer);
        const result = oneEvent(viewer, 'find-result');
        viewer.find('marker1');
        await result;
        await nextFrame();
        expect(getMatches()).to.be.empty;
        viewer.parentElement!.hidden = false;
        await nextResize(viewer);
        await currentMatchShown(viewer, 1);
        expect(getMatches(1)).to.have.lengthOf(1);
        expectInView(getCurrentMatch()!);
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

      it('should scroll a match below the view to the middle of the view below the find bar', async () => {
        viewer.highlight(2, 'marker2');
        await currentMatchShown(viewer, 2);
        const match = getCurrentMatch()!.getBoundingClientRect();
        const top = getFindBar().getBoundingClientRect().bottom;
        const bottom = getContent().getBoundingClientRect().top + getContent().clientHeight;
        expect(viewer.page).to.equal(2);
        expect(match.top + match.height / 2).to.be.closeTo((top + bottom) / 2, 1);
      });

      it('should scroll a match close to an edge of the view to the middle of the view below the find bar', async () => {
        viewer.highlight(3, 'marker3');
        await currentMatchShown(viewer, 3);
        const content = getContent();
        const bottom = content.getBoundingClientRect().top + content.clientHeight;
        // In the view, 16px above its bottom edge
        content.scrollTop -= bottom - 16 - getCurrentMatch()!.getBoundingClientRect().bottom;
        await scrollSettled(content);
        viewer.highlight(3, 'marker3');
        await nextFrame();
        await scrollSettled(content);
        const match = getCurrentMatch()!.getBoundingClientRect();
        const top = getFindBar().getBoundingClientRect().bottom;
        expect(match.top + match.height / 2).to.be.closeTo((top + bottom) / 2, 1);
      });

      it('should not scroll horizontally to a match that is in the view horizontally', async () => {
        viewer.zoom = 2;
        await loadAndRender(viewer, createPdf([{ content: 'BT /F1 12 Tf 160 400 Td (Needle) Tj ET' }]));
        viewer.highlight(1, 'Needle');
        await currentMatchShown(viewer);
        expect(getContent().scrollLeft).to.equal(0);
        expectInView(getCurrentMatch()!);
      });

      it('should scroll a match beside the view to the middle of the view', async () => {
        viewer.zoom = 3;
        await loadAndRender(viewer, createPdf([{ content: 'BT /F1 12 Tf 420 400 Td (Right) Tj ET' }]));
        viewer.highlight(1, 'Right');
        await currentMatchShown(viewer);
        const match = getCurrentMatch()!.getBoundingClientRect();
        expect(match.left + match.width / 2).to.be.closeTo(getViewCenter(getContent()), 1);
      });

      it('should scroll a match beside the view to the middle of the view in RTL', async () => {
        viewer.setAttribute('dir', 'rtl');
        viewer.zoom = 3;
        await loadAndRender(viewer, createPdf([{ content: 'BT /F1 12 Tf 150 400 Td (Left) Tj ET' }]));
        viewer.highlight(1, 'Left');
        await currentMatchShown(viewer);
        const match = getCurrentMatch()!.getBoundingClientRect();
        expect(match.left + match.width / 2).to.be.closeTo(getViewCenter(getContent()), 1);
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

    // Last, as the tooltip that opens on keyboard focus listens to Escape on the document while open
    describe('closing with keyboard', () => {
      async function findAndClose(query: string, page: number) {
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        await sendKeys({ type: query });
        await waitForResult();
        await currentMatchShown(viewer, page);
        await sendKeys({ press: 'Escape' });
        await nextRender();
      }

      it('should return focus to the find button when closing with Escape', async () => {
        getButton('find').focus();
        await sendKeys({ press: 'Enter' });
        await nextRender();
        expect(document.activeElement).to.equal(getFindField().inputElement);
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(document.activeElement).to.equal(getButton('find'));
      });

      it('should focus the pages when the button focused before is disabled meanwhile', async () => {
        getButton('next-page').focus();
        await findAndClose('landscape', 6);
        expect(getButton('next-page').disabled).to.be.true;
        expect(getDeepActiveElement()).to.equal(getContent());
      });

      it('should focus the pages when the element focused before is hidden meanwhile', async () => {
        const approve = document.createElement('button');
        approve.slot = 'toolbar-actions';
        approve.textContent = 'Approve';
        viewer.appendChild(approve);
        approve.focus();
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        approve.hidden = true;
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(getDeepActiveElement()).to.equal(getContent());
      });

      it('should focus the pages when the link focused before is released meanwhile', async () => {
        await loadAndRender(viewer, fixtureUrl('links.pdf'));
        const link = viewer.shadowRoot!.querySelector<HTMLElement>('a.link')!;
        link.focus();
        await findAndClose('Page 4', 4);
        expect(link.isConnected).to.be.false;
        expect(getDeepActiveElement()).to.equal(getContent());
      });
    });
  });
});
