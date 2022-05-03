import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-combo-box.js';
import { html, render } from 'lit';
import { comboBoxRenderer } from '../lit.js';
import { getAllItems } from './helpers.js';

async function renderComboBox(container, { items }) {
  render(
    html`<vaadin-combo-box
      .items="${items}"
      ${items ? comboBoxRenderer((item) => html`${item}`, items) : null}
    ></vaadin-combo-box>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-combo-box');
}

describe('lit renderer directives', () => {
  let container, comboBox;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('comboBoxRenderer', () => {
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
        const items = getAllItems(comboBox);
        expect(items[0].textContent).to.equal('Item');
      });

      it('should re-render items when the combo-box is opened and a renderer dependency changes', async () => {
        comboBox.opened = true;
        await renderComboBox(container, { items: ['New Item'] });
        const items = getAllItems(comboBox);
        expect(items[0].textContent).to.equal('New Item');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-combo-box opened .items="${['Item']}" ${comboBoxRenderer(rendererSpy)}></vaadin-combo-box>`,
          container,
        );
        await nextFrame();
        comboBox = container.querySelector('vaadin-combo-box');
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
