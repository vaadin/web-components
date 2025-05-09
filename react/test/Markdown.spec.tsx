import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Markdown } from '../packages/react-components/src/Markdown.js';

describe('Markdown', () => {
  it('should render child markdown', () => {
    render(<Markdown># Foobar</Markdown>);

    const markdown = document.querySelector('vaadin-markdown')!;
    expect(markdown).to.exist;
    expect(markdown.querySelector('h1')).to.exist;
    expect(markdown.querySelector('h1')).to.have.text('Foobar');
  });

  it('should render child string markdown', () => {
    render(<Markdown>{'# Foobar'}</Markdown>);

    const markdown = document.querySelector('vaadin-markdown')!;
    expect(markdown).to.exist;
    expect(markdown.querySelector('h1')).to.exist;
    expect(markdown.querySelector('h1')).to.have.text('Foobar');
  });
});
