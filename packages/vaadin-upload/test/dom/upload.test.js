import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload.js';

describe('vaadin-upload', () => {
  let upload;

  beforeEach(() => {
    upload = fixtureSync('<vaadin-upload></vaadin-upload>');
  });

  it('default', async () => {
    await expect(upload).shadowDom.to.equalSnapshot();
  });
});
