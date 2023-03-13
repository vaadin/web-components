import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../autoload.js';

describe('headings', () => {
  it('default', async () => {
    const wrapper = fixtureSync(`
      <div>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>
    `);
    await visualDiff(wrapper, 'headings-default');
  });

  it('custom margins', async () => {
    const style = fixtureSync(`
      <style>
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 1.25em;
        }
        
        h1 {
          margin-bottom: 0.75em;
        }
        
        h2 {
          margin-bottom: 0.5em;
        }
        
        h3 {
          margin-bottom: 0.5em;
        }
        
        h4 {
          margin-bottom: 0.5em;
        }
        
        h5 {
          margin-bottom: 0.25em;
        }
        
        h6 {
          margin-bottom: 0;
        }
      </style>
    `);
    // Use prepend to avoid relying on the order of styles in the DOM.
    // The order can vary depending on the application.
    document.head.prepend(style);

    const wrapper = fixtureSync(`
      <div>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>
    `);
    await visualDiff(wrapper, 'headings-custom-margins');
  });
});
