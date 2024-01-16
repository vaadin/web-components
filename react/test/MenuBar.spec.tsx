import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { MenuBar, MenuBarElement } from '../src/MenuBar.js';
import sinon from 'sinon';

useChaiPlugin(chaiDom);

const overlayTag = 'vaadin-menu-bar-overlay';
const menuItemTag = 'vaadin-menu-bar-item';
const menuButtonTag = 'vaadin-menu-bar-button';

async function until(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

async function menuAnimationComplete() {
  await new Promise((r) => requestAnimationFrame(r));
  await until(
    () => !document.querySelector(`${overlayTag}[opening]`) && !!document.querySelector(`${overlayTag}[opened]`),
  );
}

async function openRootItemSubMenu(rootMenuItem: EventTarget) {
  rootMenuItem.dispatchEvent(new PointerEvent('click', { bubbles: true }));
  await menuAnimationComplete();
}

describe('MenuBar', () => {
  it('should render the given text as an item', async () => {
    const { container } = render(<MenuBar items={[{ text: 'foo' }]} />);

    const menuBar = container.querySelector<HTMLDivElement>('vaadin-menu-bar')!;

    const item = menuBar.querySelector(menuButtonTag);
    expect(item?.firstElementChild).not.to.exist;
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement as an item', async () => {
    const { container } = render(<MenuBar items={[{ component: <span>foo</span> }]} />);

    const menuBar = container.querySelector<HTMLDivElement>('vaadin-menu-bar')!;

    const item = menuBar.querySelector(`${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should render the given ReactElement in a hierarchical menu as an item', async () => {
    const { container } = render(
      <MenuBar items={[{ text: 'parent', children: [{ component: <span>foo</span> }] }]}></MenuBar>,
    );

    const menuBar = container.querySelector<HTMLDivElement>('vaadin-menu-bar')!;

    const rootItem = menuBar.querySelector(menuButtonTag)!;
    await openRootItemSubMenu(rootItem);

    const item = document.querySelector(`${overlayTag} ${menuItemTag} > span`);
    expect(item).to.have.text('foo');
  });

  it('should have the correct item reference in the item-selected event', async () => {
    const items = [{ text: 'foo' }, { component: <b>bar</b> }];

    const spy = sinon.spy();
    const { container } = render(<MenuBar items={items} onItemSelected={spy}></MenuBar>);

    const menuBar = container.querySelector<MenuBarElement>('vaadin-menu-bar')!;

    const rootItems = Array.from(menuBar.querySelectorAll<HTMLElement>(menuButtonTag));
    rootItems[0].click();
    rootItems[1].click();

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.equal(items[0]);
    expect(spy.secondCall.args[0].detail.value).to.equal(items[1]);
  });
});
