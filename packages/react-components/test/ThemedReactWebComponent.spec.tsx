import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../src/Accordion.js';
import { Breadcrumbs } from '../src/Breadcrumbs.js';
import { BreadcrumbsItem } from '../src/BreadcrumbsItem.js';
import { Switch } from '../src/Switch.js';

describe('ThemedReactWebComponent', () => {
  it('should add a "theme" attribute', async () => {
    const { container } = await render(<Accordion theme="primary" />);
    const element = container.querySelector('vaadin-accordion');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'primary');
  });

  it('should add a "theme" attribute to a component without ThemableMixin (Switch)', async () => {
    const { container } = await render(<Switch theme="small" />);
    const element = container.querySelector('vaadin-switch');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'small');
  });

  it('should add a "theme" attribute to a component without ThemableMixin (Breadcrumbs)', async () => {
    const { container } = await render(<Breadcrumbs theme="slash" />);
    const element = container.querySelector('vaadin-breadcrumbs');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'slash');
  });

  it('should add a "theme" attribute to a component without ThemableMixin (BreadcrumbsItem)', async () => {
    const { container } = await render(<BreadcrumbsItem theme="small" />);
    const element = container.querySelector('vaadin-breadcrumbs-item');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'small');
  });
});
