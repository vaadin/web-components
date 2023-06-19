import { expect } from '@esm-bundle/chai';

describe('side-nav feature flag enabled', () => {
  it('should define the side-nav element when feature flag is enabled', async () => {
    await import('../enable.js');
    await import('../vaadin-side-nav.js');

    expect(customElements.get('vaadin-side-nav')).not.to.be.undefined;
  });
});
