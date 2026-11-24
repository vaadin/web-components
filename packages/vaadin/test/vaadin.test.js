import { expect } from '@vaadin/chai-plugins';
import '../vaadin.js';

describe('vaadin', () => {
  it('should register the commercial components', () => {
    const tagNames = [
      'vaadin-board',
      'vaadin-chart',
      'vaadin-crud',
      'vaadin-crud-edit-column',
      'vaadin-dashboard',
      'vaadin-grid-pro',
      'vaadin-grid-pro-edit-column',
      'vaadin-map',
      'vaadin-rich-text-editor',
    ];

    for (const tagName of tagNames) {
      expect(customElements.get(tagName), tagName).to.be.ok;
    }
  });

  it('should register the core components as well', () => {
    expect(customElements.get('vaadin-button')).to.be.ok;
    expect(customElements.get('vaadin-grid')).to.be.ok;
  });
});
