import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-component.js';
import { html, LitElement, render } from 'lit';
import { mockRenderer } from './fixtures/mock-renderer.js';

class HostComponent extends LitElement {
  render() {
    return html`<mock-component
      ${mockRenderer(() => html`<button @click=${this.onButtonClick}>Button</button>`)}
    ></mock-component>`;
  }

  onButtonClick(event) {
    const customEvent = new CustomEvent('button-click', {
      detail: {
        target: event.target,
      },
    });
    this.dispatchEvent(customEvent);
  }
}

customElements.define('host-component', HostComponent);

describe('lit-renderer', () => {
  let component;

  it('should throw when binding the directive to a not element part', () => {
    const container = fixtureSync('<div></div>');
    expect(() => {
      render(html`<div>${mockRenderer(() => html`Content`)}</div>`, container);
    }).to.throw('`MockRendererDirective` must be bound to an element');
  });

  describe('basic', () => {
    let container;

    function doRender(content) {
      return render(html`<mock-component ${mockRenderer(() => html`${content}`)}></mock-component>`, container);
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      doRender('content');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content when no dependencies are specified', () => {
      doRender('new content');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('single dependency', () => {
    let container;

    function doRender(content, dependency) {
      return render(
        html`<mock-component ${mockRenderer(() => html`${content}`, dependency)}></mock-component>`,
        container,
      );
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      doRender('content', 'dep');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content when the dependency has changed', () => {
      doRender('new content', 'new dep');
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should not re-render the content when the dependency has not changed', () => {
      doRender('new content', 'dep');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('multiple dependencies', () => {
    let container, initialDependencies;

    function doRender(content, dependencies) {
      return render(
        html`<mock-component ${mockRenderer(() => html`${content}`, dependencies)}></mock-component>`,
        container,
      );
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      initialDependencies = ['dep'];
      doRender('content', initialDependencies);
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content when no dependencies have changed', () => {
      doRender('new content', ['dep']);
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content when a dependency has changed', () => {
      doRender('new content', ['new dep']);
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should re-render the content when adding a dependency', () => {
      doRender('new content', ['dep', 'dep 2']);
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should re-render the content when removing a dependency', () => {
      doRender('new content', []);
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should re-render the content after mutating the depedencies array', () => {
      initialDependencies.push('dep 2');
      doRender('new content', initialDependencies);
      expect(component.$.content.textContent).to.equal('new content');
    });
  });

  describe('conditional', () => {
    let container, part;

    function doRender({ component, directive }) {
      return render(
        component
          ? html`<mock-component ${directive ? mockRenderer(() => html`Content`) : null}></mock-component>`
          : null,
        container,
      );
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      part = doRender({ component: true, directive: true });
      component = container.querySelector('mock-component');
    });

    it('should add the renderer when the directive is attached', () => {
      expect(component.renderer).to.exist;
    });

    it('should remove the renderer when the directive is detached', () => {
      doRender({ component: true, directive: false });
      expect(component.renderer).not.to.exist;
    });

    it('should remove the renderer when the component is removed from the DOM', () => {
      doRender({ component: false, directive: true });
      expect(component.renderer).not.to.exist;
    });

    it(`should toggle the renderer when toggling the connected state of the component's part`, () => {
      part.setConnected(false);
      expect(component.renderer).not.to.exist;
      part.setConnected(true);
      expect(component.renderer).to.exist;
    });
  });

  describe('events', () => {
    let hostComponent;

    beforeEach(async () => {
      hostComponent = fixtureSync('<host-component></host-component>');
      await hostComponent.updateComplete;
      component = hostComponent.shadowRoot.querySelector('mock-component');
    });

    it('should allow using host methods as event listeners', () => {
      const spy = sinon.spy();
      hostComponent.addEventListener('button-click', spy);

      const button = component.$.content.querySelector('button');
      button.click();

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.firstArg).to.be.instanceOf(CustomEvent);
      expect(spy.firstCall.firstArg.detail.target).to.equal(button);
    });
  });
});
