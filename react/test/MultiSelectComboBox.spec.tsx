import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import {
  MultiSelectComboBox,
  type MultiSelectComboBoxElement,
} from '../packages/react-components/src/MultiSelectComboBox.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('MultiSelectComboBox', () => {
  const overlayTag = 'vaadin-multi-select-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<MultiSelectComboBoxElement>(
    overlayTag,
    (ref) => (ref.opened = false),
  );

  afterEach(cleanup);
  afterEach(catcher);

  it('should render correctly', (done) => {
    type Item = Readonly<{ value: string; index: number }>;

    const items: Item[] = [
      { value: 'foo', index: 0 },
      { value: 'bar', index: 1 },
    ];

    const { container } = render(
      <MultiSelectComboBox<Item>
        ref={ref}
        items={items}
        opened
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemsChanged={(event) => {
          expect(event.detail.value[0].value).to.equal('bar');
          expect(event.detail.value[0].index).to.equal(1);
          done();
        }}
      />,
    );

    const comboBox = container.querySelector('vaadin-multi-select-combo-box');
    expect(comboBox).to.exist;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).to.exist;

    const bar = comboBoxOverlay!.querySelector('vaadin-multi-select-combo-box-item:nth-child(2)');
    expect(bar).to.exist;

    bar!.dispatchEvent(new PointerEvent('click', { bubbles: true }));
  });
});
