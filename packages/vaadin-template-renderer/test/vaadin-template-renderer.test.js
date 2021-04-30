import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { click, fire, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { TemplateInstanceBase } from '@polymer/polymer/lib/utils/templatize';

import '../vaadin-template-renderer.js';
import { Templatizer } from '../src/vaadin-template-renderer-templatizer.js';

import './x-polymer-host.js';
import './x-component.js';

describe('vaadin-template-renderer', () => {
  it('should render the template', () => {
    const component = fixtureSync(`
      <x-component>
        <template>foo</template>
      </x-component>
    `);

    expect(component.content.textContent).to.equal('foo');
  });

  it('should process the template only once', () => {
    const component = fixtureSync(`
      <x-component>
        <template>foo</template>
      </x-component>
    `);
    const template = component.querySelector('template');

    const oldTemplatizer = template.__templatizer;

    window.Vaadin.templateRendererCallback(component);

    const newTemplatizer = template.__templatizer;

    expect(newTemplatizer).to.be.instanceOf(Templatizer);
    expect(newTemplatizer).to.equal(oldTemplatizer);
  });

  it('should keep the same template instance when re-rendering', () => {
    const component = fixtureSync(`
      <x-component>
        <template>foo</template>
      </x-component>
    `);

    const oldTemplateInstance = component.content.__templateInstance;

    component.render();

    const newTemplateInstance = component.content.__templateInstance;

    expect(newTemplateInstance).to.be.instanceOf(TemplateInstanceBase);
    expect(newTemplateInstance).to.equal(oldTemplateInstance);
  });

  it('should not process non-child templates', () => {
    const component = fixtureSync(`
      <x-component>
        <div>
          <template>foo</template>
        </div>
      </x-component>
    `);

    expect(component.content.textContent).to.equal('');
  });

  it('should render the last child template in case of multiple templates', () => {
    const component = fixtureSync(`
      <x-component>
        <template>foo</template>
        <template>bar</template>
      </x-component>
    `);

    expect(component.content.textContent).to.equal('bar');
  });

  it('should handle events from the template', () => {
    const host = fixtureSync(`<x-polymer-host></x-polymer-host>`);
    const component = host.$.component;
    const button = component.content.querySelector('button');
    const spy = sinon.spy(host, 'onClick');

    click(button);

    expect(spy.calledOnce).to.be.true;
  });

  it('should re-render the template when changing a parent property', async () => {
    const host = fixtureSync(`<x-polymer-host></x-polymer-host>`);
    const component = host.$.component;

    host.value = 'foobar';

    expect(component.content.textContent.trim()).to.equal('foobar');
  });

  it('should re-render multiple instances of the template independently', async () => {
    const host1 = fixtureSync(`<x-polymer-host></x-polymer-host>`);
    const host2 = fixtureSync(`<x-polymer-host></x-polymer-host>`);
    const component1 = host1.$.component;
    const component2 = host2.$.component;

    host1.value = 'foo';
    host2.value = 'bar';

    expect(component1.content.textContent.trim()).to.equal('foo');
    expect(component2.content.textContent.trim()).to.equal('bar');
  });

  it('should support the two-way property binding', () => {
    const host = fixtureSync(`<x-polymer-host></x-polymer-host>`);
    const component = host.$.component;
    const input = component.content.querySelector('input');

    input.value = 'foobar';
    fire(input, 'input');

    expect(host.value).to.equal('foobar');
  });

  describe('observer', () => {
    it('should observe adding a template', async () => {
      const component = fixtureSync(`<x-component></x-component>`);
      const template = fixtureSync(`<template>bar</template>`);

      component.appendChild(template);
      await nextFrame();

      expect(component.content.textContent).to.equal('bar');
    });

    it('should observe replacing a template', async () => {
      const component = fixtureSync(`
        <x-component>
          <template>foo</template>
        </x-component>
      `);
      const template = fixtureSync(`<template>bar</template>`);

      component.replaceChildren(template);
      await nextFrame();

      expect(component.content.textContent).to.equal('bar');
    });

    it('should not observe adding a non-template element', async () => {
      const component = fixtureSync(`<x-component></x-component>`);
      const element = fixtureSync('<div>bar</div>');

      component.appendChild(element);
      await nextFrame();

      expect(component.content.textContent).to.equal('');
    });

    it('should not observe adding a non-child template', async () => {
      const component = fixtureSync(`
        <x-component>
          <div></div>
        </x-component>
      `);
      const template = fixtureSync(`<template>bar</template>`);

      component.querySelector('div').appendChild(template);
      await nextFrame();

      expect(component.content.textContent).to.equal('');
    });
  });
});
