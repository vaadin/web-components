import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import chaiDom from 'chai-dom';
import { Accordion } from '../src/Accordion.js';

useChaiPlugin(chaiDom);

describe('ThemedReactWebComponent', () => {
  it('should add a "theme" attribute', () => {
    const { container } = render(<Accordion theme="primary"></Accordion>);
    const element = container.querySelector('vaadin-accordion');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'primary');
  });
});
