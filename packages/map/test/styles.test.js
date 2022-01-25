import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../enable.js';
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
});
