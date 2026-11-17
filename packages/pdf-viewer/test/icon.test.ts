import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../src/vaadin-pdf-viewer-icon.js';
import type { PdfViewerIcon } from '../src/vaadin-pdf-viewer-icon.js';

describe('vaadin-pdf-viewer-icon', () => {
  let icon: PdfViewerIcon;

  beforeEach(async () => {
    icon = fixtureSync('<vaadin-pdf-viewer-icon icon="next-page"></vaadin-pdf-viewer-icon>');
    await nextRender();
  });

  it('should show the next page icon flipped for previous page', () => {
    const style = getComputedStyle(icon);
    expect(style.maskImage).to.contain('svg');
    expect(style.scale).to.equal('none');
    icon.setAttribute('icon', 'previous-page');
    expect(style.maskImage).to.contain('svg');
    expect(style.scale).to.equal('1 -1');
  });
});
