import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import '../vaadin-grid-column.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { flushGrid } from './helpers.js';

class GridWrapper extends PolymerElement {
  static get template() {
    return html`
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

describe('columns slotted in custom element', () => {
  let spy;
  beforeEach(() => {
    spy = sinon.spy(console, 'error');
  });

  afterEach(() => {
    spy.restore();
  });

  it('should not throw if column with auto-width is defined', () => {
    fixtureSync('<grid-wrapper><vaadin-grid-column path="name" auto-width></vaadin-grid-column></grid-wrapper>');

    expect(spy.called).to.be.false;
  });

  it('should not throw if column inside group with auto-width is defined', () => {
    fixtureSync(
      '<grid-wrapper><vaadin-grid-column slot="group" path="name" auto-width></vaadin-grid-column></grid-wrapper>',
    );
    expect(spy.called).to.be.false;
  });

  it('should not throw if column with text-align is defined', () => {
    fixtureSync(
      '<grid-wrapper-delayed><vaadin-grid-column text-align="end"></vaadin-grid-column></grid-wrapper-delayed>',
    );
    // Delaying the definition of the custom-element so internal <vaadin-grid> is not yet defined
    customElements.define('grid-wrapper-delayed', class extends GridWrapper {});
    expect(spy.called).to.be.false;
  });
});
