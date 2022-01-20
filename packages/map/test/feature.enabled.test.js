import { expect } from '@esm-bundle/chai';

describe('map feature flag enabled', () => {
  it('should define the map element when feature flag is enabled', async () => {
    await import('../enable.js');
    await import('../vaadin-map.js');

    expect(customElements.get('vaadin-map')).not.to.be.undefined;
  });
});
