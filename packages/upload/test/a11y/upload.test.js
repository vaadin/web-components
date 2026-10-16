import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-upload.js';
import '../../src/vaadin-upload-button.js';
import '../../src/vaadin-upload-drop-zone.js';
import '../../src/vaadin-upload-file-list.js';
import { UploadManager } from '../../src/vaadin-upload-manager.js';

// Known issue: the progress bar of a file in progress or queued has no accessible name.
const AXE_OPTIONS = { expectedViolations: ['aria-progressbar-name'] };

describe('vaadin-upload', () => {
  let upload;

  beforeEach(async () => {
    upload = fixtureSync('<vaadin-upload></vaadin-upload>');
    await nextFrame();
  });

  it('default', async () => {
    await expect(upload).to.equalA11yTreeSnapshot();
    await expect(upload).to.be.accessible();
  });

  it('files', async () => {
    upload.files = [
      { name: 'Annual Report.docx', complete: true },
      { name: 'Workflow.pdf', progress: 60, status: '19.7 MB: 60% (remaining time: 00:12:34)' },
      { name: 'Financials.xlsx', error: 'An error occurred' },
      { name: 'Notes.txt', held: true, status: 'Queued' },
    ];
    await nextFrame();
    await expect(upload).to.equalA11yTreeSnapshot();
    await expect(upload).to.be.accessible(AXE_OPTIONS);
  });

  it('max files reached', async () => {
    upload.maxFiles = 1;
    upload.files = [{ name: 'Annual Report.docx', complete: true }];
    await nextFrame();
    await expect(upload).to.equalA11yTreeSnapshot();
    await expect(upload).to.be.accessible();
  });

  it('disabled', async () => {
    upload.files = [{ name: 'Annual Report.docx', complete: true }];
    upload.disabled = true;
    await nextUpdate(upload);
    await expect(upload).to.equalA11yTreeSnapshot();
    await expect(upload).to.be.accessible();
  });

  // The drop label is hidden from assistive technologies on purpose,
  // so the tree is the same as without drop support.
  it('no drop', async () => {
    upload.nodrop = true;
    await nextUpdate(upload);
    await expect(upload).to.equalA11yTreeSnapshot();
    await expect(upload).to.be.accessible();
  });
});

describe('upload components with manager', () => {
  let wrapper, manager;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-upload-drop-zone>
          <vaadin-upload-button>Add files</vaadin-upload-button>
          <span>or drop files here</span>
        </vaadin-upload-drop-zone>
        <vaadin-upload-file-list></vaadin-upload-file-list>
      </div>
    `);
    manager = new UploadManager({ target: '/api/upload', noAuto: true });
    wrapper.querySelectorAll('vaadin-upload-drop-zone, vaadin-upload-button, vaadin-upload-file-list').forEach((el) => {
      el.manager = manager;
    });
    await nextRender();
  });

  it('default', async () => {
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('files', async () => {
    manager.addFiles([new File(['abc'], 'Report.pdf', { type: 'application/pdf' })]);
    await nextRender();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible(AXE_OPTIONS);
  });

  it('no manager', async () => {
    wrapper.querySelector('vaadin-upload-button').manager = null;
    await nextRender();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });
});
