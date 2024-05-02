import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import sinon from 'sinon';
import { Dialog, type DialogElement } from '../packages/react-components/src/Dialog.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';
import { useState } from 'react';

useChaiPlugin(chaiDom);

describe('Dialog', () => {
  const overlayTag = 'vaadin-dialog-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<DialogElement>(overlayTag, (ref) => {
    ref.opened = false;
  });

  function assert() {
    const dialog = document.querySelector(overlayTag);
    expect(dialog).to.exist;

    const childNodes = Array.from(dialog!.childNodes);

    const header = childNodes.find(
      (node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === 'header-content',
    );
    expect(header).to.exist;
    expect(header).to.have.text('Title');

    const footer = childNodes.find(
      (node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === 'footer',
    );
    expect(footer).to.have.text('Footer');

    const body = childNodes.find((node) => node.nodeType === Node.TEXT_NODE);
    expect(body).to.have.text('FooBar');
  }

  afterEach(cleanup);
  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    render(
      <Dialog ref={ref} opened header={<>Title</>} footer={<>Footer</>}>
        FooBar
      </Dialog>,
    );
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(
      <Dialog
        ref={ref}
        opened
        headerRenderer={() => <>Title</>}
        footerRenderer={() => <>Footer</>}
        renderer={() => <>FooBar</>}
      ></Dialog>,
    );
    assert();
  });

  it('should use children as renderer prop', async () => {
    render(
      <Dialog ref={ref} opened headerRenderer={() => <>Title</>} footerRenderer={() => <>Footer</>}>
        {() => <>FooBar</>}
      </Dialog>,
    );
    assert();
  });

  it('should not warn on open', async () => {
    function TestDialog() {
      const [opened, setOpened] = useState(false);
      return (
        <>
          <button id="open-button" onClick={() => setOpened(true)}>
            Open
          </button>
          <Dialog opened={opened}>FooBar</Dialog>
        </>
      );
    }

    render(<TestDialog />);

    const warn = sinon.stub(console, 'error');
    document.querySelector<HTMLButtonElement>('#open-button')?.click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    warn.restore();

    expect(warn.called).to.be.false;
  });
});
