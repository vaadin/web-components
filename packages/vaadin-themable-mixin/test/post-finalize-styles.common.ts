import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { css, registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

function defineComponent(tagName, parentTagName = 'test-element') {
  customElements.define(
    tagName,
    class CustomElement extends ThemableMixin(customElements.get(parentTagName)!) {
      static is = tagName;
    },
  );
}

describe('ThemableMixin - post-finalize styles', () => {
  let warn;

  let tagId = 0;
  function uniqueTagName() {
    tagId += 1;
    return `custom-element-${tagId}`;
  }

  beforeEach(() => {
    warn = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warn.restore();
  });

  it('should have pre-finalize styles', () => {
    const tagName = uniqueTagName();

    registerStyles(
      tagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('foo');
  });

  it('should have post-finalize styles', async () => {
    const tagName = uniqueTagName();

    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    registerStyles(
      tagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    await nextFrame();

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('foo');
  });

  it('should have post-finalize styles on a new instance', async () => {
    const tagName = uniqueTagName();
    defineComponent(tagName);
    // Create an instance to trigger finalize in case of a Polymer component
    fixtureSync(`<${tagName}></${tagName}>`);

    registerStyles(
      tagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    const instance = fixtureSync(`<${tagName}></${tagName}>`);
    await nextFrame();

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('foo');
  });

  it('should warn when using post-finalize styles', () => {
    const tagName = uniqueTagName();
    defineComponent(tagName);
    fixtureSync(`<${tagName}></${tagName}>`);
    registerStyles(
      tagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    expect(warn.calledOnce).to.be.true;
  });

  it('should inherit post-finalize styles from parent', async () => {
    const parentTagName = uniqueTagName();
    defineComponent(parentTagName);
    const parent = fixtureSync(`<${parentTagName}></${parentTagName}>`);
    await nextFrame();
    registerStyles(
      parentTagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    const childTagName = uniqueTagName();
    defineComponent(childTagName, parentTagName);
    const child = fixtureSync(`<${childTagName}></${childTagName}>`);
    await nextFrame();
    registerStyles(
      childTagName,
      css`
        :host {
          --bar: bar;
        }
      `,
    );

    await nextFrame();

    const parentStyles = getComputedStyle(parent);
    expect(parentStyles.getPropertyValue('--foo')).to.equal('foo');
    expect(parentStyles.display).to.equal('block');

    const childStyles = getComputedStyle(child);
    expect(childStyles.getPropertyValue('--foo')).to.equal('foo');
    expect(childStyles.getPropertyValue('--bar')).to.equal('bar');
    expect(childStyles.display).to.equal('block');
  });

  it('should inherit post-finalize styles to already defined child after instantiating', async () => {
    const parentTagName = uniqueTagName();
    defineComponent(parentTagName);
    await nextFrame();

    const childTagName = uniqueTagName();
    defineComponent(childTagName, parentTagName);
    const child = fixtureSync(`<${childTagName}></${childTagName}>`);
    await nextFrame();

    registerStyles(
      parentTagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    await nextFrame();

    const childStyles = getComputedStyle(child);
    expect(childStyles.getPropertyValue('--foo')).to.equal('foo');
  });

  it('should inherit post-finalize styles to already defined child before instantiating', async () => {
    const parentTagName = uniqueTagName();
    defineComponent(parentTagName);
    await nextFrame();

    const childTagName = uniqueTagName();
    defineComponent(childTagName, parentTagName);
    // Create an instance to trigger finalize in case of a Polymer component
    fixtureSync(`<${childTagName}></${childTagName}>`);
    await nextFrame();

    registerStyles(
      parentTagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    await nextFrame();

    const child = fixtureSync(`<${childTagName}></${childTagName}>`);
    await nextFrame();

    const childStyles = getComputedStyle(child);
    expect(childStyles.getPropertyValue('--foo')).to.equal('foo');
  });
});
