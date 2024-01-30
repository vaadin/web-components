import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import {
  ContextMenu,
  type ContextMenuElement,
  type ContextMenuItem,
  type ContextMenuReactRendererProps,
} from '../packages/react-components/src/ContextMenu.js';
import { Item } from '../packages/react-components/src/Item.js';
import { ListBox } from '../packages/react-components/src/ListBox.js';
import catchRender from './utils/catchRender.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';
import sinon from 'sinon';

useChaiPlugin(chaiDom);

const overlayTag = 'vaadin-context-menu-overlay';
const menuItemTag = 'vaadin-context-menu-item';

async function until(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

async function menuAnimationComplete() {
  await until(() => !document.querySelector(`${overlayTag}[opening]`));
}

async function openContextMenu(target: EventTarget) {
  // Emulate right mouse click
  target.dispatchEvent(new PointerEvent('contextmenu', { bubbles: true }));
  await menuAnimationComplete();
}

async function openSubMenu(parentItem: EventTarget) {
  parentItem.dispatchEvent(new PointerEvent('mouseover', { bubbles: true }));
  await menuAnimationComplete();
}

describe('ContextMenu', () => {
  const [ref, catcher] = createOverlayCloseCatcher<ContextMenuElement>(overlayTag, (ref) => ref.close());

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

    const menu = document.querySelector(overlayTag);
    expect(menu).to.exist;

    await catchRender(menu!, isListBoxRendered);

    expect(menu).to.have.text('Bar');
  }

  afterEach(cleanup);
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

  it('should render the given text as an item', async () => {
    const { container } = render(
      <ContextMenu ref={ref} items={[{ text: 'foo' }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const item = document.querySelector(`${overlayTag} ${menuItemTag}`);
    expect(item?.firstElementChild).not.to.exist;
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement as an item', async () => {
    const { container } = render(
      <ContextMenu ref={ref} items={[{ component: <span>foo</span> }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const item = document.querySelector(`${overlayTag} ${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement in a hierarchical menu as an item', async () => {
    const { container } = render(
      <ContextMenu ref={ref} items={[{ text: 'parent', children: [{ component: <span>foo</span> }] }]}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const rootItem = document.querySelector(`${overlayTag} ${menuItemTag}`)!;
    await openSubMenu(rootItem);

    const item = document.querySelector(`${overlayTag} ${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should have the correct item reference in the item-selected event', async () => {
    const items = [{ text: 'foo' }, { text: 'bar' }];

    const spy = sinon.spy();

    const { container } = render(
      <ContextMenu ref={ref} items={items} onItemSelected={spy}>
        <div id="target">target</div>
      </ContextMenu>,
    );

    const target = container.querySelector<HTMLDivElement>('#target')!;
    await openContextMenu(target);

    const rootItem = document.querySelector<HTMLElement>(`${overlayTag} ${menuItemTag}`)!;
    rootItem.click();

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.equal(items[0]);
  });
});
