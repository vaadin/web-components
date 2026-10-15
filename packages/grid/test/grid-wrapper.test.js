import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid, getBodyCellContent } from './helpers.js';

class GridWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <vaadin-grid id="grid">
        <vaadin-grid-column-group>
          <slot name="group"></slot>
        </vaadin-grid-column-group>
        <slot></slot>
      </vaadin-grid>
    `;
  }
}

customElements.define('grid-wrapper', GridWrapper);

async function initGrid(wrapper) {
  const grid = wrapper.shadowRoot.querySelector('vaadin-grid');
  grid.items = Array.from({ length: 10 }).map((_, i) => ({ name: `Person ${i}` }));
  flushGrid(grid);
  await nextFrame();
  return grid;
}

describe('columns slotted in custom element', () => {
  it('should render column correctly with auto-width defined', async () => {
    const wrapper = fixtureSync(
      '<grid-wrapper><vaadin-grid-column path="name" auto-width></vaadin-grid-column></grid-wrapper>',
    );
    const grid = await initGrid(wrapper);

    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('Person 0');
  });

  it('should render column correctly with auto-width inside a column-group', async () => {
    const wrapper = fixtureSync(
      '<grid-wrapper><vaadin-grid-column slot="group" path="name" auto-width></vaadin-grid-column></grid-wrapper>',
    );
    const grid = await initGrid(wrapper);

    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('Person 0');
  });

  it('should render column correctly when text-align is defined', async () => {
    const wrapper = fixtureSync(
      '<grid-wrapper-delayed><vaadin-grid-column path="name" text-align="end"></vaadin-grid-column></grid-wrapper-delayed>',
    );
    // Delaying the definition of the custom-element so internal <vaadin-grid> is not yet defined
    customElements.define('grid-wrapper-delayed', class extends GridWrapper {});

    const grid = await initGrid(wrapper);

    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('Person 0');
  });
});
