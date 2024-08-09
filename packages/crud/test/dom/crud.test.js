import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { setViewport } from '@web/test-runner-commands';
import '../../vaadin-crud.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-crud', () => {
  let crud;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  beforeEach(async () => {
    resetUniqueId();
    crud = fixtureSync('<vaadin-crud></vaadin-crud>');
    crud.items = [
      {
        name: 'John',
        age: 30,
      },
    ];
    await nextRender();
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
