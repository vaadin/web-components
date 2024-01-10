import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { css, registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

function defineComponent(tagName) {
  customElements.define(
    tagName,
    class CustomElement extends ThemableMixin(customElements.get('test-element')!) {
      static is = tagName;
    },
  );
}

describe('ThemableMixin - post-finalize styles', () => {
  let warn;

  beforeEach(() => {
    warn = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warn.restore();
  });

  it('should have pre-finalize styles', () => {
    const tagName = 'pre-finalize-styles';

    registerStyles(
      tagName,
      css`
        :host {
          --foo: bar;
        }
      `,
    );

    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('bar');
  });

  it('should have post-finalize styles', async () => {
    const tagName = 'post-finalize-styles';

    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    registerStyles(
      tagName,
      css`
        :host {
          --foo: bar;
        }
      `,
    );

    await nextFrame();

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('bar');
  });

  it('should have post-finalize styles on a new instance', async () => {
    const tagName = 'post-finalize-styles-new-instance';
    defineComponent(tagName);
    // Create an instance to trigger finalize in case of a Polymer component
    fixtureSync(`<${tagName}></${tagName}>`);

    registerStyles(
      tagName,
      css`
        :host {
          --foo: bar;
        }
      `,
    );

    const instance = fixtureSync(`<${tagName}></${tagName}>`);
    await nextFrame();

    const styles = getComputedStyle(instance);
    expect(styles.getPropertyValue('--foo')).to.equal('bar');
  });

  it('should warn when using post-finalize styles', () => {
    const tagName = 'post-finalize-warning';
    defineComponent(tagName);
    fixtureSync(`<${tagName}></${tagName}>`);
    registerStyles(
      tagName,
      css`
        :host {
          --foo: bar;
        }
      `,
    );

    expect(warn.calledOnce).to.be.true;
  });
});
