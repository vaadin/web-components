import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { css, registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

function defineComponent(tagName: string, parentTagName = 'test-element') {
  customElements.define(
    tagName,
    class CustomElement extends ThemableMixin(customElements.get(parentTagName)!) {
      static is = tagName;
    },
  );
}

function getCssText(instance: Element) {
  if (instance.shadowRoot!.adoptedStyleSheets?.length) {
    // Uses adopted stylesheets
    return [...instance.shadowRoot!.adoptedStyleSheets].reduce((acc, sheet) => {
      return sheet.rules ? acc + [...sheet.rules].reduce((acc, rule) => acc + rule.cssText, '') : acc;
    }, '');
  }
  // Uses style elements
  return [...instance.shadowRoot!.querySelectorAll('style')].reduce((acc, style) => acc + style.textContent, '');
}

describe('ThemableMixin - post-finalize styles', () => {
  let warn: sinon.SinonStub;

  let tagId = 0;
  function uniqueTagName() {
    tagId += 1;
    return `custom-element-${tagId}`;
  }

  before(() => customElements.whenDefined('test-element'));

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

  it('should have post-finalize styles for a type matching a wildcard', async () => {
    const tagName = uniqueTagName();

    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    registerStyles(
      `${tagName}*`,
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

  it('should not include duplicate styles', async () => {
    const parentTagName = uniqueTagName();
    defineComponent(parentTagName);
    fixtureSync(`<${parentTagName}></${parentTagName}>`);
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

    // Expect the cssText to contain "--foo: foo;" only once
    const count = (getCssText(child).match(/--foo: foo;/gu) || []).length;
    expect(count).to.equal(1);
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

  it('should inherit ThemableMixin from parent', async () => {
    const parentTagName = uniqueTagName();
    defineComponent(parentTagName);
    registerStyles(
      parentTagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    const childTagName = uniqueTagName();
    class Child extends (customElements.get(parentTagName)!) {
      static is = childTagName;
    }
    customElements.define(childTagName, Child);

    const child = fixtureSync(`<${childTagName}></${childTagName}>`);
    await nextFrame();

    const childStyles = getComputedStyle(child);
    expect(childStyles.getPropertyValue('--foo')).to.equal('foo');
  });

  it('should not throw for components without shadow root', async () => {
    class Component extends ThemableMixin(customElements.get('test-element')!) {
      static is = 'rootless-component';

      // LitElement
      createRenderRoot() {
        return this;
      }

      // PolymerElement
      _attachDom(dom: DocumentFragment) {
        this.appendChild(dom);
      }
    }

    customElements.define('rootless-component', Component);
    fixtureSync('<rootless-component></rootless-component>');
    await nextFrame();

    const doRegister = () =>
      registerStyles(
        'rootless-component',
        css`
          :host {
            --foo: foo;
          }
        `,
      );

    expect(doRegister).to.not.throw();
  });

  it('should warn when using post-finalize styles', async () => {
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

    await nextFrame();

    expect(warn.calledOnce).to.be.true;
    expect(warn.args[0][0]).to.include('The custom element definition for');
  });

  it('should suppress the warning for post-finalize styles', async () => {
    Object.assign(window, { Vaadin: { suppressPostFinalizeStylesWarning: true } });

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

    await nextFrame();

    expect(warn.called).to.be.false;
  });

  it('should warn when the same style rules get added again', async () => {
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

    registerStyles(
      tagName,
      css`
        :host {
          --foo: foo;
        }
      `,
    );

    await nextFrame();

    expect(warn.calledOnce).to.be.true;
    expect(warn.args[0][0]).to.include('Registering styles that already exist for');
    expect(getComputedStyle(instance).getPropertyValue('--foo')).to.equal('foo');
  });

  it('should warn when the same style instance gets added again', async () => {
    const tagName = uniqueTagName();
    defineComponent(tagName);
    const instance = fixtureSync(`<${tagName}></${tagName}>`);

    const style = css`
      :host {
        --foo: foo;
      }
    `;

    registerStyles(tagName, style);
    registerStyles(tagName, style);

    await nextFrame();

    expect(warn.calledOnce).to.be.true;
    expect(warn.args[0][0]).to.include('Registering styles that already exist for');
    expect(getComputedStyle(instance).getPropertyValue('--foo')).to.equal('foo');
  });
});
