import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown content rendering', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextRender(element);
  });

  it('should render all basic markdown elements correctly', async () => {
    // Complex markdown with various elements
    element.markdown = `
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

    const body = element.querySelector('div.markdown-body');

    // Verify headings
    expect(body.querySelector('h1').textContent).to.equal('Heading 1');
    expect(body.querySelector('h2').textContent).to.equal('Heading 2');
    expect(body.querySelector('h3').textContent).to.equal('Heading 3');

    // Verify paragraph with formatting
    const paragraph = body.querySelector('p');
    expect(paragraph).to.be.ok;
    expect(paragraph.querySelector('strong')).to.be.ok;
    expect(paragraph.querySelector('em')).to.be.ok;

    // Verify lists
    expect(body.querySelector('ul')).to.be.ok;
    expect(body.querySelectorAll('ul li').length).to.be.at.least(3);
    expect(body.querySelector('ol')).to.be.ok;
    expect(body.querySelectorAll('ol li').length).to.equal(2);

    // Verify blockquote
    expect(body.querySelector('blockquote')).to.be.ok;

    // Verify link
    const link = body.querySelector('a');
    expect(link).to.be.ok;
    expect(link.getAttribute('href')).to.equal('https://example.com');

    // Verify code elements
    expect(body.querySelector('pre')).to.be.ok;
    expect(body.querySelector('code')).to.be.ok;

    // Verify horizontal rule
    expect(body.querySelector('hr')).to.be.ok;

    // Verify image (though the actual src won't work)
    const img = body.querySelector('img');
    expect(img).to.be.ok;
    expect(img.getAttribute('alt')).to.equal('Image alt text');
    expect(img.getAttribute('title')).to.equal('Image title');
  });

  it('should handle incremental content updates efficiently', async () => {
    // Initial content
    element.markdown = '# Initial heading\n\nParagraph text.';
    await nextUpdate(element);

    let body = element.querySelector('div.markdown-body');
    const initialHeading = body.querySelector('h1');

    // Update with similar content (should reuse DOM nodes)
    element.markdown = '# Updated heading\n\nParagraph text.';
    await nextUpdate(element);

    body = element.querySelector('div.markdown-body');
    const updatedHeading = body.querySelector('h1');

    // The content should be updated, but the DOM structure should be similar
    expect(updatedHeading.textContent).to.equal('Updated heading');

    // The paragraphs should remain unchanged
    const paragraph = body.querySelector('p');
    expect(paragraph.textContent).to.equal('Paragraph text.');
  });

  it('should sanitize potentially dangerous HTML in markdown', async () => {
    // Markdown with potentially dangerous HTML
    element.markdown = `
# Safe heading

<script>alert('xss');</script>

<img src="x" onerror="alert('xss')">

[Safe link](https://example.com)
`;
    await nextUpdate(element);

    const body = element.querySelector('div.markdown-body');

    // Script tags should be removed
    expect(body.querySelector('script')).to.be.null;

    // Event handlers should be removed from elements
    const img = body.querySelector('img');
    if (img) {
      expect(img.hasAttribute('onerror')).to.be.false;
    }

    // Safe content should still be there
    expect(body.querySelector('h1').textContent).to.equal('Safe heading');
    const link = body.querySelector('a');
    expect(link).to.be.ok;
    expect(link.getAttribute('href')).to.equal('https://example.com');
  });
});
