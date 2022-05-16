import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload-file.js';

describe('vaadin-upload-file', () => {
  let uploadFile;

  beforeEach(() => {
    uploadFile = fixtureSync('<vaadin-upload-file></vaadin-upload-file>');
    uploadFile.file = {
      name: 'Workflow.pdf',
      progress: 60,
      status: '19.7 MB: 60% (remaining time: 00:12:34)',
    };
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(uploadFile).shadowDom.to.equalSnapshot();
    });
  });
});
