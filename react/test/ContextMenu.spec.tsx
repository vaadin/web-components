import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  ContextMenu,
  type ContextMenuItem,
  type ContextMenuReactRendererProps,
} from '../packages/react-components/src/ContextMenu.js';
import { Item } from '../packages/react-components/src/Item.js';
import { ListBox } from '../packages/react-components/src/ListBox.js';
import catchRender from './utils/catchRender.js';
import { nextRender } from './utils/nextRender.js';
import sinon from 'sinon';

const menuTag = 'vaadin-context-menu';
const menuItemTag = 'vaadin-context-menu-item';

async function overlayOpened(): Promise<void> {
  return new Promise((resolve) => {
    document.addEventListener(
      'vaadin-overlay-open',
      () => {
        resolve();
      },
      { once: true },
    );
  });
}

async function openContextMenu(target: EventTarget) {
  // Emulate right mouse click
  target.dispatchEvent(new PointerEvent('contextmenu', { bubbles: true }));
  await overlayOpened();
  await nextRender();
}

async function openSubMenu(parentItem: EventTarget) {
  parentItem.dispatchEvent(new PointerEvent('mouseover', { bubbles: true }));
  await overlayOpened();
  await nextRender();
}

describe('ContextMenu', () => {
  const items: Array<ContextMenuItem> = [{ text: 'Bar' }];

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
    await openContextMenu(container);

    const menu = container.closest(menuTag);
    expect(menu).to.exist;

    await catchRender(menu!, isListBoxRendered);

    const content = menu!.querySelector('[slot="overlay"]');
    expect(content).to.have.text('Bar');
  }

  it('should use children if no renderer property set', async () => {
    const { container } = render(
      <ContextMenu items={items}>
        <div id="actor">Foo</div>
      </ContextMenu>,
    );

    await assert(container.querySelector<HTMLDivElement>('#actor')!);
  });

  it('should use renderer property if set', async () => {
    const { container } = render(
      <ContextMenu renderer={Renderer}>
        <div id="actor">Bar</div>
      </ContextMenu>,
    );

    await assert(container.querySelector<HTMLDivElement>('#actor')!);
  });

  it('should render the given text as an item', async () => {
    const { container } = render(
      <ContextMenu items={[{ text: 'foo' }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const item = document.querySelector(`${menuTag} ${menuItemTag}`);
    expect(item?.firstElementChild).not.to.exist;
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement as an item', async () => {
    const { container } = render(
      <ContextMenu items={[{ component: <span>foo</span> }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const item = document.querySelector(`${menuTag} ${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement in a hierarchical menu as an item', async () => {
    const { container } = render(
      <ContextMenu items={[{ text: 'parent', children: [{ component: <span>foo</span> }] }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const rootItem = document.querySelector(`${menuTag} ${menuItemTag}`)!;
    await openSubMenu(rootItem);

    const item = document.querySelector(`${menuTag} ${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should have the correct item reference in the item-selected event', async () => {
    const items = [{ text: 'foo' }, { text: 'bar' }];

    const spy = sinon.spy();

    const { container } = render(
      <ContextMenu items={items} onItemSelected={spy}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const rootItem = document.querySelector<HTMLElement>(`${menuTag} ${menuItemTag}`)!;
    rootItem.click();

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.equal(items[0]);
  });
});
