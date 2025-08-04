import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { MultiSelectComboBox } from '../packages/react-components/src/MultiSelectComboBox.js';
import sinon from 'sinon';

describe('MultiSelectComboBox', () => {
  const overlayTag = 'vaadin-multi-select-combo-box-overlay';

  it('should render correctly', () => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const selectedItemsChangedSpy = sinon.spy();

    const { container } = render(
      <MultiSelectComboBox<Item>
        items={items}
        opened
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemsChanged={selectedItemsChangedSpy}
      />,
    );

    const comboBox = container.querySelector('vaadin-multi-select-combo-box');
    expect(comboBox).to.exist;

    const bar = comboBox!.querySelector('vaadin-multi-select-combo-box-item:nth-child(2)');
    expect(bar).to.exist;

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    expect(selectedItemsChangedSpy.calledOnce).to.be.true;
    const event = selectedItemsChangedSpy.getCall(0).args[0] as CustomEvent;
    expect(event.detail.value[0].value).to.equal('bar');
    expect(event.detail.value[0].index).to.equal(1);
  });
});
