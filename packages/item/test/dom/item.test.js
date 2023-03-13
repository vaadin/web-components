import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-item.js';

describe('vaadin-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-item></vaadin-item>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(item).dom.to.equalSnapshot();
    });

    it('selected', async () => {
      item.selected = true;
      await expect(item).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item.disabled = true;
      await expect(item).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});
