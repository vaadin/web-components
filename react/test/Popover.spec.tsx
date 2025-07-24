import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Popover, type PopoverElement } from '../packages/react-components/src/Popover.js';

describe('Popover', () => {
  async function assert(popover: PopoverElement) {
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const childNodes = Array.from(popover.childNodes);

    const body = childNodes.find((node) => node.nodeType === Node.TEXT_NODE);
    expect(body).to.have.text('FooBar');
  }

  it('should use children if no renderer property set', async () => {
    render(<Popover opened>FooBar</Popover>);

    await assert(document.querySelector('vaadin-popover') as PopoverElement);
  });

  it('should use renderer prop if it is set', async () => {
    render(<Popover opened renderer={() => <>FooBar</>}></Popover>);

    await assert(document.querySelector('vaadin-popover') as PopoverElement);
  });

  it('should use children as renderer prop', async () => {
    render(<Popover opened>{() => <>FooBar</>}</Popover>);

    await assert(document.querySelector('vaadin-popover') as PopoverElement);
  });
});
