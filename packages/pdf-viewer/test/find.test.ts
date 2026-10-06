import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { TextField } from '@vaadin/text-field';
import { createPageText, findInText, getMatchParts, normalizeText } from '../src/pdf-viewer-find.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

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
    let clock: sinon.SinonFakeTimers | undefined;

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
      return viewer.querySelector('span[slot="find-actions"]')!.textContent!.trim();
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

    async function waitForResult() {
      // Searching loads the text of all pages from the worker
      for (let i = 0; i < 50 && !getResultText(); i++) {
        await nextFrame();
      }
      await nextFrame();
    }

    async function search(query: string) {
      const field = getFindField();
      field.value = query;
      field.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await waitForResult();
    }

    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
      await nextRender();
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    afterEach(() => {
      clock?.restore();
      clock = undefined;
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
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      content.focus();
      await sendKeys({ press: 'Control+KeyF' });
      await nextRender();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should open the find bar with Ctrl+F inside the viewer', async () => {
      viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.focus();
      await sendKeys({ press: 'Control+KeyF' });
      await nextRender();
      expect(getFindBar().hidden).to.be.false;
      expect(document.activeElement).to.equal(getFindField().inputElement);
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
        await nextFrame();
        expect(viewer.page).to.equal(3);
        expect(getResultText()).to.equal('3 of 5');
        const current = getCurrentMatch()!.getBoundingClientRect();
        const content = viewer.shadowRoot!.querySelector('[part="content"]')!.getBoundingClientRect();
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

      it('should update the highlights when zooming', async () => {
        await search('marker1');
        const before = getMatches(1)[0].getBoundingClientRect().width;
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
        await nextFrame();
        const after = getMatches(1)[0].getBoundingClientRect().width;
        expect(after / before).to.be.greaterThan(1.5);
      });

      it('should announce the result', async () => {
        await search('unique word');
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        getButton('next-match').click();
        await clock.tickAsync(200);
        const region = [...document.body.children].find((element) => element.hasAttribute('aria-live'))!;
        expect(region.textContent).to.equal('2 of 5, page 2');
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

      it('should show the result of the last query when typing quickly', async () => {
        const field = getFindField();
        field.focus();
        await sendKeys({ type: 'unique word on this page: marker2' });
        await waitForResult();
        expect(getResultText()).to.equal('1 of 1');
      });

      it('should show no result while searching', async () => {
        const field = getFindField();
        field.value = 'quick';
        field.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await nextUpdate(viewer);
        // The search has not gone through all pages yet
        const result = viewer.querySelector<HTMLElement>('span[slot="find-actions"]')!;
        expect(result.hidden).to.be.true;
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

      it('should close the find bar and remove the highlights with Escape', async () => {
        await search('marker1');
        getFindField().focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(getFindBar().hidden).to.be.true;
        expect(getMatches()).to.be.empty;
      });

      it('should search the new document when src changes', async () => {
        await search('marker1');
        await loadDocument(viewer, 'links.pdf');
        await waitForResult();
        expect(getResultText()).to.equal('No matches');
      });
    });

    // Last, as the tooltip that opens on keyboard focus listens to Escape on the document while open
    describe('closing with keyboard', () => {
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
