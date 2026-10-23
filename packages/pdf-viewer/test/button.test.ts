import { expect } from '@vaadin/chai-plugins';
import { emulateMedia } from '@vaadin/test-runner-commands';
import { fixtureSync, isDesktopSafari, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';

describe('vaadin-pdf-viewer-button', () => {
  let button: PdfViewerButton;

  function getIcon() {
    return button.shadowRoot!.querySelector<HTMLElement>('[part="icon"]')!;
  }

  beforeEach(async () => {
    button = fixtureSync('<vaadin-pdf-viewer-button icon="zoom-in" aria-label="Zoom in"></vaadin-pdf-viewer-button>');
    await nextRender();
  });

  it('should be a focusable button', () => {
    expect(button.getAttribute('role')).to.equal('button');
    expect(button.getAttribute('tabindex')).to.equal('0');
  });

  it('should hide the icon from assistive technology', () => {
    expect(getIcon().getAttribute('aria-hidden')).to.equal('true');
  });

  it('should show the icon selected with the icon attribute', () => {
    const plus = getComputedStyle(getIcon()).maskImage;
    expect(plus).to.contain('svg');
    button.setAttribute('icon', 'zoom-out');
    expect(getComputedStyle(getIcon()).maskImage).to.contain('svg').and.not.equal(plus);
  });

  it('should use the icon set with the custom property', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>';
    button.style.setProperty('--vaadin-pdf-viewer-icon-zoom-in', `url('data:image/svg+xml;utf8,${svg}')`);
    expect(getComputedStyle(getIcon()).maskImage).to.contain('circle');
  });

  it('should show the pressed state', () => {
    const background = getComputedStyle(button).backgroundColor;
    button.setAttribute('aria-pressed', 'true');
    expect(getComputedStyle(button).backgroundColor).to.not.equal(background);
  });

  // WebKit does not support emulating forced colors.
  (isDesktopSafari ? describe.skip : describe)('forced colors', () => {
    beforeEach(async () => {
      await emulateMedia({ forcedColors: 'active' });
    });

    afterEach(async () => {
      await emulateMedia({ forcedColors: 'none' });
    });

    it('should show the pressed state with system colors', () => {
      const background = getComputedStyle(button).backgroundColor;
      const iconColor = getComputedStyle(getIcon()).backgroundColor;
      button.setAttribute('aria-pressed', 'true');
      expect(getComputedStyle(button).backgroundColor).to.not.equal(background);
      expect(getComputedStyle(getIcon()).backgroundColor).to.not.equal(iconColor);
    });
  });
});
