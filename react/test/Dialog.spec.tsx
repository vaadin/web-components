import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import sinon from 'sinon';
import { Dialog } from '../packages/react-components/src/Dialog.js';
import { nextRender } from './utils/nextRender.js';
import { useState } from 'react';

describe('Dialog', () => {
  const dialogTag = 'vaadin-dialog';

  function assert() {
    const dialog = document.querySelector(dialogTag);
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

  it('should use children if no renderer property set', async () => {
    render(
      <Dialog opened header={<>Title</>} footer={<>Footer</>}>
        FooBar
      </Dialog>,
    );
    await nextRender();
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(
      <Dialog
        opened
        headerRenderer={() => <>Title</>}
        footerRenderer={() => <>Footer</>}
        renderer={() => <>FooBar</>}
      ></Dialog>,
    );
    await nextRender();
    assert();
  });

  it('should use children as renderer prop', async () => {
    render(
      <Dialog opened headerRenderer={() => <>Title</>} footerRenderer={() => <>Footer</>}>
        {() => <>FooBar</>}
      </Dialog>,
    );
    await nextRender();
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
    await nextRender();

    const warn = sinon.stub(console, 'error');
    document.querySelector<HTMLButtonElement>('#open-button')?.click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    warn.restore();

    expect(warn.called).to.be.false;
  });
});
