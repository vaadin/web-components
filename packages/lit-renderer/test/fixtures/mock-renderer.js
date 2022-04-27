import { render } from 'lit';
import { directive } from 'lit/directive.js';
import { LitRendererDirective } from '../../src/lit-renderer.js';

class MockRendererDirective extends LitRendererDirective {
  addRenderer() {
    this.element.renderer = (root) => {
      render(this.renderer.call(this.host), root, { host: this.host });
    };
  }

  runRenderer() {
    this.element.requestContentUpdate();
  }

  disposeOfRenderer() {
    this.element.renderer = null;
  }
}

export const mockRenderer = directive(MockRendererDirective);
