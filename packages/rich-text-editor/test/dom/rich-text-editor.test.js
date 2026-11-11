import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-rich-text-editor.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-rich-text-editor', () => {
  let rte;

  beforeEach(async () => {
    resetUniqueId();
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    await nextRender();
  });

  it('host', async () => {
    await expect(rte).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(rte).shadowDom.to.equalSnapshot();
  });
});
