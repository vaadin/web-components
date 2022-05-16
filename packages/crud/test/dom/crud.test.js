import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../vaadin-crud.js';

describe('vaadin-crud', () => {
  let crud;

  beforeEach(async () => {
    crud = fixtureSync('<vaadin-crud></vaadin-crud>');
    crud.items = [
      {
        name: 'John',
        age: 30,
      },
    ];
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(crud).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(crud).shadowDom.to.equalSnapshot();
    });
  });
});
