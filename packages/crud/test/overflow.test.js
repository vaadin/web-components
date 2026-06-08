import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { getDialogEditor } from './helpers.js';

describe('overflow', () => {
  let crud, overlay, content;

  before(async () => {
    // Short viewport so the editor form overflows vertically
    await setViewport({ width: 1024, height: 300 });
  });

  after(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  beforeEach(async () => {
    // Item with many fields produces a tall auto-generated form
    const item = {};
    for (let i = 0; i < 30; i++) {
      item[`field${i}`] = `value ${i}`;
    }

    crud = fixtureSync('<vaadin-crud></vaadin-crud>');
    crud.items = [item];
    crud.editedItem = crud.items[0];
    await nextRender();
    await nextFrame();

    overlay = getDialogEditor(crud).$.overlay;
    content = overlay.$.content;
  });

  it('should set overflow attribute to "bottom" when content overflows', () => {
    expect(overlay.getAttribute('overflow')).to.equal('bottom');
  });

  it('should update overflow attribute to "top bottom" on partial content scroll', async () => {
    content.scrollTop += 200;
    await oneEvent(content, 'scroll');

    expect(overlay.getAttribute('overflow')).to.equal('top bottom');
  });

  it('should update overflow attribute to "top" when content is fully scrolled', async () => {
    content.scrollTop += content.scrollHeight - content.clientHeight;
    await oneEvent(content, 'scroll');

    expect(overlay.getAttribute('overflow')).to.equal('top');
  });
});
