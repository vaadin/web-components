import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';

describe('vaadin-iconset lazy upgrade', () => {
  let iconset;

  const ICON = '<path d="M3 4h10l-5 7z"></path>';

  before(() => {
    iconset = document.createElement('vaadin-iconset');
    iconset.name = 'vaadin';
    iconset.size = 16;
    iconset.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id="vaadin:caret-down">${ICON}</g>
        </defs>
      </svg>
    `;
    document.body.appendChild(iconset);
  });

  after(() => {
    iconset.remove();
  });

  it('should use correct name and size set as attributes before upgrade', async () => {
    const icon = fixtureSync('<vaadin-icon icon="vaadin:caret-down"></vaadin-icon>');

    // Import vaadin-icon, which also imports vaadin-iconset internally.
    await import('../src/vaadin-icon.js');

    const svgElement = icon.shadowRoot.querySelector('svg');

    expect(svgElement.querySelector('#svg-group > g').innerHTML).to.equal(ICON);
    expect(svgElement.getAttribute('viewBox')).to.equal('0 0 16 16');
  });
});
