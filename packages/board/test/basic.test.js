import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-board.js';

describe('vaadin-board', () => {
  let board, tagName;

  beforeEach(() => {
    board = fixtureSync('<vaadin-board></vaadin-board>');
    tagName = board.tagName.toLowerCase();
  });

  it('should define a vaadin-board custom element', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });

  it('should define a vaadin-board-row custom element', () => {
    expect(customElements.get('vaadin-board-row')).to.be.ok;
  });
});
