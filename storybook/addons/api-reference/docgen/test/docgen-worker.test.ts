import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, test } from 'node:test';
import type { DocgenPayload, DocgenProviderInput } from 'storybook/internal/types';
import { createDocgenProvider } from '../docgen-worker.ts';

const storiesDir = join(import.meta.dirname, '../../../../stories');
const input: DocgenProviderInput = {
  entry: {
    type: 'docs',
    id: 'combo-box--docs',
    name: 'Docs',
    title: 'Combo Box',
    importPath: './stories/combo-box.stories.js',
    storiesImports: [],
  },
};

const manifestFile = join(import.meta.dirname, '../../../../../custom-elements.json');

function comboBoxManifest() {
  const { modules } = JSON.parse(readFileSync(manifestFile, 'utf8'));
  for (const mod of modules) {
    const declaration = mod.declarations?.find((decl: { tagName?: string }) => decl.tagName === 'vaadin-combo-box');
    if (declaration) return { manifestPath: relative(process.cwd(), manifestFile), declaration };
  }
  throw new Error('vaadin-combo-box not found in custom-elements.json');
}

describe('createDocgenProvider', () => {
  test('should return a payload without a custom elements manifest unchanged', async () => {
    const payload: DocgenPayload = { id: 'x', name: 'x', path: 'x.stories.js', jsDocTags: {} };
    const provider = createDocgenProvider({ storiesDir })(() => Promise.resolve(payload));
    assert.equal(await provider(input), payload);
  });

  test('should add the API reference and the TypeScript types', async () => {
    const payload: DocgenPayload = {
      id: 'combo-box',
      name: 'vaadin-combo-box',
      path: './stories/combo-box.stories.js',
      jsDocTags: {},
      description:
        'Set [items](#/elements/vaadin-combo-box#property-items) or use [`<vaadin-item>`](#/elements/vaadin-item)',
      argTypes: {
        dataProvider: { name: 'dataProvider', table: { category: 'properties', type: { summary: 'object' } } },
        'custom-value-set-event': { name: 'custom-value-set', table: { category: 'events' } },
      },
      customElementsManifest: comboBoxManifest(),
    };
    const result = await createDocgenProvider({ storiesDir })(() => Promise.resolve(payload))(input);

    assert.match(String(result?.apiDescription), /^### dataProvider$/mu);
    assert.match(String(result?.apiDescription), /^### ComboBoxDataProvider$/mu);
    assert.equal(result?.description, 'Set [items](#items) or use `<vaadin-item>`');

    const { dataProvider, 'custom-value-set-event': event } = result?.argTypes ?? {};
    assert.equal(dataProvider.table?.type?.summary, 'ComboBoxDataProvider<any> | null | undefined');
    assert.match(String(dataProvider.table?.type?.detail), /export type ComboBoxDataProvider/u);
    assert.equal(event.table?.type?.summary, 'ComboBoxCustomValueSetEvent');
  });
});
