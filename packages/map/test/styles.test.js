import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-map.js';

describe('vaadin-map styles', () => {
  let map;

  beforeEach(() => {
    map = fixtureSync(`<vaadin-map></vaadin-map>`);
  });

  it('should hide the map when applying the hidden attribute', () => {
    let displayValue = getComputedStyle(map).display;
    expect(displayValue).to.equal('block');

    map.hidden = true;
    displayValue = getComputedStyle(map).display;
    expect(displayValue).to.equal('none');
  });

  it('should have a default size', () => {
    const computedStyles = getComputedStyle(map);
    expect(parseInt(computedStyles.width)).to.be.gt(0);
    expect(parseInt(computedStyles.height)).to.equal(400);
  });
});
