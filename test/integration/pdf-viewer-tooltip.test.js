import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/pdf-viewer/test/enable-feature-flag.js';
import '@vaadin/pdf-viewer/src/vaadin-pdf-viewer.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('pdf-viewer with tooltip', () => {
  let viewer;

  function getButton(icon) {
    return viewer.querySelector(`vaadin-pdf-viewer-button[icon="${icon}"]`);
  }

  function getTooltip(icon) {
    return getButton(icon).querySelector('vaadin-tooltip');
  }

  function getPageField() {
    return viewer.querySelector('vaadin-integer-field');
  }

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    const idle = oneEvent(viewer, 'render-idle');
    viewer.src = new URL('../../packages/pdf-viewer/test/fixtures/multi-page.pdf', import.meta.url).href;
    await idle;
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should give every toolbar button a tooltip with its label', () => {
    viewer.querySelectorAll('vaadin-pdf-viewer-button').forEach((button) => {
      const tooltip = button.querySelector('vaadin-tooltip');
      expect(tooltip.target).to.equal(button);
      expect(tooltip.text).to.equal(button.getAttribute('aria-label'));
    });
  });

  it('should not add the tooltip to the accessible name or description of the button', () => {
    expect(getButton('next-page').hasAttribute('aria-describedby')).to.be.false;
    expect(getButton('next-page').hasAttribute('aria-labelledby')).to.be.false;
  });

  it('should show the button label as tooltip on hover', async () => {
    await sendMouseToElement({ type: 'move', element: getButton('next-page') });
    await nextRender();
    expect(getTooltip('next-page').opened).to.be.true;
  });

  it('should show the button label as tooltip on keyboard focus', async () => {
    getPageField().focus();
    await sendKeys({ press: 'Tab' });
    await nextRender();
    expect(getTooltip('next-page').opened).to.be.true;
  });

  it('should close the tooltip when the mouse leaves the button', async () => {
    await sendMouseToElement({ type: 'move', element: getButton('next-page') });
    await nextRender();
    await sendMouseToElement({ type: 'move', element: getPageField() });
    await nextRender();
    expect(getTooltip('next-page').opened).to.be.false;
  });

  it('should use the localized label as tooltip', async () => {
    viewer.i18n = { nextPage: 'Neste side' };
    await nextRender();
    expect(getTooltip('next-page').text).to.equal('Neste side');
  });

  it('should close an open tooltip when the viewer is removed', async () => {
    await sendMouseToElement({ type: 'move', element: getButton('next-page') });
    await nextRender();
    const tooltip = getTooltip('next-page');
    expect(tooltip.opened).to.be.true;
    viewer.remove();
    await nextRender();
    expect(tooltip.opened).to.be.false;
  });
});
