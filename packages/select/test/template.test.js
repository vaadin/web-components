import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import '../vaadin-select.js';

describe('template', () => {
  let select, overlay, listBox;

  beforeEach(() => {
    select = fixtureSync(`
      <vaadin-select>
        <template>
          <vaadin-list-box>
            <vaadin-item>item</vaadin-item>
          </vaadin-list-box>
        </template>
      </vaadin-select>
    `);

    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    listBox = overlay.querySelector('vaadin-list-box');

    select.opened = true;
  });

  it('should render the template', () => {
    expect(listBox.textContent.trim()).to.equal('item');
  });
});
