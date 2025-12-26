import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../../vaadin-card.js';

describe('card', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '20px';
  });

  const mediaFixture = (showImage, theme) => {
    const media = showImage
      ? '<img slot="media" width="200" src="/packages/card/test/visual/card-image.avif">'
      : `<vaadin-icon
          slot="media"
          icon="vaadin:car"
          style="padding: 20px;"
          class="aura-surface"
        ></vaadin-icon>`;

    return fixtureSync(
      `
        <vaadin-card style="width: 300px" theme="${theme}">
          ${media}
          <div slot="title">Title</div>
          <div slot="subtitle">Subtitle</div>
          <div>Content lorem ipsum dolor sit amet.</div>
          <vaadin-button slot="footer">Button</vaadin-button>
        </vaadin-card>
      `,
      div,
    );
  };

  const cardFixture = () => fixtureSync(`<vaadin-card><div>Content</div></vaadin-card>`, div);

  it('basic', async () => {
    element = cardFixture();
    await visualDiff(div, 'basic');
  });

  it('outlined', async () => {
    element = cardFixture();
    element.setAttribute('theme', 'outlined');
    await visualDiff(div, 'outlined');
  });

  it('elevated', async () => {
    element = cardFixture();
    element.setAttribute('theme', 'elevated');
    await visualDiff(div, 'elevated');
  });

  it('outlined-elevated', async () => {
    element = cardFixture();
    element.setAttribute('theme', 'outlined elevated');
    await visualDiff(div, 'outlined-elevated');
  });

  it('stretch-media', async () => {
    element = mediaFixture(true, 'stretch-media');
    await new Promise((resolve) => {
      element.querySelector('img').onload = async () => {
        await visualDiff(div, 'stretch-media');
        resolve();
      };
    });
  });

  it('cover-media-image', async () => {
    element = mediaFixture(true, 'cover-media');
    await new Promise((resolve) => {
      element.querySelector('img').onload = async () => {
        await visualDiff(div, 'cover-media-image');
        resolve();
      };
    });
  });

  it('cover-media-icon', async () => {
    element = mediaFixture(false, 'cover-media');
    await visualDiff(div, 'cover-media-icon');
  });
});
