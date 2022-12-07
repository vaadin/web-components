import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { Dialog, type WebComponentModule } from '../src/Dialog.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('Dialog', () => {
  const overlayTag = 'vaadin-dialog-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.Dialog>(overlayTag, (ref) => {
    ref.opened = false;
  });

  function assert() {
    const dialog = document.querySelector(overlayTag);
    expect(dialog).to.exist;

    const [header, footer, body] = Array.from(dialog!.childNodes);

    expect(header).to.exist;
    expect(header).to.have.text('Title');

    expect(footer).to.exist;
    expect(footer).to.have.text('Footer');

    expect(body).to.exist;
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
});
