import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import { html, render } from 'lit';
import { getPhysicalItems } from './helpers.js';

describe('lit', () => {
  it('should render items after dynamically adding more columns', async () => {
    const wrapper = fixtureSync(`<div></div>`);

    function renderGrid(columnPaths, items) {
      render(
        html`
          <vaadin-grid .items=${items}>
            ${columnPaths.map((columnPath) => {
              return html`<vaadin-grid-column path=${columnPath}></vaadin-grid-column>`;
            })}
          </vaadin-grid>
        `,
        wrapper,
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

  it('should not throw when dynamically removing sort columns after sorting', async () => {
    const wrapper = fixtureSync(`<div></div>`);

    function renderGrid(columnPaths, items) {
      render(
        html`
          <vaadin-grid .items=${items}>
            ${columnPaths.map((columnPath) => {
              return html`<vaadin-grid-sort-column path="${columnPath}"></vaadin-grid-sort-column>`;
            })}
          </vaadin-grid>
        `,
        wrapper,
      );
    }

    // First render with two columns
    renderGrid(['c1', 'c2'], [{ c1: '1-1', c2: '1-2' }]);

    await aTimeout(0);

    document.querySelector('vaadin-grid-sorter').click();

    // Then render a grid with one column
    renderGrid(['c1'], [{ c1: '1-1', c2: '1-2' }]);
  });
});
