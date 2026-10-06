import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { IntegerField } from '@vaadin/integer-field';
import type { Select } from '@vaadin/select';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

describe('toolbar', () => {
  let viewer: PdfViewer;

  function getButton(icon: string) {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>(`vaadin-pdf-viewer-button[icon="${icon}"]`)!;
  }

  function getPageField() {
    return viewer.querySelector<IntegerField>('vaadin-integer-field')!;
  }

  function getZoomSelect() {
    return viewer.querySelector<Select>('vaadin-select')!;
  }

  function getAnnouncement() {
    return [...document.body.children].find((element) => element.hasAttribute('aria-live'))!.textContent;
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('without document', () => {
    it('should disable the controls', () => {
      ['previous-page', 'next-page', 'zoom-out', 'zoom-in'].forEach((icon) => {
        expect(getButton(icon).disabled).to.be.true;
      });
      expect(getPageField().disabled).to.be.true;
      expect(getZoomSelect().disabled).to.be.true;
    });
  });

  describe('with document', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    describe('page navigation', () => {
      it('should show the current page in the page field', () => {
        expect(getPageField().value).to.equal('1');
      });

      it('should update the page field when the page changes', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        expect(getPageField().value).to.equal('3');
      });

      it('should go to the next page when clicking next page', async () => {
        getButton('next-page').click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(2);
      });

      it('should go to the previous page when clicking previous page', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        getButton('previous-page').click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(2);
      });

      it('should toggle disabled on previous page button on the first page', async () => {
        expect(getButton('previous-page').disabled).to.be.true;
        viewer.page = 2;
        await nextRenderIdle(viewer);
        expect(getButton('previous-page').disabled).to.be.false;
      });

      it('should toggle disabled on next page button on the last page', async () => {
        expect(getButton('next-page').disabled).to.be.false;
        viewer.page = 6;
        await nextRenderIdle(viewer);
        expect(getButton('next-page').disabled).to.be.true;
      });

      it('should go to the page entered in the page field', async () => {
        const field = getPageField();
        field.focus();
        (field.inputElement as HTMLInputElement).select();
        await sendKeys({ type: '4' });
        await sendKeys({ press: 'Enter' });
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(4);
      });

      it('should restore the current page for a page out of range', async () => {
        const field = getPageField();
        field.focus();
        (field.inputElement as HTMLInputElement).select();
        await sendKeys({ type: '9' });
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(viewer.page).to.equal(1);
        expect(field.value).to.equal('1');
        expect(field.invalid).to.be.false;
      });

      it('should announce the page when navigating with the toolbar', async () => {
        const clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        try {
          getButton('next-page').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('Page 2 of 6');
        } finally {
          clock.restore();
        }
      });

      it('should move focus to the page field when the focused next page button gets disabled', async () => {
        viewer.page = 5;
        await nextRenderIdle(viewer);
        getButton('next-page').focus();
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(viewer.page).to.equal(6);
        expect(document.activeElement).to.equal(getPageField().inputElement);
      });
    });

    describe('zoom', () => {
      it('should show the zoom in the zoom select', () => {
        expect(getZoomSelect().value).to.equal('page-width');
      });

      it('should set the zoom selected in the zoom select', async () => {
        const select = getZoomSelect();
        select.value = '2';
        select.dispatchEvent(new CustomEvent('change'));
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(2);
      });

      it('should show a zoom that is not one of the levels', async () => {
        viewer.zoom = 1.1;
        await nextRenderIdle(viewer);
        const select = getZoomSelect();
        expect(select.value).to.equal('1.1');
        expect(select.items!.find((item) => item.value === '1.1')!.label).to.equal('110%');
      });

      it('should zoom in to the next level', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(1.25);
      });

      it('should zoom out to the previous level', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        getButton('zoom-out').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(0.75);
      });

      it('should zoom in from a fit zoom to the next level above its scale', async () => {
        // 600px wide, so page-width is between 50% and 75%
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(0.75);
      });

      it('should fire zoom-changed event when zooming with the toolbar', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('zoom-changed', spy);
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(spy).to.be.calledOnce;
      });

      it('should toggle disabled on zoom in button at the largest zoom', async () => {
        viewer.zoom = 4;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-in').disabled).to.be.true;
        viewer.zoom = 3;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-in').disabled).to.be.false;
      });

      it('should toggle disabled on zoom out button at the smallest zoom', async () => {
        viewer.zoom = 0.25;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-out').disabled).to.be.true;
        viewer.zoom = 0.5;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-out').disabled).to.be.false;
      });
    });

    describe('i18n', () => {
      it('should use i18n for the accessible names', async () => {
        viewer.i18n = { nextPage: 'Nästa sida', page: 'Sida', zoom: 'Zooma' };
        await nextFrame();
        expect(getButton('next-page').getAttribute('aria-label')).to.equal('Nästa sida');
        expect(getPageField().accessibleName).to.equal('Sida');
        expect(getZoomSelect().accessibleName).to.equal('Zooma');
      });

      it('should use i18n for the page announcement', async () => {
        viewer.i18n = { pageAnnouncement: 'Sida {page} av {pageCount}' };
        await nextFrame();
        const clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        try {
          getButton('next-page').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('Sida 2 av 6');
        } finally {
          clock.restore();
        }
      });
    });

    describe('tooltip', () => {
      let tooltip: Tooltip;

      before(() => {
        Tooltip.setDefaultFocusDelay(0);
        Tooltip.setDefaultHoverDelay(0);
        Tooltip.setDefaultHideDelay(0);
      });

      beforeEach(() => {
        tooltip = viewer.querySelector('vaadin-tooltip')!;
      });

      afterEach(async () => {
        await resetMouse();
      });

      it('should show the button label as tooltip on hover', async () => {
        await sendMouseToElement({ type: 'move', element: getButton('next-page') });
        await nextRender();
        expect(tooltip.target).to.equal(getButton('next-page'));
        expect(tooltip.text).to.equal('Next page');
        expect(tooltip.opened).to.be.true;
      });

      it('should show the button label as tooltip on keyboard focus', async () => {
        getPageField().focus();
        await sendKeys({ press: 'Tab' });
        await nextRender();
        expect(tooltip.target).to.equal(getButton('next-page'));
        expect(tooltip.opened).to.be.true;
      });

      it('should close the tooltip when the mouse leaves the button', async () => {
        await sendMouseToElement({ type: 'move', element: getButton('next-page') });
        await nextRender();
        await sendMouseToElement({ type: 'move', element: getPageField() });
        await nextRender();
        expect(tooltip.opened).to.be.false;
      });
    });
  });
});
