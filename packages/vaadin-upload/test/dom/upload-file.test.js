import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload-file.js';

describe('vaadin-upload-file', () => {
  let file;

  beforeEach(() => {
    file = fixtureSync('<vaadin-upload-file></vaadin-upload-file>');
  });

  it('default', async () => {
    await expect(file).shadowDom.to.equalSnapshot();
  });
});
