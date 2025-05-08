import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  MultiSelectComboBox,
  type MultiSelectComboBoxElement,
} from '../packages/react-components/src/MultiSelectComboBox.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';
import sinon from 'sinon';

describe('MultiSelectComboBox', () => {
  const overlayTag = 'vaadin-multi-select-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<MultiSelectComboBoxElement>(
    overlayTag,
    (ref) => (ref.opened = false),
  );

  afterEach(catcher);

  it('should render correctly', () => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const selectedItemsChangedSpy = sinon.spy();

    const { container } = render(
      <MultiSelectComboBox<Item>
        ref={ref}
        items={items}
        opened
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemsChanged={selectedItemsChangedSpy}
      />,
    );

    const comboBox = container.querySelector('vaadin-multi-select-combo-box');
    expect(comboBox).to.exist;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).to.exist;

    const bar = comboBoxOverlay!.querySelector('vaadin-multi-select-combo-box-item:nth-child(2)');
    expect(bar).to.exist;

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    expect(selectedItemsChangedSpy.calledOnce).to.be.true;
    const event = selectedItemsChangedSpy.getCall(0).args[0] as CustomEvent;
    expect(event.detail.value[0].value).to.equal('bar');
    expect(event.detail.value[0].index).to.equal(1);
  });
});
