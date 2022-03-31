import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-grid.js';
import '../vaadin-grid-filter-column.js';
import '../vaadin-grid-sort-column.js';
import { flushGrid } from './helpers.js';

describe('disabled', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-filter-column path="foo"></vaadin-grid-filter-column>
        <vaadin-grid-sort-column path="bar"></vaadin-grid-sort-column>
      </vaadin-grid>
    `);

    grid.items = [
      { foo: '1', bar: '1' },
      { foo: '2', bar: '2' }
    ];

    flushGrid(grid);
  });

  it('should not set disabled property by default', () => {
    expect(grid.disabled).to.be.false;
  });

  it('should reflect disabled property to attribute', () => {
    grid.disabled = true;
    expect(grid.hasAttribute('disabled')).to.be.true;

    grid.disabled = false;
    expect(grid.hasAttribute('disabled')).to.be.false;
  });

  it('should set tabindex to -1 on the host when disabled', () => {
    grid.disabled = true;
    expect(grid.getAttribute('tabindex')).to.equal('-1');
  });

  it('should remove tabindex from the host when re-enabled', () => {
    grid.disabled = true;

    grid.disabled = false;

    expect(grid.hasAttribute('tabindex')).to.be.false;
  });

  it('should restore the previous tabindex when re-enabled', () => {
    grid.setAttribute('tabindex', '2');
    grid.disabled = true;
    grid.disabled = false;
    expect(grid.getAttribute('tabindex')).to.equal('2');
  });

  it('should set pointer-events: none when disabled', () => {
    grid.disabled = true;
    expect(getComputedStyle(grid).pointerEvents).to.equal('none');
  });

  describe('focus', () => {
    let inputBefore, inputAfter;

    beforeEach(() => {
      inputBefore = document.createElement('input');
      grid.parentNode.insertBefore(inputBefore, grid);

      inputAfter = document.createElement('input');
      grid.parentNode.appendChild(inputAfter);

      grid.disabled = true;
    });

    it('should skip disabled grid when navigating on Tab', async () => {
      inputBefore.focus();

      await sendKeys({ press: 'Tab' });

      expect(document.activeElement).to.equal(inputAfter);
    });

    it('should skip disabled grid when navigating on Shift Tab', async () => {
      inputAfter.focus();

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(document.activeElement).to.equal(inputBefore);
    });
  });
});
