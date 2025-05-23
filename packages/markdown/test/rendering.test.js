import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown content rendering', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextRender();
  });

  it('should render all basic markdown elements correctly', async () => {
    // Complex markdown with various elements
    element.content = `
# Heading 1
## Heading 2
### Heading 3

Paragraph with **bold** and *italic* text.

* List item 1
* List item 2
  * Nested item

1. Numbered item 1
2. Numbered item 2

> Blockquote text

[Link text](https://example.com)

\`\`\`
code block
\`\`\`

\`inline code\`

---

![Image alt text](image.jpg "Image title")
`;
    await nextUpdate(element);

    // Verify headings
    expect(element.querySelector('h1').textContent).to.equal('Heading 1');
    expect(element.querySelector('h2').textContent).to.equal('Heading 2');
    expect(element.querySelector('h3').textContent).to.equal('Heading 3');

    // Verify paragraph with formatting
    const paragraph = element.querySelector('p');
    expect(paragraph).to.be.ok;
    expect(paragraph.querySelector('strong')).to.be.ok;
    expect(paragraph.querySelector('em')).to.be.ok;

    // Verify lists
    expect(element.querySelector('ul')).to.be.ok;
    expect(element.querySelectorAll('ul li').length).to.be.at.least(3);
    expect(element.querySelector('ol')).to.be.ok;
    expect(element.querySelectorAll('ol li').length).to.equal(2);

    // Verify blockquote
    expect(element.querySelector('blockquote')).to.be.ok;

    // Verify link
    const link = element.querySelector('a');
    expect(link).to.be.ok;
    expect(link.getAttribute('href')).to.equal('https://example.com');

    // Verify code elements
    expect(element.querySelector('pre')).to.be.ok;
    expect(element.querySelector('code')).to.be.ok;

    // Verify horizontal rule
    expect(element.querySelector('hr')).to.be.ok;

    // Verify image (though the actual src won't work)
    const img = element.querySelector('img');
    expect(img).to.be.ok;
    expect(img.getAttribute('alt')).to.equal('Image alt text');
    expect(img.getAttribute('title')).to.equal('Image title');
  });

  it('should sanitize potentially dangerous HTML in markdown', async () => {
    // Markdown with potentially dangerous HTML
    element.content = `
# Safe heading

<script>alert('xss');</script>

<img src="x" onerror="alert('xss')">

[Safe link](https://example.com)
`;
    await nextUpdate(element);

    // Script tags should be removed
    expect(element.querySelector('script')).to.be.null;

    // Event handlers should be removed from elements
    const img = element.querySelector('img');
    expect(img.hasAttribute('onerror')).to.be.false;

    // Safe content should still be there
    expect(element.querySelector('h1').textContent).to.equal('Safe heading');
    const link = element.querySelector('a');
    expect(link).to.be.ok;
    expect(link.getAttribute('href')).to.equal('https://example.com');
  });

  it('should support custom elements in markdown', async () => {
    // Markdown with potentially dangerous HTML
    element.content = `
# Custom element test

<my-custom-element>Custom content</my-custom-element>
`;
    await nextUpdate(element);

    // Custom elements should be rendered correctly
    const customElement = element.querySelector('my-custom-element');
    expect(customElement).to.be.ok;
    expect(customElement.textContent).to.equal('Custom content');
  });
});
