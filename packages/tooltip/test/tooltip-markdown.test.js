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

  it('should have markdown property with default value false', () => {
    expect(tooltip.markdown).to.equal(false);
  });

  it('should reflect markdown property to attribute', async () => {
    expect(tooltip.hasAttribute('markdown')).to.be.false;

    tooltip.markdown = true;
    await nextUpdate(tooltip);
    expect(tooltip.hasAttribute('markdown')).to.be.true;
  });

  describe('markdown disabled', () => {
    it('should not parse markdown syntax by default', async () => {
      tooltip.text = '**Bold text** and *italic text*';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('**Bold text** and *italic text*');
    });
  });

  describe('markdown enabled', () => {
    beforeEach(async () => {
      tooltip.markdown = true;
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

  describe('switching between text and markdown', () => {
    it('should switch from text to markdown', async () => {
      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML).to.equal('**Bold text**');

      tooltip.markdown = true;
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Bold text</strong></p>');
    });

    it('should switch from markdown to text', async () => {
      tooltip.markdown = true;
      tooltip.text = '**Bold text**';
      await nextUpdate(tooltip);
      expect(contentNode.innerHTML.trim()).to.equal('<p><strong>Bold text</strong></p>');

      tooltip.markdown = false;
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

      tooltip.markdown = true;
      await nextUpdate(tooltip);

      expect(spy.callCount).to.equal(2);
      expect(spy.secondCall.args[0].detail).to.deep.equal({ content: 'Bold text\n' });
    });
  });
});
