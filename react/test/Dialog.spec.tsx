import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Dialog, type WebComponentModule } from '../src/Dialog.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

describe('Dialog', () => {
  const overlayTag = 'vaadin-dialog-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.Dialog>(overlayTag, (ref) => {
    ref.opened = false;
  });

  function assert() {
    const dialog = document.querySelector(overlayTag);
    expect(dialog).not.to.be.undefined;

    const [header, footer, body] = Array.from(dialog!.childNodes);

    expect(header).not.to.be.undefined;
    expect(header!.textContent).to.equal('Title');

    expect(footer).not.to.be.undefined;
    expect(footer!.textContent).to.equal('Footer');

    expect(body).not.to.be.undefined;
    expect(body!.textContent).to.equal('FooBar');
  }

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
});
