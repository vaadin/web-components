import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-tooltip.js';

describe('vaadin-tooltip content-type', () => {
  let tooltip, overlay, contentNode;

  beforeEach(async () => {
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    await nextRender();
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    contentNode = tooltip.querySelector('[slot="overlay"]');

    // Preload markdown helpers to avoid dynamic import delays
    await tooltip.__importMarkdownHelpers();
  });

  it('should have contentType property with default value text', () => {
    expect(tooltip.contentType).to.equal('text');
  });

  it('should reflect contentType property to attribute', async () => {
    expect(tooltip.getAttribute('content-type')).to.equal('text');

    tooltip.contentType = 'markdown';
    await nextUpdate(tooltip);
    expect(tooltip.getAttribute('content-type')).to.equal('markdown');
  });

  describe('contentType text', () => {
    it('should not parse markdown syntax', async () => {
      tooltip.text = '**Bold text** and *italic text*';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('**Bold text** and *italic text*');
    });
  });

  describe('contentType markdown', () => {
    beforeEach(async () => {
      tooltip.contentType = 'markdown';
      await nextUpdate(tooltip);
    });

    it('should parse markdown syntax', async () => {
      tooltip.text = '**Bold text** and *italic text*';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Bold text</strong> and <em>italic text</em></p>');
    });

    it('should update content when markdown text changes', async () => {
      tooltip.text = '# Heading 1';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<h1>Heading 1</h1>');

      tooltip.text = '## Heading 2';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<h2>Heading 2</h2>');
    });

    it('should handle empty/null/undefined content', async () => {
      tooltip.text = '';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('');

      tooltip.text = null;
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('');

      tooltip.text = undefined;
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('');
    });

    it('should sanitize markdown', async () => {
      tooltip.text = '<script>alert("xss")</script>\n\n**Safe content**';
      await nextUpdate(tooltip);

      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Safe content</strong></p>');
    });

    it('should hide overlay when markdown content is empty', async () => {
      tooltip.text = '';
      await nextUpdate(tooltip);

      expect(overlay.hasAttribute('hidden')).to.be.true;
    });

    it('should show overlay when markdown content is not empty', async () => {
      tooltip.text = '**Content**';
      await nextUpdate(tooltip);

      expect(overlay.hasAttribute('hidden')).to.be.false;
    });

    it('should fire content-changed event when markdown content is set', async () => {
      const spy = sinon.spy();
      tooltip.addEventListener('content-changed', spy);

      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);

      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: 'Bold text\n' });
    });
  });

  describe('switching between content types', () => {
    it('should switch from text to markdown', async () => {
      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('**Bold text**');

      tooltip.contentType = 'markdown';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Bold text</strong></p>');
    });

    it('should switch from markdown to text', async () => {
      tooltip.contentType = 'markdown';
      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Bold text</strong></p>');

      tooltip.contentType = 'text';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('**Bold text**');
    });

    it('should fire content-changed event when switching content types', async () => {
      const spy = sinon.spy();
      tooltip.addEventListener('content-changed', spy);

      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);

      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: '**Bold text**' });

      tooltip.contentType = 'markdown';
      await nextUpdate(tooltip);

      expect(spy.callCount).to.equal(2);
      expect(spy.secondCall.args[0].detail).to.deep.equal({ content: 'Bold text\n' });
    });
  });
});
