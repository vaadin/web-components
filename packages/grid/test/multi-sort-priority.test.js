import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-grid-multi-sort-priority-append.js';

describe('multi-sort priority feature flag', () => {
  let grid;

  before(async () => {
    await import('../src/vaadin-grid.js');
  });

  describe('default', () => {
    beforeEach(() => {
      grid = fixtureSync('<vaadin-grid></vaadin-grid>');
    });

    it('should set multiSortPriority to append by default', () => {
      expect(grid.multiSortPriority).to.be.equal('append');
    });
  });

  describe('prepend', () => {
    beforeEach(() => {
      grid = fixtureSync('<vaadin-grid multi-sort-priority="prepend"></vaadin-grid>');
    });

    it('should allow setting multiSortPriority to prepend', () => {
      expect(grid.multiSortPriority).to.be.equal('prepend');
    });
  });
});
