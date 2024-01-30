import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { TimePicker } from '../packages/react-components/src/TimePicker.js';

useChaiPlugin(chaiDom);

describe('TimePicker', () => {
  afterEach(cleanup);

  it('should apply "value" the last', () => {
    const value = '15:20:08';
    const { container } = render(<TimePicker label="Foo" value={value} step={1} />);

    const element = container.querySelector('vaadin-time-picker');
    expect(element).to.exist;

    const input = element!.querySelector('input');

    expect(input).to.have.value(value);
  });
});
