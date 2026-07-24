import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../packages/react-components/src/Accordion.js';
import { Breadcrumbs } from '../packages/react-components/src/Breadcrumbs.js';
import { Switch } from '../packages/react-components/src/Switch.js';

describe('ThemedReactWebComponent', () => {
  it('should add a "theme" attribute', async () => {
    const { container } = await render(<Accordion theme="primary"></Accordion>);
    const element = container.querySelector('vaadin-accordion');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'primary');
  });

  it('should add a "theme" attribute to a component without ThemableMixin (Switch)', async () => {
    const { container } = await render(<Switch theme="small"></Switch>);
    const element = container.querySelector('vaadin-switch');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'small');
  });

  it('should add a "theme" attribute to a component without ThemableMixin (Breadcrumbs)', async () => {
    const { container } = await render(<Breadcrumbs theme="slash"></Breadcrumbs>);
    const element = container.querySelector('vaadin-breadcrumbs');
    expect(element).not.to.be.undefined;

    expect(element).to.have.attribute('theme', 'slash');
  });
});
