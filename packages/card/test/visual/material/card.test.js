import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-card.js';
import '@vaadin/button/theme/material/vaadin-button.js';
import '@vaadin/vaadin-material-styles/color-global.js';
import '@vaadin/vaadin-material-styles/typography-global.js';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/avatar/theme/material/vaadin-avatar.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.cardComponent = true;

const cardWithContent = `<vaadin-card><div>Content</div></vaadin-card>`;
const cardWithTitle = `<vaadin-card><div slot="title">Title</div></vaadin-card>`;
const cardWithSubtitle = `<vaadin-card><div slot="subtitle">Subtitle</div></vaadin-card>`;
const cardWithHeader = `<vaadin-card><div slot="header">Header</div></vaadin-card>`;
const cardWithHeaderPrefix = `<vaadin-card><div slot="header-prefix">Prefix</div></vaadin-card>`;
const cardWithHeaderSuffix = `<vaadin-card><div slot="header-suffix">Suffix</div></vaadin-card>`;
const cardWithTitleAndSubtitle = `<vaadin-card><vaadin-avatar slot="header-prefix" abbr="A"></vaadin-avatar><div slot="title">Title</div><div slot="subtitle">Subtitle</div></vaadin-card>`;
const cardWithTitleSubtitleAndHeader = `<vaadin-card><vaadin-avatar slot="header-prefix" abbr="A"></vaadin-avatar><div slot="header">Header</div><div slot="title">Title</div><div slot="subtitle">Subtitle</div></vaadin-card>`;
const cardWithFooter = `<vaadin-card><div slot="footer">Footer</div></vaadin-card>`;
const cardWithMedia = `<vaadin-card><img slot="media" width="200" src="https://images.unsplash.com/photo-1674572271917-ac95fbdbf76c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQzfHxsYXBsYW5kfGVufDB8fDB8fHww"></vaadin-card>`;
const complexCard = `<vaadin-card>
  <img slot="media" width="200" src="https://images.unsplash.com/photo-1674572271917-ac95fbdbf76c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQzfHxsYXBsYW5kfGVufDB8fDB8fHww">
  <div slot="title">Title</div>
  <div slot="subtitle">Subtitle</div>
  <div slot="header-suffix">Suffix</div>
  <div>Content lorem ipsum dolor sit amet.</div>
  <vaadin-button slot="footer" theme="contained">Button</vaadin-button>
</vaadin-card>`;
const complexCardWithIcon = `<vaadin-card>
  <vaadin-icon slot="media" icon="vaadin:car" style="background: var(--lumo-primary-color-10pct); color: var(--lumo-primary-color); padding: 20px;"></vaadin-icon>
  <div slot="title">Title</div>
  <div slot="subtitle">Subtitle</div>
  <div slot="header-suffix">Suffix</div>
  <div>Content lorem ipsum dolor sit amet.</div>
  <vaadin-button slot="footer" theme="contained">Button</vaadin-button>
</vaadin-card>`;

describe('card', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '20px';
  });

  describe('slot', () => {
    beforeEach(() => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '20px';
    });

    it('content', async () => {
      element = fixtureSync(cardWithContent, div);
      await visualDiff(div, 'slot-content');
    });

    it('title', async () => {
      element = fixtureSync(cardWithTitle, div);
      await visualDiff(div, 'slot-title');
    });

    it('subtitle', async () => {
      element = fixtureSync(cardWithSubtitle, div);
      await visualDiff(div, 'slot-subtitle');
    });

    it('title-subtitle', async () => {
      element = fixtureSync(cardWithTitleAndSubtitle, div);
      await visualDiff(div, 'slot-title-subtitle');
    });

    it('title-subtitle-header', async () => {
      element = fixtureSync(cardWithTitleSubtitleAndHeader, div);
      await visualDiff(div, 'slot-title-subtitle-header');
    });

    it('header', async () => {
      element = fixtureSync(cardWithHeader, div);
      await visualDiff(div, 'slot-header');
    });

    it('header-prefix', async () => {
      element = fixtureSync(cardWithHeaderPrefix, div);
      await visualDiff(div, 'slot-header-prefix');
    });

    it('header-suffix', async () => {
      element = fixtureSync(cardWithHeaderSuffix, div);
      await visualDiff(div, 'slot-header-suffix');
    });

    it('footer', async () => {
      element = fixtureSync(cardWithFooter, div);
      await visualDiff(div, 'slot-footer');
    });

    it('media', async () => {
      element = fixtureSync(cardWithMedia, div);
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'slot-media');
          resolve();
        };
      });
    });

    it('multiple', async () => {
      element = fixtureSync(complexCard, div);
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'slot-multiple');
          resolve();
        };
      });
    });
  });

  describe('theme', () => {
    it('outlined', async () => {
      element = fixtureSync(cardWithContent, div);
      element.setAttribute('theme', 'outlined');
      await visualDiff(div, 'theme-outlined');
    });

    it('elevated', async () => {
      element = fixtureSync(cardWithContent, div);
      div.style.setProperty('background', 'var(--material-secondary-background-color)');
      element.setAttribute('theme', 'elevated');
      await visualDiff(div, 'theme-elevated');
    });

    it('outlined-elevated', async () => {
      element = fixtureSync(cardWithContent, div);
      div.style.setProperty('background', 'var(--material-secondary-background-color)');
      element.setAttribute('theme', 'outlined elevated');
      await visualDiff(div, 'theme-outlined-elevated');
    });

    it('stretch-media', async () => {
      element = fixtureSync(complexCard, div);
      element.setAttribute('theme', 'stretch-media');
      element.style.setProperty('width', '300px');
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'theme-media-stretch');
          resolve();
        };
      });
    });

    it('cover-media-image', async () => {
      element = fixtureSync(complexCard, div);
      element.setAttribute('theme', 'cover-media');
      element.style.setProperty('width', '300px');
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'theme-media-cover-image');
          resolve();
        };
      });
    });

    it('cover-media-icon', async () => {
      element = fixtureSync(complexCardWithIcon, div);
      element.setAttribute('theme', 'cover-media');
      element.style.setProperty('width', '300px');
      await visualDiff(div, 'theme-media-cover-icon');
    });

    it('horizontal', async () => {
      element = fixtureSync(complexCard, div);
      element.setAttribute('theme', 'horizontal');
      element.style.setProperty('width', '400px');
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'theme-horizontal');
          resolve();
        };
      });
    });

    it('horizontal-cover-media', async () => {
      element = fixtureSync(complexCard, div);
      element.setAttribute('theme', 'horizontal cover-media');
      element.style.setProperty('width', '400px');
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'theme-horizontal-media-cover');
          resolve();
        };
      });
    });

    it('horizontal-stretch-media', async () => {
      element = fixtureSync(complexCard, div);
      element.setAttribute('theme', 'horizontal stretch-media');
      element.style.setProperty('width', '400px');
      await new Promise((resolve) => {
        element.querySelector('img').onload = async () => {
          await visualDiff(div, 'theme-horizontal-media-stretch');
          resolve();
        };
      });
    });
  });
});
