import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { ComboBoxLight, type ComboBoxLightElement } from '../packages/react-components/src/ComboBoxLight.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';
import sinon from 'sinon';

describe('ComboBoxLight', () => {
  const overlayTag = 'vaadin-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<ComboBoxLightElement>(overlayTag, (ref) => ref.close());

  afterEach(catcher);

  it('should render correctly', () => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const selectedItemsChangedSpy = sinon.spy();

    const { container } = render(
      <ComboBoxLight<Item>
        ref={ref}
        items={items}
        opened
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemChanged={selectedItemsChangedSpy}
      />,
    );

    const comboBox = container.querySelector('vaadin-combo-box-light');
    expect(comboBox).to.exist;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).to.exist;

    const bar = comboBoxOverlay!.querySelector('vaadin-combo-box-item:nth-child(2)');
    expect(bar).to.exist;
    expect(bar).to.have.text('bar');

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    expect(selectedItemsChangedSpy.calledOnce).to.be.true;
    const event = selectedItemsChangedSpy.getCall(0).args[0] as CustomEvent;
    expect(event.detail.value?.value).to.equal('bar');
    expect(event.detail.value?.index).to.equal(1);
  });
});
