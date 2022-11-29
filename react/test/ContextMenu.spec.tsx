import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import chaiDom from 'chai-dom';
import { ContextMenu, type ContextMenuReactRendererProps, type WebComponentModule } from '../src/ContextMenu.js';
import { Item } from '../src/Item.js';
import { ListBox } from '../src/ListBox.js';
import catchRender from './utils/catchRender.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('ContextMenu', () => {
  const overlayTag = 'vaadin-context-menu-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.ContextMenu>(overlayTag, (ref) => ref.close());

  const items: WebComponentModule.ContextMenuItem[] = [{ text: 'Bar' }];

  function Renderer({ context }: ContextMenuReactRendererProps) {
    return (
      <ListBox>
        <Item>{context.target.textContent}</Item>
      </ListBox>
    );
  }

  function isListBoxRendered(node: Node) {
    return node instanceof HTMLElement && node.localName.includes('list-box');
  }

  async function assert(container: HTMLDivElement) {
    // Emulate right mouse click
    container.dispatchEvent(new PointerEvent('contextmenu', { bubbles: true }));

    const menu = document.querySelector(overlayTag);
    expect(menu).to.exist;

    await catchRender(menu!, isListBoxRendered);

    expect(menu).to.have.text('Bar');
  }

  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    const { container } = render(
      <ContextMenu ref={ref} items={items}>
        <div id="actor">Foo</div>
      </ContextMenu>,
    );

    await assert(container.querySelector<HTMLDivElement>('#actor')!);
  });

  it('should use renderer property if set', async () => {
    const { container } = render(
      <ContextMenu ref={ref} renderer={Renderer}>
        <div id="actor">Bar</div>
      </ContextMenu>,
    );

    await assert(container.querySelector<HTMLDivElement>('#actor')!);
  });
});
