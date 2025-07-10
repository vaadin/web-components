import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-card.js';
import '@vaadin/avatar/src/vaadin-avatar.js';
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/icon/src/vaadin-icon.js';
import '@vaadin/icons';

const content = '<div>Content</div>';
const title = '<div slot="title">Title</div>';
const subTitle = '<div slot="subtitle">Subtitle</div>';
const header = '<div slot="header">Header</div>';
const avatar = '<vaadin-avatar slot="header-prefix" abbr="A"></vaadin-avatar>';
const button = '<vaadin-button slot="footer">Button</vaadin-button>';
const image = '<img slot="media" width="200" src="/packages/card/test/visual/card-image.avif">';

const complexCard = `<vaadin-card>
  ${image}
  ${title}
  ${subTitle}
  <div slot="header-suffix" theme="badge">Badge</div>
  <div>Content lorem ipsum dolor sit amet.</div>
  ${button}
</vaadin-card>`;

const complexCardWithIcon = `<vaadin-card>
  <vaadin-icon slot="media" icon="vaadin:car" style="background: var(--lumo-primary-color-10pct); color: var(--lumo-primary-color); padding: 20px;"></vaadin-icon>
  ${title}
  ${subTitle}
  <div slot="header-suffix" theme="badge">Badge</div>
  <div>Content lorem ipsum dolor sit amet.</div>
  ${button}
</vaadin-card>`;

describe('card', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '20px';
  });

  const cardFixture = (content) => fixtureSync(`<vaadin-card>${content}</vaadin-card>`, div);

  describe('slot', () => {
    it('content', async () => {
      element = cardFixture(content);
      await visualDiff(div, 'slot-content');
    });

    it('title', async () => {
      element = cardFixture(title);
      await visualDiff(div, 'slot-title');
    });

    it('string title', async () => {
      element = cardFixture();
      element.cardTitle = 'Title lorem ipsum';
      await visualDiff(div, 'string-title');
    });

    it('subtitle', async () => {
      element = cardFixture(subTitle);
      await visualDiff(div, 'slot-subtitle');
    });

    it('title-subtitle', async () => {
      element = cardFixture(`${avatar}${title}${subTitle}`);
      await visualDiff(div, 'slot-title-subtitle');
    });

    it('title-subtitle-header', async () => {
      element = cardFixture(`${avatar}${header}${title}${subTitle}`);
      await visualDiff(div, 'slot-title-subtitle-header');
    });

    it('header', async () => {
      element = cardFixture(header);
      await visualDiff(div, 'slot-header');
    });

    it('header-prefix', async () => {
      element = cardFixture('<div slot="header-prefix">Prefix</div>');
      await visualDiff(div, 'slot-header-prefix');
    });

    it('header-suffix', async () => {
      element = cardFixture('<div slot="header-suffix">Suffix</div>');
      await visualDiff(div, 'slot-header-suffix');
    });

    it('footer', async () => {
      element = cardFixture('<div slot="footer">Footer</div>');
      await visualDiff(div, 'slot-footer');
    });

    it('media', async () => {
      element = cardFixture(image);
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
      element = cardFixture(content);
      element.setAttribute('theme', 'outlined');
      await visualDiff(div, 'theme-outlined');
    });

    it('elevated', async () => {
      element = cardFixture(content);
      div.style.setProperty('background-image', 'linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct))');
      element.setAttribute('theme', 'elevated');
      await visualDiff(div, 'theme-elevated');
    });

    it('outlined-elevated', async () => {
      element = cardFixture(content);
      div.style.setProperty('background-image', 'linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct))');
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
