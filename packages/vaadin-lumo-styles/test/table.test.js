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

function fixtureTable({ classes = '', theme = '' } = {}) {
  return fixtureSync(`
    <table class="${classes}" theme="${theme}">
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

  it('should style cells only when the table has the vaadin-table class', () => {
    const styled = fixtureTable({ classes: 'vaadin-table' }).querySelector('td');
    const plain = fixtureTable().querySelector('td');

    expect(getStyle(styled, 'padding')).to.equal('4px 16px');
    expect(getStyle(styled, 'border-bottom-width')).to.equal('1px');

    expect(getStyle(plain, 'padding')).to.equal('1px');
    expect(getStyle(plain, 'border-bottom-width')).to.equal('0px');
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

  it('should tint every other body row with theme="row-stripes"', () => {
    const rows = fixtureTable({ classes: 'vaadin-table', theme: 'row-stripes' }).querySelectorAll('tbody td');

    expect(getStyle(rows[0], 'background-color')).to.equal('rgba(0, 0, 0, 0)');
    expect(getStyle(rows[1], 'background-color')).to.equal(resolveColor('--lumo-contrast-5pct'));
  });

  it('should separate columns but not the last one with theme="column-borders"', () => {
    const cells = fixtureTable({ classes: 'vaadin-table', theme: 'column-borders' }).querySelectorAll(
      'tbody th, tbody td',
    );

    expect(getStyle(cells[0], 'border-inline-end-width')).to.equal('1px');
    expect(getStyle(cells[1], 'border-inline-end-width')).to.equal('0px');
  });
});
