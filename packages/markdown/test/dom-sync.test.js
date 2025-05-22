import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-markdown.js';

describe('vaadin-markdown DOM synchronization', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-markdown></vaadin-markdown>');
    await nextRender();
  });

  it('should not recreate the entire DOM on content updates', async () => {
    // Initial content
    element.content = '# Heading\n\nParagraph 1\n\nParagraph 2';
    await nextUpdate(element);

    const initialHeading = element.querySelector('h1');
    const [initialP1, initialP2] = element.querySelectorAll('p');

    // Update only the heading
    element.content = '# Updated Heading\n\nParagraph 1\n\nParagraph 2';
    await nextUpdate(element);

    // Get updated content
    const updatedHeading = element.querySelector('h1');
    const [updatedP1, updatedP2] = element.querySelectorAll('p');

    // Heading content should be updated, all nodes should be reused
    expect(updatedHeading.textContent).to.equal('Updated Heading');
    expect(updatedHeading).to.equal(initialHeading);
    expect(updatedP1).to.equal(initialP1);
    expect(updatedP2).to.equal(initialP2);
  });

  it('should handle attribute synchronization', async () => {
    // Markdown with an element that has attributes
    element.content = '# Heading\n\n<div id="test" class="sample">Content</div>';
    await nextUpdate(element);

    const testDiv = element.querySelector('#test');

    expect(testDiv.getAttribute('class')).to.equal('sample');

    // Update the attributes
    element.content = '# Heading\n\n<div id="test" class="updated">Content</div>';
    await nextUpdate(element);

    expect(testDiv.isConnected).to.be.true;
    expect(testDiv.getAttribute('class')).to.equal('updated');
  });

  it('should handle attribute removal in synchronized elements', async () => {
    // Markdown with an element that has multiple attributes
    element.content = '# Heading\n\n<div id="test" class="sample" data-test="value">Content</div>';
    await nextUpdate(element);

    const testDiv = element.querySelector('#test');

    expect(testDiv.getAttribute('class')).to.equal('sample');
    expect(testDiv.hasAttribute('data-test')).to.be.true;

    // Remove an attribute
    element.content = '# Heading\n\n<div id="test" class="sample">Content</div>';
    await nextUpdate(element);

    expect(testDiv.isConnected).to.be.true;
    expect(testDiv.getAttribute('class')).to.equal('sample');
    expect(testDiv.hasAttribute('data-test')).to.be.false;
  });

  it('should add new elements when needed', async () => {
    // Initial content with specific structure
    element.content = '# Heading\n\nSingle paragraph';
    await nextUpdate(element);

    expect(element.querySelectorAll('p').length).to.equal(1);

    // Add more elements
    element.content = '# Heading\n\nFirst paragraph\n\nSecond paragraph\n\nThird paragraph';
    await nextUpdate(element);

    expect(element.querySelectorAll('p').length).to.equal(3);
  });

  it('should remove elements when needed', async () => {
    // Initial content with multiple elements
    element.content = '# Heading\n\nParagraph 1\n\nParagraph 2\n\nParagraph 3';
    await nextUpdate(element);

    expect(element.querySelectorAll('p').length).to.equal(3);

    // Remove some elements
    element.content = '# Heading\n\nOnly paragraph';
    await nextUpdate(element);

    expect(element.querySelectorAll('p').length).to.equal(1);
  });

  it('should handle text node updates correctly', async () => {
    // Initial content
    element.content = '# Heading\n\nText content';
    await nextUpdate(element);

    const paragraph = element.querySelector('p');
    expect(paragraph.textContent).to.equal('Text content');

    // Update just the text content
    element.content = '# Heading\n\nUpdated text content';
    await nextUpdate(element);

    // The paragraph node should be reused, but text updated
    expect(paragraph.isConnected).to.be.true;
    expect(paragraph.textContent).to.equal('Updated text content');
  });
});
