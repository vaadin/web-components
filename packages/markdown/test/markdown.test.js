import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextRender(element);
  });

  it('should be defined', () => {
    expect(element.localName).to.equal('vaadin-markdown');
    expect(window.customElements.get('vaadin-markdown')).to.be.ok;
  });

  it('should have a markdown-body div inside', () => {
    const body = element.querySelector('div.markdown-body');
    expect(body).to.be.ok;
  });

  it('should have default empty content', () => {
    const body = element.querySelector('div.markdown-body');
    expect(body.innerHTML.trim()).to.equal('');
  });

  it('should render markdown content when markdown property is set', async () => {
    element.markdown = '# Heading';
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    const heading = body.querySelector('h1');
    expect(heading).to.be.ok;
    expect(heading.textContent).to.equal('Heading');
  });

  it('should update content when markdown property changes', async () => {
    element.markdown = '# First heading';
    await nextUpdate(element);

    let body = element.querySelector('div.markdown-body');
    let heading = body.querySelector('h1');
    expect(heading.textContent).to.equal('First heading');

    element.markdown = '# Updated heading';
    await nextUpdate(element);

    body = element.querySelector('div.markdown-body');
    heading = body.querySelector('h1');
    expect(heading.textContent).to.equal('Updated heading');
  });

  it('should handle undefined markdown content', async () => {
    element.markdown = undefined;
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    expect(body.innerHTML.trim()).to.equal('');
  });

  it('should handle null markdown content', async () => {
    element.markdown = null;
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    expect(body.innerHTML.trim()).to.equal('');
  });

  it('should handle very large markdown content', async () => {
    // Generate large markdown content
    let largeMarkdown = '# Large Content Test\n\n';
    for (let i = 0; i < 50; i++) {
      largeMarkdown += `## Section ${i}\n\nParagraph with content for section ${i}.\n\n`;
    }

    element.markdown = largeMarkdown;
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    expect(body.querySelectorAll('h2').length).to.equal(50);
  });

  it('should handle markdown with nested HTML structures', async () => {
    element.markdown = `
# Heading

<div class="wrapper">
  <div class="inner">
    <span>Nested content</span>
  </div>
</div>

More markdown
`;
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    const wrapper = body.querySelector('.wrapper');
    expect(wrapper).to.be.ok;

    const inner = wrapper.querySelector('.inner');
    expect(inner).to.be.ok;

    const span = inner.querySelector('span');
    expect(span).to.be.ok;
    expect(span.textContent).to.equal('Nested content');
  });

  it('should handle replacing whole DOM structures', async () => {
    // Start with a list
    element.markdown = `
# Heading

* Item 1
* Item 2
* Item 3
`;
    await nextUpdate(element);

    let body = element.querySelector('div.markdown-body');
    expect(body.querySelector('ul')).to.be.ok;
    expect(body.querySelector('table')).to.be.null;

    // Replace with a completely different structure
    element.markdown = `
# Heading

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
    await nextUpdate(element);

    body = element.querySelector('div.markdown-body');
    expect(body.querySelector('ul')).to.be.null;
    expect(body.querySelector('table')).to.be.ok;
    expect(body.querySelectorAll('td').length).to.equal(4);
  });

  it('should correctly handle the component lifecycle', async () => {
    // Spy on updateMarkdownContent calls
    const updateSpy = sinon.spy(element, 'updated');

    // First update
    element.markdown = '# Test';
    await nextUpdate(element);

    expect(updateSpy.callCount).to.be.at.least(1);

    // Second update
    element.markdown = '# Updated Test';
    await nextUpdate(element);

    expect(updateSpy.callCount).to.be.at.least(2);

    // Verify the content was updated
    const body = element.querySelector('div.markdown-body');
    expect(body.querySelector('h1').textContent).to.equal('Updated Test');
  });

  it('should work with empty string markdown', async () => {
    element.markdown = '';
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    expect(body.innerHTML.trim()).to.equal('');
  });

  it('should handle component reattachment to DOM', async () => {
    // Initial setup
    element.markdown = '# Test Heading';
    await nextUpdate(element);

    // Detach from DOM
    const parent = element.parentNode;
    parent.removeChild(element);

    // Modify while detached
    element.markdown = '# Modified Heading';

    // Reattach to DOM
    parent.appendChild(element);
    await nextRender(element);
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');
    expect(body.querySelector('h1').textContent).to.equal('Modified Heading');
  });
});
