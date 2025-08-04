import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { ComboBox } from '../packages/react-components/src/ComboBox.js';
import sinon from 'sinon';

describe('ComboBox', () => {
  it('should render correctly', () => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const selectedItemsChangedSpy = sinon.spy();

    const { container } = render(
      <ComboBox<Item>
        items={items}
        opened
        itemLabelPath="value"
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemChanged={selectedItemsChangedSpy}
      />,
    );

    const comboBox = container.querySelector('vaadin-combo-box');
    expect(comboBox).to.exist;

    const bar = comboBox!.querySelector('vaadin-combo-box-item:nth-child(2)');
    expect(bar).to.exist;

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    expect(selectedItemsChangedSpy.calledOnce).to.be.true;
    const event = selectedItemsChangedSpy.getCall(0).args[0] as CustomEvent;
    expect(event.detail.value?.value).to.equal('bar');
    expect(event.detail.value?.index).to.equal(1);
  });
});
