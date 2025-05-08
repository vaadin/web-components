import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../packages/react-components/src/Accordion.js';

describe('ThemedReactWebComponent', () => {
  it('should add a "theme" attribute', () => {
    const { container } = render(<Accordion theme="primary"></Accordion>);
    const element = container.querySelector('vaadin-accordion');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'primary');
  });
});
