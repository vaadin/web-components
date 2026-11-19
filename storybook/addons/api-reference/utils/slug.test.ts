import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createSlugger, headingTexts, slugify } from './slug.ts';

describe('slugify', () => {
  test('should create the ids of the api-docs site', () => {
    assert.equal(slugify('dataProvider'), 'dataprovider');
    assert.equal(slugify('custom-value-set'), 'custom-value-set');
    assert.equal(slugify('Static Methods'), 'static-methods');
    assert.equal(slugify('`label` part'), 'label-part');
  });
});

describe('createSlugger', () => {
  test('should add a suffix to repeated ids', () => {
    const slug = createSlugger();
    assert.deepEqual(['Items', 'items', 'Items'].map(slug), ['items', 'items-1', 'items-2']);
  });

  test('should give the seed headings their ids first', () => {
    const slug = createSlugger(['Items', 'Styling']);
    assert.equal(slug('items'), 'items-1');
    assert.equal(slug('value'), 'value');
  });
});

describe('headingTexts', () => {
  test('should return ATX headings outside code fences', () => {
    const markdown = ['## Items', 'Text', '```html', '# not a heading', '```', '### Styling ##'].join('\n');
    assert.deepEqual(headingTexts(markdown), ['Items', 'Styling']);
  });
});
