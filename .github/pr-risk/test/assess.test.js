import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { assess, providerPackage, validateAssessment } from '../assess.js';

const VALID = {
  summary: 'Fixes a typo.',
  impact: { level: 'low', reason: 'r' },
  blast_radius: { level: 'low', reason: 'r' },
  uncertainty: { level: 'medium', reason: 'r' },
  reversibility: { level: 'high', reason: 'r' },
  category: 'amber',
  rationale: 'x',
};

describe('validateAssessment', () => {
  test('returns a valid assessment', () => {
    assert.equal(validateAssessment(VALID), VALID);
  });

  test('rejects a category, level or text outside the schema', () => {
    const invalid = [
      { ...VALID, category: 'none' },
      { ...VALID, category: 'Green' },
      { ...VALID, impact: { level: 'none', reason: 'r' } },
      { ...VALID, blast_radius: undefined },
      { ...VALID, rationale: 42 },
      null,
    ];
    for (const value of invalid) {
      assert.throws(() => validateAssessment(value), { message: 'The assessment does not match the schema' });
    }
  });
});

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
