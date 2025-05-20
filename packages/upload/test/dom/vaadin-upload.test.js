import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
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

  describe('host', () => {
    const SNAPSHOT_CONFIG = {
      // Exclude inline style as we are not testing
      // the `vaadin-progress-bar` internal logic.
      ignoreAttributes: ['style'],
    };

    it('default', async () => {
      await expect(upload).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('max files', async () => {
      upload.maxFiles = 1;
      await nextUpdate(upload);
      await expect(upload).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('disabled', async () => {
      upload.disabled = true;
      await nextUpdate(upload);
      await expect(upload).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(upload).shadowDom.to.equalSnapshot();
    });
  });
});
