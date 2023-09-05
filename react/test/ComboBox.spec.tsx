import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { ComboBox, type ComboBoxElement } from '../src/ComboBox.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('ComboBox', () => {
  const overlayTag = 'vaadin-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<ComboBoxElement>(overlayTag, (ref) => ref.close());

  afterEach(cleanup);
  afterEach(catcher);

  it('should render correctly', (done) => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const { container } = render(
      <ComboBox<Item>
        ref={ref}
        items={items}
        opened
        itemLabelPath="value"
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemChanged={(event) => {
          expect(event.detail.value?.value).to.equal('bar');
          expect(event.detail.value?.index).to.equal(1);
          done();
        }}
      />,
    );

    const comboBox = container.querySelector('vaadin-combo-box');
    expect(comboBox).to.exist;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).to.exist;

    const bar = comboBoxOverlay!.querySelector('vaadin-combo-box-item:nth-child(2)');
    expect(bar).to.exist;

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));
  });
});
