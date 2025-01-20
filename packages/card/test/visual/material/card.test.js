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

const content = '<div>Content</div>';
const title = '<div slot="title">Title</div>';
const subTitle = '<div slot="subtitle">Subtitle</div>';
const header = '<div slot="header">Header</div>';
const avatar = '<vaadin-avatar slot="header-prefix" abbr="A"></vaadin-avatar>';
const suffix = '<div slot="header-suffix">Suffix</div>';
const button = '<vaadin-button slot="footer" theme="contained">Button</vaadin-button>';
const image = '<img slot="media" width="200" src="/packages/card/test/visual/card-image.avif">';

const complexCard = `<vaadin-card>
  ${image}
  ${title}
  ${subTitle}
  ${suffix}
  <div>Content lorem ipsum dolor sit amet.</div>
  ${button}
</vaadin-card>`;

const complexCardWithIcon = `<vaadin-card>
  <vaadin-icon slot="media" icon="vaadin:car" style="padding: 20px;"></vaadin-icon>
  ${title}
  ${subTitle}
  ${suffix}
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
      element = cardFixture(suffix);
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
      div.style.setProperty('background', 'var(--material-secondary-background-color)');
      element.setAttribute('theme', 'elevated');
      await visualDiff(div, 'theme-elevated');
    });

    it('outlined-elevated', async () => {
      element = cardFixture(content);
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
