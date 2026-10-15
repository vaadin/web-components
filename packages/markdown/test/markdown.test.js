import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextUpdate(element);
  });

  it('should be defined', () => {
    expect(element.localName).to.equal('vaadin-markdown');
    expect(window.customElements.get('vaadin-markdown')).to.be.ok;
  });

  it('should be hidden', () => {
    element.hidden = true;
    expect(getComputedStyle(element).display).to.equal('none');
  });

  it('should be hidden with external display styles in place', () => {
    fixtureSync('<style>vaadin-markdown { display: block; }</style>');

    element.hidden = true;
    expect(getComputedStyle(element).display).to.equal('none');
  });

  it('should have default empty content', () => {
    expect(element.innerHTML.trim()).to.equal('');
  });

  it('should render markdown when content property is set', async () => {
    element.content = '# Heading';
    await nextUpdate(element);

    const heading = element.querySelector('h1');
    expect(heading).to.be.ok;
    expect(heading.textContent).to.equal('Heading');
  });

  it('should update markdown when content property changes', async () => {
    element.content = '# First heading';
    await nextUpdate(element);

    let heading = element.querySelector('h1');
    expect(heading.textContent).to.equal('First heading');

    element.content = '# Updated heading';
    await nextUpdate(element);

    heading = element.querySelector('h1');
    expect(heading.textContent).to.equal('Updated heading');
  });

  it('should handle undefined markdown content', async () => {
    element.content = '# Heading';
    await nextUpdate(element);

    element.content = undefined;
    await nextUpdate(element);

    expect(element.innerHTML.trim()).to.equal('');
  });

  it('should handle null markdown content', async () => {
    element.content = '# Heading';
    await nextUpdate(element);

    element.content = null;
    await nextUpdate(element);

    expect(element.innerHTML.trim()).to.equal('');
  });

  it('should handle empty string markdown content', async () => {
    element.content = '# Heading';
    await nextUpdate(element);

    element.content = '';
    await nextUpdate(element);

    expect(element.innerHTML.trim()).to.equal('');
  });

  it('should handle very large markdown content', async () => {
    // Generate large markdown content
    let largeMarkdown = '# Large Content Test\n\n';
    for (let i = 0; i < 50; i++) {
      largeMarkdown += `## Section ${i}\n\nParagraph with content for section ${i}.\n\n`;
    }

    element.content = largeMarkdown;
    await nextUpdate(element);

    expect(element.querySelectorAll('h2').length).to.equal(50);
  });

  it('should handle markdown with nested HTML structures', async () => {
    element.content = `
# Heading

<div class="wrapper">
  <div class="inner">
    <span>Nested content</span>
  </div>
</div>

More markdown
`;
    await nextUpdate(element);

    const wrapper = element.querySelector('.wrapper');
    expect(wrapper).to.be.ok;

    const inner = wrapper.querySelector('.inner');
    expect(inner).to.be.ok;

    const span = inner.querySelector('span');
    expect(span).to.be.ok;
    expect(span.textContent).to.equal('Nested content');
  });

  it('should handle replacing whole DOM structures', async () => {
    // Start with a list
    element.content = `
# Heading

* Item 1
* Item 2
* Item 3
`;
    await nextUpdate(element);

    expect(element.querySelector('ul')).to.be.ok;
    expect(element.querySelector('table')).to.be.null;

    // Replace with a completely different structure
    element.content = `
# Heading

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
    await nextUpdate(element);

    expect(element.querySelector('ul')).to.be.null;
    expect(element.querySelector('table')).to.be.ok;
    expect(element.querySelectorAll('td').length).to.equal(4);
  });

  it('should handle component reattachment to DOM', async () => {
    // Initial setup
    element.content = '# Test Heading';
    await nextUpdate(element);

    // Detach from DOM
    const parent = element.parentNode;
    parent.removeChild(element);

    // Modify while detached
    element.content = '# Modified Heading';

    // Reattach to DOM
    parent.appendChild(element);
    await nextUpdate(element);

    expect(element.querySelector('h1').textContent).to.equal('Modified Heading');
  });
});
