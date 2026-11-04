import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { assess, decisionQuestions, decisionToAssessment, providerPackage, validateAssessment } from '../assess.js';

const VALID = {
  summary: 'Fixes a typo.',
  impact: { level: 'low', reason: 'r' },
  blast_radius: { level: 'low', reason: 'r' },
  uncertainty: { level: 'medium', reason: 'r' },
  reversibility: { level: 'high', reason: 'r' },
  category: 'amber',
  rationale: 'x',
};

/** A score answer as the API returns it: `score` is the weighted average of the level indexes */
function score(name, low, medium, high) {
  const probabilities = [
    { value: 0, label: 'low', probability: low },
    { value: 1, label: 'medium', probability: medium },
    { value: 2, label: 'high', probability: high },
  ];
  return { type: 'score', name, score: medium + 2 * high, confidence: 0.5, probabilities };
}

function decision(answers) {
  return { model: 'gpt-6-luna', answers, usage: {} };
}

const CATEGORY = {
  type: 'choice',
  name: 'category',
  choice: 'amber',
  confidence: 0.7,
  probabilities: [
    { value: 'green', probability: 0.1 },
    { value: 'amber', probability: 0.8 },
    { value: 'red', probability: 0.1 },
  ],
};

const ANSWERS = [
  score('impact', 0.92, 0.05, 0.03),
  // Most likely low, although the weighted score of 0.54 is closer to medium
  score('blast_radius', 0.53, 0.4, 0.07),
  // A tie goes to the riskier level
  score('uncertainty', 0.4, 0.4, 0.2),
  score('reversibility', 0.1, 0.3, 0.6),
  CATEGORY,
];

describe('validateAssessment', () => {
  test('returns a valid assessment, with reasons or with confidences', () => {
    assert.equal(validateAssessment(VALID), VALID);
    const decided = {
      impact: { level: 'low', probabilities: { low: 1, medium: 0, high: 0 } },
      blast_radius: { level: 'low', probabilities: { low: 0.5, medium: 0.5, high: 0 } },
      uncertainty: { level: 'medium', probabilities: { low: 0, medium: 0.9, high: 0.1 } },
      reversibility: { level: 'high', probabilities: { low: 0, medium: 0, high: 1 } },
      category: 'amber',
      probabilities: { green: 0.2, amber: 0.8, red: 0 },
    };
    assert.equal(validateAssessment(decided), decided);
  });

  test('rejects a category, level, text or confidence outside the schema', () => {
    const invalid = [
      { ...VALID, category: 'none' },
      { ...VALID, category: 'Green' },
      { ...VALID, impact: { level: 'none', reason: 'r' } },
      { ...VALID, blast_radius: undefined },
      { ...VALID, rationale: 42 },
      { ...VALID, probabilities: { green: 1.5 } },
      { ...VALID, probabilities: 0.9 },
      { ...VALID, impact: { level: 'low', probabilities: { low: '90%' } } },
      null,
    ];
    for (const value of invalid) {
      assert.throws(() => validateAssessment(value), { message: 'The assessment does not match the schema' });
    }
  });
});

describe('decisionQuestions', () => {
  test('asks for a score per dimension, from low to high, and for the category', () => {
    const questions = decisionQuestions();
    assert.deepEqual(
      questions.map(({ name, type }) => `${type} ${name}`),
      ['score impact', 'score blast_radius', 'score uncertainty', 'score reversibility', 'choice category'],
    );
    assert.deepEqual(
      questions[0].levels.map(({ label }) => label),
      ['low', 'medium', 'high'],
    );
    assert.deepEqual(
      questions[4].choices.map(({ value }) => value),
      ['green', 'amber', 'red'],
    );
  });
});

describe('decisionToAssessment', () => {
  test('rates each dimension by its most likely level', () => {
    assert.deepEqual(decisionToAssessment(decision(ANSWERS)), {
      impact: { level: 'low', probabilities: { low: 0.92, medium: 0.05, high: 0.03 } },
      blast_radius: { level: 'low', probabilities: { low: 0.53, medium: 0.4, high: 0.07 } },
      uncertainty: { level: 'medium', probabilities: { low: 0.4, medium: 0.4, high: 0.2 } },
      reversibility: { level: 'high', probabilities: { low: 0.1, medium: 0.3, high: 0.6 } },
      category: 'amber',
      probabilities: { green: 0.1, amber: 0.8, red: 0.1 },
      model: 'gpt-6-luna',
    });
  });

  test('fails when a question is refused or missing', () => {
    const refused = [...ANSWERS.slice(0, 4), { type: 'refusal', name: 'category' }];
    assert.throws(() => decisionToAssessment(decision(refused)), { message: 'gpt-6-luna declined to answer category' });
    assert.throws(() => decisionToAssessment(decision(ANSWERS.slice(1))), {
      message: 'The assessment does not match the schema',
    });
  });
});

describe('providerPackage', () => {
  test('prefers OpenAI and falls back to Claude', () => {
    assert.equal(providerPackage({ ANTHROPIC_API_KEY: 'a', OPENAI_API_KEY: 'o' }), 'openai');
    assert.equal(providerPackage({ ANTHROPIC_API_KEY: 'a' }), '@anthropic-ai/sdk');
    assert.equal(providerPackage({}), null);
  });
});

describe('assess', () => {
  test('fails without an API key', async () => {
    const pr = { title: 't', body: '' };
    await assert.rejects(assess({ pr, files: [], diff: { text: '', omitted: [] }, env: {} }), {
      message: 'Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set',
    });
  });
});
