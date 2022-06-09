import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';
import { html, render } from 'lit';
import { multiSelectComboBoxRenderer } from '../lit.js';

async function renderComboBox(container, { items }) {
  render(
    html`
      <vaadin-multi-select-combo-box
        .items="${items}"
        ${items ? multiSelectComboBoxRenderer((item) => html`${item}`, items) : null}
      ></vaadin-multi-select-combo-box>
    `,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-multi-select-combo-box');
}

describe('lit renderer directives', () => {
  let container, comboBox;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('multiSelectComboBoxRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        comboBox = await renderComboBox(container, { items: ['Item'] });
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(comboBox.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderComboBox(container, {});
        expect(comboBox.renderer).not.to.exist;
      });

      it('should render items with the renderer when the combo-box is opened', () => {
        comboBox.opened = true;
        const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
        expect(items[0].textContent).to.equal('Item');
      });

      it('should re-render items when the combo-box is opened and a renderer dependency changes', async () => {
        comboBox.opened = true;
        await renderComboBox(container, { items: ['New Item'] });
        const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
        expect(items[0].textContent).to.equal('New Item');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`
            <vaadin-multi-select-combo-box
              opened
              .items="${['Item']}"
              ${multiSelectComboBoxRenderer(rendererSpy)}
            ></vaadin-multi-select-combo-box>
          `,
          container,
        );
        await nextFrame();
        comboBox = container.querySelector('vaadin-multi-select-combo-box');
      });

      it('should pass the item to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal('Item');
      });

      it('should pass the model to the renderer', () => {
        expect(rendererSpy.firstCall.args[1]).to.deep.equal({
          item: 'Item',
          index: 0,
          focused: false,
          selected: false,
        });
      });

      it('should pass the combo-box instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[2]).to.equal(comboBox);
      });
    });
  });
});
