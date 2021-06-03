import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import { render, html } from 'lit';
import '../vaadin-grid.js';
import { getPhysicalItems } from './helpers.js';

describe('renderig with lit', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync(`<div></div>`);
  });

  it('should render items after dynamically adding more columns', async () => {
    function renderGrid(columnPaths, items) {
      render(
        html`
          <vaadin-grid .items=${items}>
            ${columnPaths.map((columnPath) => {
              return html`<vaadin-grid-column path=${columnPath}></vaadin-grid-column>`;
            })}
          </vaadin-grid>
        `,
        wrapper
      );
    }

    // First render with just one column and 0 items
    renderGrid(['first'], []);

    await aTimeout(0);
    // Then render with more than one column and more than 0 items
    renderGrid(['first', 'second'], [{ first: 'foo', second: 'bar' }]);

    await aTimeout(0);
    const grid = wrapper.firstElementChild;
    expect(getPhysicalItems(grid).length).to.equal(1);
  });
});
