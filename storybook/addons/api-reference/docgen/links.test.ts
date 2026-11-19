import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import { readDocsIds, rewriteElementLinks } from './links.ts';

const docsIds = new Map([['vaadin-button', 'actions-button--docs']]);
const rewrite = (markdown: string) => rewriteElementLinks(markdown, { tag: 'vaadin-select', docsIds });

describe('rewriteElementLinks', () => {
  test('should link to an anchor on the page for the element itself', () => {
    assert.equal(rewrite('See [items](/elements/vaadin-select#items).'), 'See [items](#items).');
  });

  test('should keep the text of a link to the element itself without an anchor', () => {
    assert.equal(rewrite('[`<vaadin-select>`](/elements/vaadin-select)'), '`<vaadin-select>`');
  });

  test('should link to the docs page of an element with stories', () => {
    assert.equal(
      rewrite('[`<vaadin-button>`](/elements/vaadin-button)'),
      '[`<vaadin-button>`](?path=/docs/actions-button--docs)',
    );
    assert.equal(rewrite('[theme](/elements/vaadin-button#theme)'), '[theme](?path=/docs/actions-button--docs#theme)');
  });

  test('should keep the text of a link to an element without stories', () => {
    assert.equal(rewrite('Use [`<vaadin-item>`](/elements/vaadin-item) inside'), 'Use `<vaadin-item>` inside');
  });

  test('should keep other links', () => {
    const markdown = '[MDN](https://developer.mozilla.org) and [renderer](#renderer)';
    assert.equal(rewrite(markdown), markdown);
  });
});

describe('readDocsIds', () => {
  test('should map the component of each story file to its docs id', () => {
    const ids = readDocsIds(join(import.meta.dirname, '../../../stories'));
    assert.equal(ids.get('vaadin-combo-box'), 'fields-combo-box--docs');
    // The meta component, not the `component` of a subcomponent before the title
    assert.equal(ids.get('vaadin-select'), 'fields-select--docs');
    assert.equal(ids.has('hr'), false);
  });
});
