import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload.js';

describe('vaadin-upload', () => {
  let upload;

  beforeEach(async () => {
    upload = fixtureSync('<vaadin-upload></vaadin-upload>');
    upload.files = [
      { name: 'Annual Report.docx', complete: true },
      {
        name: 'Workflow.pdf',
        progress: 60,
        status: '19.7 MB: 60% (remaining time: 00:12:34)',
      },
      { name: 'Financials.xlsx', error: 'An error occurred' },
    ];
    await nextFrame();
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(upload).shadowDom.to.equalSnapshot();
    });
  });
});
