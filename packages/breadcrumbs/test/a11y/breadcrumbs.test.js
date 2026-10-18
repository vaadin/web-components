import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../../vaadin-breadcrumbs.js';

describe('vaadin-breadcrumbs', () => {
  let breadcrumbs;

  beforeEach(async () => {
    breadcrumbs = fixtureSync(`
      <vaadin-breadcrumbs>
        <vaadin-breadcrumbs-item style="width: 100px" path="/">Home</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs">Documents</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs/projects">Projects</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px">Summary report</vaadin-breadcrumbs-item>
      </vaadin-breadcrumbs>
    `);
    await nextRender();
    await nextResize(breadcrumbs);
  });

  const collapse = async () => {
    breadcrumbs.style.maxWidth = '250px';
    await nextResize(breadcrumbs);
  };

  it('default', async () => {
    await expect(breadcrumbs).to.equalA11yTreeSnapshot();
    await expect(breadcrumbs).to.be.accessible();
  });

  it('overflow', async () => {
    await collapse();
    await expect(breadcrumbs).to.equalA11yTreeSnapshot();
    await expect(breadcrumbs).to.be.accessible();
  });

  it('overflow opened', async () => {
    await collapse();
    const overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
    const opened = oneEvent(overlay, 'vaadin-overlay-open');
    breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]').click();
    await opened;
    await expect(breadcrumbs).to.equalA11yTreeSnapshot();
    await expect(breadcrumbs).to.be.accessible();
  });
});
