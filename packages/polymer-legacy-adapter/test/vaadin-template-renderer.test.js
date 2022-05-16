import { expect } from '@esm-bundle/chai';
import { click, fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../template-renderer.js';
import './fixtures/mock-component.js';
import './fixtures/mock-component-host.js';
import './fixtures/mock-component-slotted-host.js';
import { Templatizer } from '../src/template-renderer-templatizer.js';

describe('vaadin-template-renderer', () => {
  describe('basic', () => {
    let component, template;

    beforeEach(() => {
      component = fixtureSync(`
        <mock-component>
          <template>foo</template>
        </mock-component>
      `);

      template = component.querySelector('template');
    });

    it('should render the template', () => {
      expect(component.$.content.textContent).to.equal('foo');
    });

    it('should process the template only once', () => {
      const oldTemplatizer = template.__templatizer;

      window.Vaadin.templateRendererCallback(component);

      const newTemplatizer = template.__templatizer;

      expect(newTemplatizer).to.be.instanceOf(Templatizer);
      expect(newTemplatizer).to.equal(oldTemplatizer);
    });

    it('should preserve the template instance when re-rendering', () => {
      const oldTemplateInstance = component.$.content.__templateInstance;

      component.render();

      const newTemplateInstance = component.$.content.__templateInstance;

      expect(template.__templatizer.__templateInstances).to.have.lengthOf(1);
      expect(template.__templatizer.__templateInstances).to.include(oldTemplateInstance);
      expect(template.__templatizer.__templateInstances).to.include(newTemplateInstance);
    });

    it('should create a new template instance after clearing the content', () => {
      const oldTemplateInstance = component.$.content.__templateInstance;

      component.$.content.innerHTML = '';
      component.render();

      const newTemplateInstance = component.$.content.__templateInstance;

      expect(template.__templatizer.__templateInstances).to.have.lengthOf(1);
      expect(template.__templatizer.__templateInstances).not.to.include(oldTemplateInstance);
      expect(template.__templatizer.__templateInstances).to.include(newTemplateInstance);
    });

    it('should render the template after clearing the content', () => {
      component.$.content.innerHTML = '';
      component.render();

      expect(component.$.content.textContent).to.equal('foo');
    });
  });

  it('should throw when using both a template and a renderer', () => {
    const stub = sinon.stub(window.Vaadin, 'templateRendererCallback');
    const component = fixtureSync(`
      <mock-component>
        <template>foo</template>
      </mock-component>
    `);
    stub.restore();

    component.renderer = () => {};

    expect(() => window.Vaadin.templateRendererCallback(component)).to.throw(
      /^Cannot use both a template and a renderer for <mock-component \/>\.$/,
    );
  });

  it('should not process non-child templates', () => {
    const component = fixtureSync(`
      <mock-component>
        <div>
          <template>foo</template>
        </div>
      </mock-component>
    `);

    expect(component.$.content.textContent).to.equal('');
  });

  it('should render the last child template in case of multiple templates', () => {
    const component = fixtureSync(`
      <mock-component>
        <template>foo</template>
        <template>bar</template>
      </mock-component>
    `);

    expect(component.$.content.textContent).to.equal('bar');
  });

  it('should handle events from the template instance', () => {
    const host = fixtureSync(`<mock-component-host></mock-component-host>`);
    const component = host.$.component;
    const button = component.$.content.querySelector('button');
    const spy = sinon.spy(host, 'onClick');

    click(button);

    expect(spy.calledOnce).to.be.true;
  });

  it('should include model in the event', () => {
    const host = fixtureSync(`<mock-component-host></mock-component-host>`);
    const component = host.$.component;
    const button = component.$.content.querySelector('button');
    const spy = sinon.spy(host, 'onClick');

    click(button);

    expect(spy.getCall(0).args[0].model).to.equal(component.$.content.__templateInstance);
  });

  it('should re-render the template instance when changing a parent property', async () => {
    const host = fixtureSync(`<mock-component-host></mock-component-host>`);
    const component = host.$.component;

    host.value = 'foobar';

    expect(component.$.content.textContent.trim()).to.equal('foobar');
  });

  it('should re-render multiple template instances independently', async () => {
    const host1 = fixtureSync(`<mock-component-host></mock-component-host>`);
    const host2 = fixtureSync(`<mock-component-host></mock-component-host>`);
    const component1 = host1.$.component;
    const component2 = host2.$.component;

    host1.value = 'foo';
    host2.value = 'bar';

    expect(component1.$.content.textContent.trim()).to.equal('foo');
    expect(component2.$.content.textContent.trim()).to.equal('bar');
  });

  it('should support the 2-way property binding', () => {
    const host = fixtureSync(`<mock-component-host></mock-component-host>`);
    const component = host.$.component;
    const input = component.$.content.querySelector('input');

    input.value = 'foobar';
    fire(input, 'input');

    expect(host.value).to.equal('foobar');
  });

  describe('slotted templates', () => {
    it('should render the fallback template', () => {
      const host = fixtureSync(`
        <mock-component-slotted-host></mock-component-slotted-host>
      `);
      const component = host.$.component;

      expect(component.$.content.textContent).to.equal('fallback');
    });

    it('should render the slotted template', () => {
      const host = fixtureSync(`
        <mock-component-slotted-host>
          <template slot="template">slotted</template>
        </mock-component-slotted-host>
      `);
      const component = host.$.component;

      expect(component.$.content.textContent).to.equal('slotted');
    });
  });
});
