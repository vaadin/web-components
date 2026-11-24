import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, LitElement, nothing, render } from 'lit';
import { slotContent } from '../src/directives/slot-content.js';

class SlotContentHost extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      content: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.text = 'foo';
    this.content = true;
  }

  render() {
    return html`
      <slot name="a" ${slotContent(html`<span slot="a">${this.text}</span>`)}></slot>
      <slot name="b" ${slotContent(this.content ? html`<b slot="b">bar</b>` : nothing)}></slot>
    `;
  }
}

customElements.define('slot-content-host', SlotContentHost);

describe('slotContent', () => {
  let element;

  const getChildren = () => [...element.children].map((node) => node.localName);

  beforeEach(async () => {
    element = fixtureSync('<slot-content-host><i slot="a"></i></slot-content-host>');
    await element.updateComplete;
  });

  it('should render the content into the light DOM of the host', () => {
    const slot = element.shadowRoot.querySelector('slot[name="a"]');
    expect(slot.assignedElements().map((node) => node.localName)).to.eql(['i', 'span']);
  });

  it('should render the content of each slot separately', () => {
    expect(getChildren()).to.eql(['i', 'span', 'b']);
  });

  it('should not render fallback content in the slot', async () => {
    element.content = false;
    await element.updateComplete;
    const slot = element.shadowRoot.querySelector('slot[name="b"]');
    expect(slot.childNodes).to.be.empty;
    expect(slot.assignedNodes({ flatten: true })).to.be.empty;
  });

  it('should update the content when the host updates', async () => {
    element.text = 'baz';
    await element.updateComplete;
    expect(element.querySelector('span').textContent).to.equal('baz');
  });

  it('should keep a child added after the first render after the content', async () => {
    element.appendChild(document.createElement('u'));
    element.content = false;
    await element.updateComplete;
    expect(getChildren()).to.eql(['i', 'span', 'u']);

    element.content = true;
    await element.updateComplete;
    expect(getChildren()).to.eql(['i', 'span', 'b', 'u']);
  });

  it('should not render the content again when the host is moved', async () => {
    const parent = element.parentNode;
    parent.removeChild(element);
    parent.appendChild(element);
    element.text = 'baz';
    await element.updateComplete;
    expect(getChildren()).to.eql(['i', 'span', 'b']);
  });

  it('should render the content again when the light DOM of the host is cleared', async () => {
    element.textContent = '';
    element.text = 'baz';
    await element.updateComplete;
    expect(getChildren()).to.eql(['span', 'b']);
    expect(element.querySelector('span').textContent).to.equal('baz');
  });

  it('should throw when used in a child expression', () => {
    const container = document.createElement('div');
    expect(() => render(html`<slot>${slotContent('foo')}</slot>`, container, { host: container })).to.throw(
      /can only be used as an element expression of a `<slot>`/u,
    );
  });

  it('should throw when used on an element other than slot', () => {
    const container = document.createElement('div');
    expect(() => render(html`<div ${slotContent('foo')}></div>`, container, { host: container })).to.throw(
      /can only be used as an element expression of a `<slot>`/u,
    );
  });

  it('should throw when the template is rendered without the host option', () => {
    const container = document.createElement('div');
    expect(() => render(html`<slot ${slotContent('foo')}></slot>`, container)).to.throw(
      /requires the template to be rendered with the `host` option/u,
    );
  });
});
