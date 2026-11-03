/**
 * Claude's risk assessment of a pull request: one Messages API call that reads
 * the pull request as untrusted text, without tools, and returns the four
 * dimension ratings and a suggested category as structured output.
 */
import fs from 'node:fs';
import { CATEGORIES } from './classify.js';

// Deliberately hard-coded; each is a one-line edit
const MODEL = 'claude-opus-5-5';
const EFFORT = 'medium';
const MAX_TOKENS = 16000;

/** Characters of the description that Claude reads */
const DESCRIPTION_BUDGET = 20_000;

const RATING = {
  type: 'object',
  properties: {
    level: { type: 'string', enum: ['low', 'medium', 'high'] },
    reason: { type: 'string' },
  },
  required: ['level', 'reason'],
  additionalProperties: false,
};

export const ASSESSMENT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    impact: RATING,
    blast_radius: RATING,
    uncertainty: RATING,
    reversibility: RATING,
    category: { type: 'string', enum: CATEGORIES },
    rationale: { type: 'string' },
  },
  required: ['summary', 'impact', 'blast_radius', 'uncertainty', 'reversibility', 'category', 'rationale'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = fs.readFileSync(new URL('prompt.md', import.meta.url), 'utf-8');

const STATUS_LETTERS = { added: 'A', removed: 'D', modified: 'M', renamed: 'R', copied: 'C', changed: 'T' };

function fileLine(file) {
  const status = STATUS_LETTERS[file.status] ?? '?';
  const name = file.previous_filename ? `${file.previous_filename} -> ${file.filename}` : file.filename;
  return `${status} ${name} (+${file.additions} -${file.deletions})`;
}

export function buildUserMessage({ pr, files, diff }) {
  const description = (pr.body ?? '').slice(0, DESCRIPTION_BUDGET);
  const sections = [
    `<title>${pr.title}</title>`,
    `<description>\n${description}\n</description>`,
    `<changed_files>\n${files.map(fileLine).join('\n')}\n</changed_files>`,
    `<diff>\n${diff.text}\n</diff>`,
  ];
  if (diff.omitted.length > 0) {
    sections.push(`<missing_diff>\n${diff.omitted.join('\n')}\n</missing_diff>`);
  }
  return sections.join('\n\n');
}

/** Throws when the call fails or ends without a valid assessment, so that a lost assessment is never mistaken for one */
export async function assess({ pr, files, diff }) {
  // The SDK is installed only by the workflow (npm ci in this directory), so
  // that the policy and its tests run without it
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const { jsonSchemaOutputFormat } = await import('@anthropic-ai/sdk/helpers/json-schema');

  const client = new Anthropic();
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    // A request that the safety classifiers decline runs again on the
    // fallback model that Anthropic recommends for the refusal category
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: EFFORT, format: jsonSchemaOutputFormat(ASSESSMENT_SCHEMA) },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserMessage({ pr, files, diff }) }],
  });

  if (response.stop_reason !== 'end_turn') {
    const category = response.stop_details?.category;
    throw new Error(`Claude stopped with ${response.stop_reason}${category ? ` (${category})` : ''}`);
  }
  if (!response.parsed_output) {
    throw new Error('Claude returned no assessment');
  }
  return response.parsed_output;
}
