import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { assess, providerPackage } from '../assess.js';

describe('providerPackage', () => {
  test('prefers Claude and falls back to OpenAI', () => {
    assert.equal(providerPackage({ ANTHROPIC_API_KEY: 'a', OPENAI_API_KEY: 'o' }), '@anthropic-ai/sdk');
    assert.equal(providerPackage({ OPENAI_API_KEY: 'o' }), 'openai');
    assert.equal(providerPackage({}), null);
  });
});

describe('assess', () => {
  test('fails without an API key', async () => {
    const pr = { title: 't', body: '' };
    await assert.rejects(assess({ pr, files: [], diff: { text: '', omitted: [] }, env: {} }), {
      message: 'Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is set',
    });
  });
});
