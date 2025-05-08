import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Popover, type PopoverElement } from '../packages/react-components/src/Popover.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

describe('Popover', () => {
  const overlayTag = 'vaadin-popover-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<PopoverElement>(overlayTag, (ref) => {
    ref.opened = false;
  });

  async function assert() {
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const overlay = document.querySelector(overlayTag);
    expect(overlay).to.exist;

    const childNodes = Array.from(overlay!.childNodes);

    const body = childNodes.find((node) => node.nodeType === Node.TEXT_NODE);
    expect(body).to.have.text('FooBar');
  }

  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    render(
      <Popover ref={ref} opened>
        FooBar
      </Popover>,
    );

    await assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(<Popover ref={ref} opened renderer={() => <>FooBar</>}></Popover>);

    await assert();
  });

  it('should use children as renderer prop', async () => {
    render(
      <Popover ref={ref} opened>
        {() => <>FooBar</>}
      </Popover>,
    );

    await assert();
  });
});
