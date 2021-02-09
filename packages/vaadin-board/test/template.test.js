import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import '@polymer/polymer/lib/elements/dom-bind.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '../vaadin-board.js';

describe('template', () => {
  let bind, board;

  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  describe('dom-if', () => {
    beforeEach(() => {
      board = fixtureSync(`
        <dom-bind>
          <template>
            <vaadin-board>
              <vaadin-board-row>
                <template is="dom-if" if="[[show]]">
                  <div>Foo</div>
                  <div>Bar</div>
                  <div>Baz</div>
                  <div>Bax</div>
                </template>
              </vaadin-board-row>
            </vaadin-board>
          </template>
        </dom-bind>
      `);
      bind = document.querySelector('dom-bind');
    });

    it('should not include dom-if template to the board elements', async () => {
      bind.show = true;
      board.querySelector('dom-if').render();
      await aTimeout(0);
      expect(console.warn.called).to.be.false;
    });
  });

  describe('dom-repeat', () => {
    beforeEach(() => {
      board = fixtureSync(`
        <dom-bind>
          <template>
            <vaadin-board>
              <vaadin-board-row>
                <dom-repeat items="[[items]]">
                  <template>
                    <div>[[item]]</div>
                  </template>
                </dom-repeat>
              </vaadin-board-row>
            </vaadin-board>
          </template>
        </dom-bind>
      `);
      bind = document.querySelector('dom-bind');
    });

    it('should not include dom-repeat template to the board elements', async () => {
      bind.items = ['Foo', 'Bar', 'Baz', 'Qux'];
      board.querySelector('dom-repeat').render();
      await aTimeout(0);
      expect(console.warn.called).to.be.false;
    });
  });
});
