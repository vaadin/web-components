import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { TimePicker } from '../packages/react-components/src/TimePicker.js';

describe('TimePicker', () => {
  it('should apply "value" the last', () => {
    const value = '15:20:08';
    const { container } = render(<TimePicker label="Foo" value={value} step={1} />);

    const element = container.querySelector('vaadin-time-picker');
    expect(element).to.exist;

    const input = element!.querySelector('input');

    expect(input).to.have.value(value);
  });
});
