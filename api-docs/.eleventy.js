import { HtmlBasePlugin } from '@11ty/eleventy';
import syntaxHighlightPlugin from '@11ty/eleventy-plugin-syntaxhighlight';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import { parse } from 'node-html-parser';

export default function (config) {
  // See https://www.11ty.dev/docs/config/
  config.setInputDirectory('content');
  config.setOutputDirectory('dist');
  config.setDataDirectory('../_data');
  config.setIncludesDirectory('../_includes');

  // See https://www.11ty.dev/docs/languages/markdown/
  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      linkify: true,
    }).use(markdownItAnchor, {
      slugify: config.getFilter('slugify'),
      level: [1, 2, 3, 4],
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'anchor-link',
        symbol: '#',
      }),
    }),
  );

  config.addPlugin(HtmlBasePlugin);
  config.addPlugin(syntaxHighlightPlugin, {
    preAttributes: {
      class: ({ language }) => `code-block language-${language}`,
    },
  });

  config.addPassthroughCopy('css');
  config.addPassthroughCopy('js');
  config.addPassthroughCopy({ img: '/' });

  // Copy markdown files for "view as MD"
  config.addPassthroughCopy({ 'content/elements': 'markdown' });

  config.addCollection('elements', (api) => {
    return api.getFilteredByGlob('./content/elements/*.md').sort((a, b) => {
      return a.data.title.localeCompare(b.data.title);
    });
  });

  // Table of contents
  config.addFilter('toc', (content) => {
    const html = parse(content);
    const headings = html.querySelectorAll('h1, h2, h3, h4');
    const toc = headings.map((heading) => {
      // Remove anchor links
      heading.querySelectorAll('[aria-hidden=true]').forEach((el) => el.remove());

      const id = heading.attributes.id;
      const text = heading.innerText;
      const level = parseInt(heading.tagName.replace('H', ''), 10);

      return { id, text, level };
    });

    // The page title already uses an h1, so it's recommended to start with h2
    // in the content. If the first heading is an h2 or higher, we'll adjust the
    // levels to start with level 1 to avoid unnecessary indentation in the TOC.
    const minLevel = Math.min(...toc.map((item) => item.level));
    if (minLevel > 1)
      toc.forEach((item) => {
        item.level -= minLevel - 1;
      });

    return toc;
  });
}
