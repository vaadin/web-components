import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { MenuBar } from '../src/MenuBar.js';

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
});
