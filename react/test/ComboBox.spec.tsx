import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { ComboBox, type WebComponentModule } from '../src/ComboBox.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

describe('ComboBox', () => {
  const overlayTag = 'vaadin-combo-box-overlay';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.ComboBox>(overlayTag, (ref) => ref.close());

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
        renderer={({ item }) => <>{item.value}</>}
        onSelectedItemChanged={(event) => {
          expect(event.detail.value?.value).to.equal('bar');
          expect(event.detail.value?.index).to.equal(1);
          done();
        }}
      />,
    );

    const comboBox = container.querySelector('vaadin-combo-box');
    expect(comboBox).not.to.be.undefined;

    const comboBoxOverlay = document.body.querySelector(overlayTag);
    expect(comboBoxOverlay).not.to.be.undefined;

    const bar = comboBoxOverlay!.querySelector('vaadin-combo-box-item:nth-child(2)');
    expect(bar).not.to.be.undefined;

    bar!.dispatchEvent(new MouseEvent('click'));
  });
});
