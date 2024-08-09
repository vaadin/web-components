import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../template-renderer.js';
import './fixtures/mock-component.js';
import './fixtures/mock-component-slotted-host.js';

describe('observer', () => {
  it('should initialize the observer only once', () => {
    const component = fixtureSync(`
      <mock-component>
        <template>foo</template>
      </mock-component>
    `);

    const oldTemplateObserver = component.__templateObserver;

    window.Vaadin.templateRendererCallback(component);

    const newTemplateObserver = component.__templateObserver;

    expect(newTemplateObserver).to.be.ok;
    expect(newTemplateObserver).to.equal(oldTemplateObserver);
  });

  it('should observe adding templates', async () => {
    const component = fixtureSync(`<mock-component></mock-component>`);
    const template = fixtureSync(`<template>bar</template>`);

    component.appendChild(template);
    await nextFrame();

    expect(component.$.content.textContent).to.equal('bar');
  });

  it('should observe replacing templates', async () => {
    const component = fixtureSync(`
      <mock-component>
        <template>foo</template>
      </mock-component>
    `);
    const template = fixtureSync(`<template>bar</template>`);

    component.replaceChildren(template);
    await nextFrame();

    expect(component.$.content.textContent).to.equal('bar');
  });

  it('should not observe adding non-template elements', async () => {
    const component = fixtureSync(`<mock-component></mock-component>`);
    const element = fixtureSync('<div>bar</div>');

    component.appendChild(element);
    await nextFrame();

    expect(component.$.content.textContent).to.equal('');
  });

  it('should not observe adding non-child templates', async () => {
    const component = fixtureSync(`
      <mock-component>
        <div></div>
      </mock-component>
    `);
    const template = fixtureSync(`<template>bar</template>`);

    component.querySelector('div').appendChild(template);
    await nextFrame();

    expect(component.$.content.textContent).to.equal('');
  });

  describe('slotted templates', () => {
    it('should observe adding slotted templates', async () => {
      const host = fixtureSync(`
        <mock-component-slotted-host></mock-component-slotted-host>
      `);
      const component = host.$.component;
      const template = fixtureSync(`<template slot="template">added</template>`);

      host.appendChild(template);
      await nextFrame();

      expect(component.$.content.textContent).to.equal('added');
    });

    it('should observe replacing slotted templates', async () => {
      const host = fixtureSync(`
        <mock-component-slotted-host>
          <template slot="template">slotted</template>
        </mock-component-slotted-host>
      `);
      const component = host.$.component;
      const template = fixtureSync(`<template slot="template">replaced</template>`);

      host.replaceChildren(template);
      await nextFrame();

      expect(component.$.content.textContent).to.equal('replaced');
    });

    it('should render the fallback template when removing the slotted template', async () => {
      const host = fixtureSync(`
        <mock-component-slotted-host>
          <template slot="template">slotted</template>
        </mock-component-slotted-host>
      `);
      const template = host.querySelector('template');
      const component = host.$.component;

      host.removeChild(template);
      await nextFrame();

      expect(component.$.content.textContent).to.equal('fallback');
    });
  });
});
