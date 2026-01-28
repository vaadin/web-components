import { directive } from 'lit/directive.js';
import { type LitRenderer, LitRendererDirective } from '../../src/lit-renderer.js';
import type { MockComponent } from './mock-component.js';

class MockRendererDirective extends LitRendererDirective<MockComponent, LitRenderer> {
  addRenderer() {
    this.element.renderer = (root) => {
      this.renderRenderer(root);
    };
  }

  runRenderer() {
    this.element.requestContentUpdate();
  }

  removeRenderer() {
    this.element.renderer = null;
  }
}

export const mockRenderer = directive(MockRendererDirective);
