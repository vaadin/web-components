import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
// Ensure registered custom properties are available
import '@vaadin/component-base/src/styles/style-props.js';

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener('load', resolve);
    link.addEventListener('error', reject);
    document.head.appendChild(link);
  });
}

function getStyle(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/** Resolves a Lumo custom property the same way the browser does for a real element. */
function resolveColor(property) {
  const reference = fixtureSync(`<div style="background-color: var(${property})"></div>`);
  return getStyle(reference, 'background-color');
}

function fixtureTable({ classes = '' } = {}) {
  return fixtureSync(`
    <table class="${classes}">
      <thead>
        <tr>
          <th>Name</th>
          <th>Moons</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Earth</th>
          <td>1</td>
        </tr>
        <tr>
          <th>Mars</th>
          <td>2</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <td>3</td>
        </tr>
      </tfoot>
    </table>
  `);
}

describe('table', () => {
  before(async () => {
    await loadCSS('/packages/vaadin-lumo-styles/src/props/index.css');
    await loadCSS('/packages/vaadin-lumo-styles/src/global/index.css');
  });

  it('should style the table only when it has the vaadin-table class', () => {
    const styled = fixtureTable({ classes: 'vaadin-table' });
    const plain = fixtureTable();

    expect(getStyle(styled, 'border-top-width')).to.equal('1px');
    expect(getStyle(styled, 'border-top-color')).to.equal(resolveColor('--lumo-contrast-20pct'));
    expect(getStyle(styled.querySelector('td'), 'padding')).to.equal('4px 16px');

    expect(getStyle(plain, 'border-top-width')).to.equal('0px');
    expect(getStyle(plain.querySelector('td'), 'padding')).to.equal('1px');
  });

  it('should align header cells with the column instead of centering them', () => {
    const styled = fixtureTable({ classes: 'vaadin-table' }).querySelector('th');
    const plain = fixtureTable().querySelector('th');

    expect(getStyle(styled, 'text-align')).to.equal('start');
    expect(getStyle(plain, 'text-align')).to.equal('center');
  });

  it('should tell the header and the footer apart by type', () => {
    const table = fixtureTable({ classes: 'vaadin-table' });
    const header = table.querySelector('thead th');
    const footer = table.querySelector('tfoot th');
    const body = table.querySelector('tbody td');

    expect(getStyle(header, 'font-size')).to.equal('14px');
    expect(getStyle(header, 'font-weight')).to.equal('500');
    expect(getStyle(footer, 'font-size')).to.equal('14px');
    expect(getStyle(footer, 'font-weight')).to.equal('400');
    expect(getStyle(body, 'font-size')).to.equal('16px');
  });

  it('should draw a line between rows but not along the outer edges', () => {
    const table = fixtureTable({ classes: 'vaadin-table' });
    const header = table.querySelector('thead td, thead th');
    const [firstBody, secondBody] = [...table.querySelectorAll('tbody td')];
    const footer = table.querySelector('tfoot td');

    // The table's own border closes the top and the bottom
    expect(getStyle(header, 'border-top-width')).to.equal('0px');
    expect(getStyle(footer, 'border-bottom-width')).to.equal('0px');

    // A line above every following row, across the section boundaries too
    expect(getStyle(firstBody, 'border-top-width')).to.equal('1px');
    expect(getStyle(firstBody, 'border-top-color')).to.equal(resolveColor('--lumo-contrast-10pct'));
    expect(getStyle(secondBody, 'border-top-width')).to.equal('1px');
    expect(getStyle(footer, 'border-top-width')).to.equal('1px');
  });
});
