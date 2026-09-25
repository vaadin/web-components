import { expect } from '@vaadin/chai-plugins';
import '../vaadin-core.js';

describe('vaadin-core', () => {
  it('should register the core components', () => {
    // A spread of components, including the ones added after the entry point
    // was last maintained by hand
    const tagNames = [
      'vaadin-badge',
      'vaadin-button',
      'vaadin-card',
      'vaadin-combo-box',
      'vaadin-grid',
      'vaadin-markdown',
      'vaadin-master-detail-layout',
      'vaadin-popover',
      'vaadin-slider',
      'vaadin-switch',
      'vaadin-text-field',
    ];

    for (const tagName of tagNames) {
      expect(customElements.get(tagName), tagName).to.be.ok;
    }
  });

  it('should register the components of the other entry points', () => {
    // Components that the main entry point of their package does not register
    const tagNames = [
      'vaadin-breadcrumbs-item',
      'vaadin-drawer-toggle',
      'vaadin-form-item',
      'vaadin-grid-column',
      'vaadin-grid-sorter',
      'vaadin-login-form',
      'vaadin-select-item',
      'vaadin-tab',
    ];

    for (const tagName of tagNames) {
      expect(customElements.get(tagName), tagName).to.be.ok;
    }
  });

  it('should not register the commercial components', () => {
    expect(customElements.get('vaadin-chart')).to.be.undefined;
    expect(customElements.get('vaadin-map')).to.be.undefined;
  });
});
