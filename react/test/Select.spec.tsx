import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import type { ReactElement } from 'react';
import { ListBox } from '../src/ListBox.js';
import { Item } from '../src/Item.js';
import { Select, type WebComponentModule } from '../src/Select.js';
import catchRender from './utils/catchRender.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('Select', () => {
  const overlayTag = 'vaadin-select-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.Select>(overlayTag, (ref) => {
    ref.opened = false;
  });

  const items = [
    { label: 'Foo', value: 'foo' },
    { label: 'Bar', value: 'bar' },
  ];

  function Renderer(): ReactElement {
    return (
      <ListBox>
        <Item value="foo">Foo</Item>
        <Item value="bar">Bar</Item>
      </ListBox>
    );
  }

  function isListBoxRendered(node: Node) {
    return node instanceof HTMLElement && node.localName.includes('list-box');
  }

  async function assert(container: HTMLElement) {
    const select = container.querySelector('vaadin-select');
    expect(select).to.exist;

    const valueButton = select!.querySelector('vaadin-select-value-button');
    expect(valueButton).to.exist;

    valueButton!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    const overlay = document.querySelector('vaadin-select-overlay');
    expect(overlay).to.exist;

    await catchRender(overlay!, isListBoxRendered);

    expect(overlay).to.have.text('FooBar');
  }

  afterEach(cleanup);
  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    const { container } = render(<Select ref={ref} items={items} value="bar" />);
    await assert(container);
  });

  it('should use renderer prop if it is set', async () => {
    const { container } = render(<Select ref={ref} items={items} renderer={Renderer} value="bar" />);
    await assert(container);
  });

  it('should use children render function as a renderer prop', async () => {
    const { container } = render(
      <Select ref={ref} value="bar">
        {Renderer}
      </Select>,
    );

    await assert(container);
  });
});
