import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload-file.js';

describe('vaadin-upload-file', () => {
  let uploadFile;

  beforeEach(() => {
    uploadFile = fixtureSync('<vaadin-upload-file></vaadin-upload-file>');

    const name = 'Workflow.pdf';
    const progress = 60;
    const status = '19.7 MB: 60% (remaining time: 00:12:34)';

    uploadFile.file = { name, progress, status };
    uploadFile.fileName = name;
    uploadFile.progress = progress;
    uploadFile.status = status;
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(uploadFile).shadowDom.to.equalSnapshot();
    });
  });
});
