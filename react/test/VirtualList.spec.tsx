import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { VirtualList, type VirtualListReactRendererProps } from '../src/VirtualList.js';

describe('VirtualList', () => {
  type Item = Readonly<{ value: string; index: number }>;

  const items: Item[] = [
    { value: 'Foo', index: 0 },
    { value: 'Bar', index: 1 },
  ];

  function Renderer({ item }: VirtualListReactRendererProps<Item>) {
    return <>{item.value}</>;
  }

  function assert() {
    const list = document.querySelector('vaadin-virtual-list');
    expect(list).not.to.be.undefined;
    expect(list!.textContent).to.equal('FooBar');
  }

  it('should use renderer prop if it is set', async () => {
    render(<VirtualList items={items} renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(<VirtualList items={items}>{Renderer}</VirtualList>);
    assert();
  });
});
