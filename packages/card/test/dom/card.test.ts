import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-card.js';
import type { Card } from '../../src/vaadin-card.js';

describe('vaadin-card', () => {
  let card: Card;

  beforeEach(async () => {
    card = fixtureSync('<vaadin-card></vaadin-card>');
    await nextUpdate(card);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(card).dom.to.equalSnapshot();
    });

    it('card-title', async () => {
      card.cardTitle = 'Title';
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('media', async () => {
      const img = document.createElement('img');
      img.setAttribute('slot', 'media');
      card.appendChild(img);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('header', async () => {
      const header = document.createElement('div');
      header.setAttribute('slot', 'header');
      header.textContent = 'Header';
      card.appendChild(header);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('title', async () => {
      const title = document.createElement('div');
      title.setAttribute('slot', 'title');
      title.textContent = 'Title';
      card.appendChild(title);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('subtitle', async () => {
      const subtitle = document.createElement('div');
      subtitle.setAttribute('slot', 'subtitle');
      subtitle.textContent = 'Subtitle';
      card.appendChild(subtitle);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('title and header', async () => {
      const title = document.createElement('div');
      title.setAttribute('slot', 'title');
      title.textContent = 'Title';
      card.appendChild(title);
      const header = document.createElement('div');
      header.setAttribute('slot', 'header');
      header.textContent = 'Header';
      card.appendChild(header);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('subtitle and header', async () => {
      const subtitle = document.createElement('div');
      subtitle.setAttribute('slot', 'subtitle');
      subtitle.textContent = 'Subtitle';
      card.appendChild(subtitle);
      const header = document.createElement('div');
      header.setAttribute('slot', 'header');
      header.textContent = 'Header';
      card.appendChild(header);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('header-prefix', async () => {
      const prefix = document.createElement('div');
      prefix.setAttribute('slot', 'header-prefix');
      prefix.textContent = 'Prefix';
      card.appendChild(prefix);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('header-suffix', async () => {
      const suffix = document.createElement('div');
      suffix.setAttribute('slot', 'header-suffix');
      suffix.textContent = 'Suffix';
      card.appendChild(suffix);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('content', async () => {
      const content = document.createElement('div');
      content.textContent = 'Content';
      card.appendChild(content);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('text content', async () => {
      card.appendChild(document.createTextNode('Text content'));
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });

    it('footer', async () => {
      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.textContent = 'Footer';
      card.appendChild(footer);
      await nextUpdate(card);
      await expect(card).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(card).shadowDom.to.equalSnapshot();
    });
  });
});
