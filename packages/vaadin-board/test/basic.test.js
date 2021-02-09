import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-board.js';

describe('vaadin-details', () => {
  let board;

  beforeEach(() => {
    board = fixtureSync('<vaadin-board></vaadin-board>');
  });

  it('should define a vaadin-board custom element', () => {
    expect(customElements.get('vaadin-board')).to.be.ok;
  });

  it('should define a vaadin-board-row custom element', () => {
    expect(customElements.get('vaadin-board-row')).to.be.ok;
  });

  it('should have a valid version number', () => {
    expect(board.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });
});
