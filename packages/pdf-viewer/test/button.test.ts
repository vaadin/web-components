import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';

describe('vaadin-pdf-viewer-button', () => {
  let button: PdfViewerButton;

  function getIcon() {
    return button.shadowRoot!.querySelector<HTMLElement>('[part="icon"]')!;
  }

  beforeEach(async () => {
    button = fixtureSync('<vaadin-pdf-viewer-button icon="next-page"></vaadin-pdf-viewer-button>');
    await nextRender();
  });

  it('should be a focusable button', () => {
    expect(button.getAttribute('role')).to.equal('button');
    expect(button.getAttribute('tabindex')).to.equal('0');
  });

  it('should be focusable when disabled', () => {
    button.disabled = true;
    expect(button.getAttribute('tabindex')).to.equal('0');
    button.focus();
    expect(document.activeElement).to.equal(button);
  });

  it('should hide the icon from assistive technology', () => {
    expect(getIcon().getAttribute('aria-hidden')).to.equal('true');
  });

  it('should show the next page icon flipped for previous page', () => {
    const icon = getComputedStyle(getIcon());
    expect(icon.maskImage).to.contain('svg');
    expect(icon.scale).to.equal('none');
    button.setAttribute('icon', 'previous-page');
    expect(icon.maskImage).to.contain('svg');
    expect(icon.scale).to.equal('1 -1');
  });
});
