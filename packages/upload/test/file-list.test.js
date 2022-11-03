import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-upload.js';
import { createFiles, removeFile, xhrCreator } from './common.js';

describe('file list', () => {
  let upload;

  const getFileListItems = (upload) => {
    return upload._fileList.querySelectorAll('vaadin-upload-file');
  };

  beforeEach(() => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
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

    removeFile(upload, 1);
    await nextFrame();
    expect(getFileListItems(upload).length).to.equal(1);

    removeFile(upload, 0);
    await nextFrame();
    expect(getFileListItems(upload).length).to.equal(0);
  });

  it('should not overflow content', async () => {
    upload.style.width = '180px';
    upload._addFile(createFiles(1)[0]);
    await nextRender(upload);
    const fileListItem = getFileListItems(upload)[0];
    expect(fileListItem.scrollWidth - fileListItem.offsetWidth).to.equal(0);
  });
});
