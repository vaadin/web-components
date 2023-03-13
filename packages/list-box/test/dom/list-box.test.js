import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox;

  beforeEach(() => {
    listBox = fixtureSync('<vaadin-list-box></vaadin-list-box>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(listBox).dom.to.equalSnapshot();
    });

    it('multiple', async () => {
      listBox.multiple = true;
      await expect(listBox).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(listBox).shadowDom.to.equalSnapshot();
    });
  });
});
