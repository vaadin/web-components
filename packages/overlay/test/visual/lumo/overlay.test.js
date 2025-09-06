import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/overlay.css';
import '../../../vaadin-overlay.js';

describe('overlay', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync('<vaadin-overlay></vaadin-overlay>', div);
    element.renderer = (root) => {
      root.textContent = 'Simple overlay with text';
    };
  });

  it('basic', async () => {
    element.opened = true;
    await visualDiff(div, 'basic');
  });

  it('with-backdrop', async () => {
    element.withBackdrop = true;
    element.opened = true;
    await visualDiff(div, 'with-backdrop');
  });

  it('text-style-reset', async () => {
    Object.assign(div.style, {
      color: 'red',
      fontFamily: "'Comic Sans MS', cursive",
      fontSize: '20px',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontVariant: 'small-caps',
      lineHeight: '2',
      letterSpacing: '2px',
      textAlign: 'center',
      textDecoration: 'underline',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    });
    // Make overlay smaller to force text wrapping, also tests text-align on wrapped text
    element.$.overlay.style.width = '150px';
    element.opened = true;

    await visualDiff(div, 'text-style-reset');
  });
});
