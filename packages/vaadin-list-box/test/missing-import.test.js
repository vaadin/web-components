import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-list-box.js';

describe('missing import', () => {
  let listBox;

  beforeEach(() => {
    listBox = fixtureSync(`
      <vaadin-list-box>
        <vaadin-item>Foo</vaadin-item>
        <vaadin-item>Bar</vaadin-item>
      </vaadin-list-box>
    `);

    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  it('should warn if vaadin-item is not imported', () => {
    // Emulate setTimeout run from ready
    listBox._checkImport();
    expect(console.warn.callCount).to.equal(1);
  });

  it('should not warn after vaadin-item is imported', async () => {
    await import('@vaadin/vaadin-item/vaadin-item.js');
    listBox._checkImport();
    expect(console.warn.called).to.be.false;
  });
});
