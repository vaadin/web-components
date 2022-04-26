import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('map feature flag disabled', () => {
  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  it('should not define the map element when feature flag is disabled and warn about its usage', async () => {
    await import('../vaadin-map.js');

    expect(customElements.get('vaadin-map')).to.be.undefined;
    expect(console.warn.calledOnce).to.be.true;
    expect(console.warn.args[0][0]).to.include(
      'WARNING: The map component is currently an experimental feature and needs to be explicitly enabled.',
    );
  });
});
