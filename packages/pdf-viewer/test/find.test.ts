import { expect } from '@vaadin/chai-plugins';
import { emulateMedia, sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import type { TextField } from '@vaadin/text-field';
import { createPageText, findInText, getMatchParts, normalizeText } from '../src/pdf-viewer-find.js';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, currentMatchShown, fixtureUrl, loadDocument, nextRenderIdle, scrollSettled } from './helpers.js';

/**
 * Returns the prototype of the pages of every pdf.js document, including the
 * documents of the viewer, through a page of a document loaded for that.
 */
async function getPdfPagePrototype() {
  const pdfjs = await loadPdfjs();
  const handle = acquireWorker(pdfjs);
  const task = pdfjs.getDocument({ url: fixtureUrl('multi-page.pdf'), worker: handle.worker! });
  try {
    return Object.getPrototypeOf(await (await task.promise).getPage(1));
  } finally {
    await task.destroy();
    releaseWorker(handle);
  }
}

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

    function getFindBar() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="find-bar"]')!;
    }

    function getFindField() {
      return viewer.querySelector<TextField>('vaadin-text-field[slot="find"]')!;
    }

    function getButton(icon: string) {
      return viewer.querySelector<HTMLElement & { disabled: boolean }>(`vaadin-pdf-viewer-button[icon="${icon}"]`)!;
    }

    function getResultText() {
      const result = viewer.querySelector('vaadin-text-field[slot="find"] > span[slot="suffix"]');
      return result ? result.textContent!.trim() : '';
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

    function getAnnouncement() {
      return [...document.body.children].find((element) => element.hasAttribute('aria-live'))!.textContent;
    }

    async function waitForResult() {
      // Searching loads the text of all pages from the worker
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

    /** Spies on whether the keydown events that reach the document are prevented. */
    function spyOnKeyDown() {
      const spy = sinon.spy();
      const onKeyDown = (event: KeyboardEvent) => spy(event.defaultPrevented);
      document.addEventListener('keydown', onKeyDown);
      return { spy, restore: () => document.removeEventListener('keydown', onKeyDown) };
    }

    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
      await nextRender();
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should hide the find bar by default', () => {
      expect(getFindBar().hidden).to.be.true;
    });

    it('should open the find bar and focus the field with the find button', async () => {
      getButton('find').click();
      await nextRender();
      expect(getFindBar().hidden).to.be.false;
      expect(document.activeElement).to.equal(getFindField().inputElement);
    });

    it('should toggle aria-pressed on the find button', async () => {
      getButton('find').click();
      await nextRender();
      expect(getButton('find').getAttribute('aria-pressed')).to.equal('true');
      getButton('find').click();
      await nextRender();
      expect(getButton('find').getAttribute('aria-pressed')).to.equal('false');
    });

    it('should return focus to the pages when closing find opened from the pages', async () => {
      getContent().focus();
      await sendKeys({ press: 'Control+KeyF' });
      await nextRender();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
    });

    it('should open the find bar with Ctrl+F inside the viewer', async () => {
      getContent().focus();
      await sendKeys({ press: 'Control+KeyF' });
      await nextRender();
      expect(getFindBar().hidden).to.be.false;
      expect(document.activeElement).to.equal(getFindField().inputElement);
    });

    it('should leave Ctrl+F to the browser outside the viewer', async () => {
      const outside = document.createElement('input');
      viewer.after(outside);
      outside.focus();
      const { spy, restore } = spyOnKeyDown();
      await sendKeys({ press: 'Control+KeyF' });
      restore();
      expect(spy.lastCall.args[0]).to.be.false;
      await nextRender();
      expect(getFindBar().hidden).to.be.true;
    });

    it('should show the find bar over the pages without moving them', async () => {
      const before = getContent().getBoundingClientRect();
      getButton('find').click();
      await nextRender();
      const after = getContent().getBoundingClientRect();
      expect(after.top).to.equal(before.top);
      expect(after.height).to.equal(before.height);
      const findBar = getFindBar().getBoundingClientRect();
      expect(findBar.top).to.be.at.least(after.top);
      expect(findBar.right).to.be.at.most(after.right);
    });

    it('should place the find bar next to the scrollbar of the pages', async () => {
      getButton('find').click();
      await nextRender();
      const content = getContent();
      expect(getFindBar().getBoundingClientRect().right).to.be.at.most(
        content.getBoundingClientRect().left + content.clientWidth,
      );
    });

    it('should leave Ctrl+G to the browser while the find bar is closed', async () => {
      getContent().focus();
      const { spy, restore } = spyOnKeyDown();
      await sendKeys({ press: 'Control+KeyG' });
      restore();
      // The keydown of G, after the one of Control
      expect(spy.lastCall.args[0]).to.be.false;
    });

    describe('find button hidden', () => {
      beforeEach(async () => {
        viewer.findButtonHidden = true;
        await nextUpdate(viewer);
      });

      it('should toggle the find button on findButtonHidden', async () => {
        expect(getButton('find')).to.be.null;
        viewer.findButtonHidden = false;
        await nextUpdate(viewer);
        expect(getButton('find')).to.be.ok;
      });

      it('should hide the find button with the attribute', async () => {
        viewer.findButtonHidden = false;
        await nextUpdate(viewer);
        viewer.setAttribute('find-button-hidden', '');
        await nextUpdate(viewer);
        expect(getButton('find')).to.be.null;
      });

      it('should leave Ctrl+F to the browser', async () => {
        getContent().focus();
        const { spy, restore } = spyOnKeyDown();
        await sendKeys({ press: 'Control+KeyF' });
        restore();
        expect(spy.lastCall.args[0]).to.be.false;
        await nextRender();
        expect(getFindBar().hidden).to.be.true;
      });

      it('should find with find()', async () => {
        viewer.find('marker1');
        await waitForResult();
        expect(getFindBar().hidden).to.be.false;
        expect(getResultText()).to.equal('1 of 1');
      });
    });

    describe('opened', () => {
      beforeEach(async () => {
        getButton('find').click();
        await nextRender();
      });

      it('should find matches on all pages, including pages not rendered yet', async () => {
        await search('quick brown fox');
        expect(getResultText()).to.equal('1 of 6');
      });

      it('should highlight the matches on rendered pages', async () => {
        await search('marker1');
        expect(getMatches(1)).to.have.lengthOf(1);
      });

      it('should place the highlight over the matching text', async () => {
        await search('marker1');
        const span = [...viewer.shadowRoot!.querySelectorAll('.text-layer span')].find((element) =>
          element.textContent!.includes('marker1'),
        )!;
        // The span contains the whole line "Unique word on this page: marker1."
        const highlight = getMatches(1)[0].getBoundingClientRect();
        const text = span.getBoundingClientRect();
        const middle = highlight.top + highlight.height / 2;
        expect(middle).to.be.within(text.top, text.bottom);
        expect(highlight.left).to.be.greaterThan(text.left + text.width / 2);
        expect(highlight.right).to.be.at.most(text.right + 1);
      });

      it('should show no matches', async () => {
        await search('nonexistent');
        expect(getResultText()).to.equal('No matches');
        expect(getButton('next-match').disabled).to.be.true;
      });

      it('should go to the next match on a page that is not rendered yet', async () => {
        await search('unique word');
        getButton('next-match').click();
        getButton('next-match').click();
        await nextRenderIdle(viewer);
        await scrollSettled(getContent());
        expect(viewer.page).to.equal(3);
        expect(getResultText()).to.equal('3 of 5');
        const current = getCurrentMatch()!.getBoundingClientRect();
        const content = getContent().getBoundingClientRect();
        expect(current.top).to.be.greaterThan(content.top);
        expect(current.bottom).to.be.lessThan(content.bottom);
      });

      it('should go to the previous match with Shift+Enter, wrapping around', async () => {
        await search('unique word');
        getFindField().focus();
        await sendKeys({ press: 'Shift+Enter' });
        await nextFrame();
        expect(getResultText()).to.equal('5 of 5');
      });

      it('should go to the next match with Enter', async () => {
        await search('unique word');
        getFindField().focus();
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(getResultText()).to.equal('2 of 5');
      });

      it('should show the result in the find field', async () => {
        await search('quick brown fox');
        const suffix = getFindField().querySelector('[slot="suffix"]')!;
        expect(suffix.textContent!.trim()).to.equal('1 of 6');
      });

      it('should not change the layout of the find bar when the result appears', async () => {
        const elements = [getFindBar(), getFindField(), getButton('next-match')];
        const before = elements.map((element) => element.getBoundingClientRect().toJSON());
        await search('quick');
        const after = elements.map((element) => element.getBoundingClientRect().toJSON());
        expect(after).to.deep.equal(before);
      });

      it('should go to the next match with Ctrl+G and to the previous one with Shift+Ctrl+G', async () => {
        await search('unique word');
        getFindField().focus();
        await sendKeys({ press: 'Control+KeyG' });
        await nextFrame();
        expect(getResultText()).to.equal('2 of 5');
        await sendKeys({ press: 'Shift+Control+KeyG' });
        await nextFrame();
        expect(getResultText()).to.equal('1 of 5');
      });

      it('should go to the next match with F3 on the pages', async () => {
        await search('unique word');
        getContent().focus();
        await sendKeys({ press: 'F3' });
        await nextFrame();
        expect(getResultText()).to.equal('2 of 5');
      });

      it('should fire find-result when the user searches', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        await search('unique word');
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].detail).to.deep.equal({ query: 'unique word', matchCount: 5 });
      });

      describe('scrolling', () => {
        afterEach(async () => {
          await emulateMedia({ reducedMotion: 'no-preference' });
        });

        it('should scroll smoothly to a match on a rendered page', async () => {
          await search('marker');
          await scrollSettled(getContent());
          const start = getContent().scrollTop;
          const positions: number[] = [];
          const onScroll = () => positions.push(getContent().scrollTop);
          getContent().addEventListener('scroll', onScroll);
          getButton('next-match').click();
          await scrollSettled(getContent());
          getContent().removeEventListener('scroll', onScroll);
          const end = getContent().scrollTop;
          expect(end).to.be.greaterThan(start);
          // At least one position on the way
          expect(positions.some((top) => top > start && top < end)).to.be.true;
        });

        it('should not scroll smoothly when reduced motion is preferred', async () => {
          await emulateMedia({ reducedMotion: 'reduce' });
          await search('marker');
          await scrollSettled(getContent());
          getButton('next-match').click();
          await nextFrame();
          const top = getContent().scrollTop;
          await scrollSettled(getContent());
          expect(getContent().scrollTop).to.equal(top);
        });

        it('should jump to a match more than two views away', async () => {
          await search('marker');
          await scrollSettled(getContent());
          const positions: number[] = [];
          const onScroll = () => positions.push(getContent().scrollTop);
          getContent().addEventListener('scroll', onScroll);
          // The fifth page is more than two views below the first one
          getButton('previous-match').click();
          await nextRenderIdle(viewer);
          await scrollSettled(getContent());
          getContent().removeEventListener('scroll', onScroll);
          expect(viewer.page).to.equal(5);
          expect(new Set(positions.map(Math.round)).size).to.be.at.most(2);
        });

        it('should scroll a match below the view to the middle of the view below the find bar', async () => {
          await search('marker');
          await scrollSettled(getContent());
          getButton('next-match').click();
          await scrollSettled(getContent());
          const match = getCurrentMatch()!.getBoundingClientRect();
          const top = getFindBar().getBoundingClientRect().bottom;
          const bottom = getContent().getBoundingClientRect().top + getContent().clientHeight;
          expect(viewer.page).to.equal(2);
          expect(match.top + match.height / 2).to.be.closeTo((top + bottom) / 2, 1);
        });

        it('should not scroll to a match well inside the view', async () => {
          await search('quick');
          await scrollSettled(getContent());
          getButton('next-match').click();
          getButton('next-match').click();
          await scrollSettled(getContent());
          const top = getContent().scrollTop;
          // The next match is in the same paragraph, one line below
          getButton('next-match').click();
          await scrollSettled(getContent());
          expect(getResultText()).to.equal('4 of 12');
          expect(getContent().scrollTop).to.equal(top);
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
            await scrollSettled(getContent());
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
          await scrollSettled(getContent());
          // Place the next match where the find bar covers it, but outside the margin of the view without the find bar.
          const findBar = getFindBar().getBoundingClientRect();
          const next = getMatches(2)[0].getBoundingClientRect();
          getContent().scrollTop += next.top - (findBar.bottom - next.height / 2);
          await nextFrame();
          getButton('next-match').click();
          await scrollSettled(getContent());
          expect(getCurrentMatch()!.getBoundingClientRect().top).to.be.at.least(
            getFindBar().getBoundingClientRect().bottom,
          );
        });
      });

      it('should remove the highlights of a page that is released', async () => {
        await search('unique word');
        viewer.page = 6;
        await nextRenderIdle(viewer);
        expect(viewer.shadowRoot!.querySelectorAll('[part~="page"]')[0].querySelector('.text-layer')).to.be.null;
        expect(getMatches(1)).to.be.empty;
      });

      it('should update the highlights when zooming', async () => {
        await search('marker1');
        const before = getMatches(1)[0].getBoundingClientRect().width;
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
        await nextFrame();
        const after = getMatches(1)[0].getBoundingClientRect().width;
        expect(after / before).to.be.greaterThan(1.5);
      });

      describe('announcements', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(async () => {
          await search('unique word');
          clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        });

        afterEach(() => {
          clock.restore();
        });

        it('should announce the result when going to a match', async () => {
          getButton('next-match').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('2 of 5, page 2');
        });

        it('should announce the result of typing after a delay', async () => {
          input('marker2');
          await clock.tickAsync(400);
          expect(getAnnouncement()).to.not.equal('1 of 1, page 2');
          await clock.tickAsync(300);
          expect(getAnnouncement()).to.equal('1 of 1, page 2');
        });

        it('should announce when the text is not found', async () => {
          input('nonexistent');
          await clock.tickAsync(700);
          expect(getAnnouncement()).to.equal('No matches');
        });

        it('should not announce the same result again', async () => {
          input('marker3');
          await clock.tickAsync(700);
          expect(getAnnouncement()).to.equal('1 of 1, page 3');
          const region = [...document.body.children].find((element) => element.hasAttribute('aria-live'))!;
          region.textContent = '';
          input('marker3 ');
          await clock.tickAsync(700);
          expect(getAnnouncement()).to.equal('');
        });

        it('should use i18n for the announcement', async () => {
          viewer.i18n = { findResultAnnouncement: '{current} av {total}, sida {page}' };
          await clock.tickAsync(20);
          getButton('next-match').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('2 av 5, sida 2');
        });

        it('should not announce a highlight', async () => {
          const region = [...document.body.children].find((element) => element.hasAttribute('aria-live'))!;
          region.textContent = '';
          viewer.highlight(1, 'marker1');
          await clock.tickAsync(700);
          expect(getAnnouncement()).to.equal('');
        });

        it('should not announce the result of typing when detached meanwhile', async () => {
          input('marker4');
          await clock.tickAsync(100);
          viewer.remove();
          await clock.tickAsync(700);
          expect(getAnnouncement()).to.not.equal('1 of 1, page 4');
        });
      });

      it('should continue from the same match when reopened', async () => {
        await search('unique word');
        getButton('next-match').click();
        getButton('next-match').click();
        await nextFrame();
        getButton('close').click();
        await nextRender();
        getButton('find').click();
        await nextRender();
        await waitForResult();
        expect(getResultText()).to.equal('3 of 5');
      });

      it('should show the results again when reopened', async () => {
        await search('marker1');
        getButton('close').click();
        await nextRender();
        getButton('find').click();
        await nextRender();
        await waitForResult();
        expect(getResultText()).to.equal('1 of 1');
        expect(getMatches(1)).to.have.lengthOf(1);
      });

      it('should close the find bar with Escape on the find bar buttons', async () => {
        await search('unique word');
        getButton('next-match').focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(getFindBar().hidden).to.be.true;
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
        expect(getFindBar().hidden).to.be.false;
      });

      it('should show the result of the last query when typing quickly', async () => {
        getFindField().focus();
        await sendKeys({ type: 'unique word on this page: marker2' });
        await waitForResult();
        expect(getResultText()).to.equal('1 of 1');
      });

      it('should show no result while searching', async () => {
        input('quick');
        await nextUpdate(viewer);
        // The search has not gone through all pages yet
        expect(getResultText()).to.equal('');
      });

      it('should keep the highlights over the text right after zooming', async () => {
        await search('marker1');
        viewer.zoom = 2;
        await nextFrame();
        const span = [...viewer.shadowRoot!.querySelectorAll('.text-layer span')].find((element) =>
          element.textContent!.includes('marker1'),
        )!;
        const highlight = getMatches(1)[0].getBoundingClientRect();
        const text = span.getBoundingClientRect();
        expect(highlight.top + highlight.height / 2).to.be.within(text.top, text.bottom);
      });

      it('should not let input events of the find field reach the application', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('input', spy);
        getFindField().focus();
        await sendKeys({ type: 'a' });
        expect(spy).to.be.not.called;
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
        expect(getFindBar().hidden).to.be.true;
        expect(getMatches()).to.be.empty;
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
          sinon.stub(prototype, 'getTextContent').callsFake(function (this: any, ...args: unknown[]): Promise<unknown> {
            if (this.pageNumber === 4 && !settle) {
              return new Promise((resolve, reject) => {
                settle = { resolve, reject };
              });
            }
            return getTextContent.apply(this, args);
          });
          input('the needle');
          for (let i = 0; i < 50 && !settle; i++) {
            await nextFrame();
          }
          const loaded = oneEvent(viewer, 'document-load');
          viewer.src = url;
          await loaded;
          await waitForResult();
          expect(getResultText()).to.equal('1 of 1');
        });

        afterEach(() => {
          URL.revokeObjectURL(url);
        });

        async function expectCurrentMatchSelectedOnClose() {
          await currentMatchShown(viewer);
          getButton('close').click();
          await nextRender();
          expect(window.getSelection()!.toString()).to.equal('the needle');
          window.getSelection()!.removeAllRanges();
        }

        it('should not mix text that arrives late with the text of the new document', async () => {
          settle!.resolve({ items: [{ str: 'x'.repeat(500) }, { str: 'y' }] });
          await expectCurrentMatchSelectedOnClose();
        });

        it('should ignore text of the previous document that fails to load', async () => {
          const stub = sinon.stub(console, 'warn');
          settle!.reject(new Error('Worker was destroyed'));
          await expectCurrentMatchSelectedOnClose();
          expect(stub).to.not.be.calledWithMatch(/text of page/u);
        });
      });

      it('should search the new document when src changes', async () => {
        await search('marker1');
        await loadDocument(viewer, 'links.pdf');
        await waitForResult();
        expect(getResultText()).to.equal('No matches');
      });
    });

    describe('find()', () => {
      it('should open the find bar with the text and show the result', async () => {
        viewer.find('quick brown fox');
        await waitForResult();
        expect(getFindBar().hidden).to.be.false;
        expect(getFindField().value).to.equal('quick brown fox');
        expect(getResultText()).to.equal('1 of 6');
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

      it('should scroll to the first match of the document', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        viewer.find('unique word');
        await waitForResult();
        await currentMatchShown(viewer);
        expect(getResultText()).to.equal('1 of 5');
        expect(viewer.page).to.equal(1);
        const current = getCurrentMatch()!.getBoundingClientRect();
        const content = getContent().getBoundingClientRect();
        expect(current.top).to.be.at.least(getFindBar().getBoundingClientRect().bottom);
        expect(current.bottom).to.be.lessThan(content.bottom);
      });

      it('should not move focus', async () => {
        const outside = document.createElement('button');
        viewer.after(outside);
        outside.focus();
        viewer.find('marker1');
        await waitForResult();
        expect(document.activeElement).to.equal(outside);
      });

      it('should replace the text of the open find bar', async () => {
        getButton('find').click();
        await nextRender();
        await search('marker1');
        viewer.find('marker2');
        await waitForResult();
        expect(getFindField().value).to.equal('marker2');
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should find once the document has loaded when called while it loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        viewer.find('internal link');
        const event = await oneEvent(viewer, 'find-result');
        expect(event.detail).to.deep.equal({ query: 'internal link', matchCount: 1 });
        expect(getFindBar().hidden).to.be.false;
      });

      it('should do nothing when not attached', async () => {
        const parent = viewer.parentElement!;
        viewer.remove();
        viewer.find('marker1');
        // The viewer releases the document when it stays detached
        await nextFrame();
        const loaded = oneEvent(viewer, 'document-load');
        parent.appendChild(viewer);
        await loaded;
        await nextRender();
        expect(getFindBar().hidden).to.be.true;
      });
    });

    describe('detached', () => {
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
          expect(getFindBar().hidden).to.be.true;
          expect(getMatches()).to.be.empty;
        });
      });

      it('should not open the find bar for find() when detached as the document loads', async () => {
        viewer.src = fixtureUrl('links.pdf');
        viewer.find('internal link');
        const parent = viewer.parentElement!;
        await new Promise((resolve) => {
          viewer.addEventListener('document-load', () => resolve(viewer.remove()), { once: true });
        });
        await nextFrame();
        const loaded = oneEvent(viewer, 'document-load');
        parent.appendChild(viewer);
        await loaded;
        await nextRender();
        expect(getFindBar().hidden).to.be.true;
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
        await nextRenderIdle(viewer);
        await currentMatchShown(viewer);
        expect(viewer.page).to.equal(3);
        const current = getCurrentMatch()!.getBoundingClientRect();
        const content = getContent().getBoundingClientRect();
        expect(current.top).to.be.greaterThan(content.top);
        expect(current.bottom).to.be.lessThan(content.bottom);
      });

      it('should not open the find bar or fire find-result', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('find-result', spy);
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        expect(getFindBar().hidden).to.be.true;
        expect(spy).to.be.not.called;
      });

      it('should clear the previous highlight', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        viewer.highlight(2, 'marker2');
        await currentMatchShown(viewer);
        expect(getMatches(1)).to.be.empty;
        expect(getMatches(2)).to.have.lengthOf(1);
      });

      it('should be cleared by find()', async () => {
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        viewer.find('marker2');
        await waitForResult();
        expect(getMatches(1)).to.be.empty;
      });

      it('should clear the text of the open find bar', async () => {
        getButton('find').click();
        await nextRender();
        await search('marker2');
        viewer.highlight(1, 'marker1');
        await currentMatchShown(viewer);
        expect(getFindField().value).to.equal('');
        expect(getResultText()).to.equal('');
        expect(getMatches(1)).to.have.lengthOf(1);
        expect(getMatches(2)).to.be.empty;
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

    // Last, as the tooltip that opens on keyboard focus listens to Escape on the document while open
    describe('closing with keyboard', () => {
      async function findAndClose(query: string, page: number) {
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        await sendKeys({ type: query });
        await waitForResult();
        // Wait until the page of the match is shown with its text
        const getTextLayer = () =>
          viewer.shadowRoot!.querySelectorAll('[part~="page"]')[page - 1]?.querySelector('.text-layer');
        for (let i = 0; i < 100 && (viewer.page !== page || !getTextLayer()); i++) {
          await nextFrame();
        }
        await sendKeys({ press: 'Escape' });
        await nextRender();
      }

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
        await nextFrame();
        approve.focus();
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        approve.hidden = true;
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(getDeepActiveElement()).to.equal(getContent());
      });

      it('should focus the pages when the thumbnail focused before is hidden meanwhile', async () => {
        viewer.sidebarOpened = true;
        await nextRender();
        viewer.shadowRoot!.querySelector<HTMLElement>('[part~="thumbnail"]')!.focus();
        await sendKeys({ press: 'Control+KeyF' });
        await nextRender();
        viewer.sidebarOpened = false;
        await nextRender();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(getDeepActiveElement()).to.equal(getContent());
      });

      it('should focus the pages when the link focused before is released meanwhile', async () => {
        const idle = nextRenderIdle(viewer);
        await loadDocument(viewer, 'links.pdf');
        await idle;
        const link = viewer.shadowRoot!.querySelector<HTMLElement>('a.link')!;
        link.focus();
        await findAndClose('Page 4', 4);
        expect(link.isConnected).to.be.false;
        expect(getDeepActiveElement()).to.equal(getContent());
      });

      it('should return focus to the find button when closing with Escape', async () => {
        getButton('find').focus();
        await sendKeys({ press: 'Enter' });
        await nextRender();
        expect(document.activeElement).to.equal(getFindField().inputElement);
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(document.activeElement).to.equal(getButton('find'));
      });
    });
  });
});
