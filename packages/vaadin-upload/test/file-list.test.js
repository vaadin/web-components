import { expect } from '@esm-bundle/chai';
import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import { createFiles, xhrCreator } from './common.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../vaadin-upload.js';

describe('file list', () => {
  let upload;

  const getFileListItems = (upload) => {
    return upload.$.fileList.querySelectorAll('vaadin-upload-file');
  };

  beforeEach(async () => {
    upload = await fixture(html`<vaadin-upload></vaadin-upload>`);
    upload._createXhr = xhrCreator();
  });

  it('should render files', async () => {
    expect(getFileListItems(upload)).to.be.empty;

    const files = createFiles(2);
    files.forEach((file) => upload._addFile(file));
    await nextFrame();

    const fileListItems = getFileListItems(upload);
    expect(fileListItems.length).to.equal(2);
    expect(fileListItems[0]).to.be.ok;
    expect(fileListItems[0]).to.have.property('file', files[1]);
    expect(fileListItems[1]).to.be.ok;
    expect(fileListItems[1]).to.have.property('file', files[0]);
  });

  it('should remove files', async () => {
    const files = createFiles(2);
    files.forEach((file) => upload._addFile(file));
    await nextFrame();

    const clearButton1 = getFileListItems(upload)[0].shadowRoot.querySelector('[part="clear-button"]');
    clearButton1.click();
    await nextFrame();
    expect(getFileListItems(upload).length).to.equal(1);

    const clearButton2 = getFileListItems(upload)[0].shadowRoot.querySelector('[part="clear-button"]');
    clearButton2.click();
    await nextFrame();
    expect(getFileListItems(upload).length).to.equal(0);
  });

  it('should not overflow content', (done) => {
    upload.style.width = '150px';
    upload._addFile(createFiles(1)[0]);
    afterNextRender(upload, () => {
      const fileListItem = getFileListItems(upload)[0];
      expect(fileListItem.scrollWidth).to.equal(fileListItem.offsetWidth);
      done();
    });
  });
});
