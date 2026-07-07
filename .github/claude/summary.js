#!/usr/bin/env node
/**
 * Summarize a Claude Code Action run for the GitHub job summary.
 *
 * The claude-code-action writes its full stream-json log to a file and
 * exposes the path as the `execution_file` step output. The action itself
 * only prints an aggregate to the console (e.g. "permission_denials_count":
 * 13) and leaves the job green even when Claude was blocked from using tools.
 * This script reads that file and surfaces the parts worth a glance:
 *
 *   - a session summary (outcome, turns, duration, cost, token usage)
 *   - the tools Claude was denied, so the maintainer knows what to add to
 *     `--allowedTools`
 *
 * The summary is appended to $GITHUB_STEP_SUMMARY (or printed to stdout when
 * run locally).
 *
 * Usage:
 *   node .github/claude/summary.js <execution-file>
 */

import fs from 'node:fs';

// Pull the final result event out of the stream-json log. It is the last
// message with type "result" and carries the run's aggregates.
function readResult(executionFile) {
  const messages = JSON.parse(fs.readFileSync(executionFile, 'utf8'));
  if (!Array.isArray(messages)) {
    throw new Error('Execution file is not a JSON array of messages');
  }
  const result = [...messages].reverse().find((m) => m && m.type === 'result');
  if (!result) {
    throw new Error('No result event found in execution file');
  }
  return result;
}

function formatDuration(ms) {
  if (!ms && ms !== 0) return '—';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function formatTokens(n) {
  return typeof n === 'number' ? n.toLocaleString('en-US') : '—';
}

function formatCost(usd) {
  return typeof usd === 'number' ? `$${usd.toFixed(4)}` : '—';
}

// Show the bare command/url for the common single-field tool inputs; fall
// back to the raw JSON for anything else.
function denialInput(input) {
  if (!input) return '';
  return input.command ?? input.url ?? JSON.stringify(input);
}

// The outcome is "success" or one of several error subtypes; is_error also
// flags a run that ended badly.
function outcomeLabel(result) {
  if (result.subtype === 'success' && !result.is_error) {
    return '✅ Success';
  }
  return `❌ ${result.subtype || 'error'}`;
}

function renderSessionSummary(result) {
  const lines = [];
  lines.push('## Claude Code session');
  lines.push('');
  lines.push('| Description | Value |');
  lines.push('|---|---|');
  lines.push(`| Outcome | ${outcomeLabel(result)} |`);
  lines.push(`| Turns | ${result.num_turns ?? '—'} |`);
  lines.push(`| Duration | ${formatDuration(result.duration_ms)} |`);
  lines.push(`| API time | ${formatDuration(result.duration_api_ms)} |`);
  lines.push(`| Cost | ${formatCost(result.total_cost_usd)} |`);
  if (result.session_id) {
    lines.push(`| Session | \`${result.session_id}\` |`);
  }
  lines.push('');
  return lines;
}

// modelUsage is keyed by model name; each entry has per-model token counts
// and cost. Render one row per model so multi-model runs stay readable.
function renderTokenUsage(result) {
  const modelUsage = result.modelUsage;
  if (!modelUsage || Object.keys(modelUsage).length === 0) {
    return [];
  }
  const lines = [];
  lines.push('### Token usage');
  lines.push('');
  lines.push('| Model | Input | Output | Cache read | Cache write | Cost |');
  lines.push('|---|--:|--:|--:|--:|--:|');
  for (const [model, u] of Object.entries(modelUsage)) {
    lines.push(
      `| \`${model}\` | ${formatTokens(u.inputTokens)} | ${formatTokens(u.outputTokens)} ` +
        `| ${formatTokens(u.cacheReadInputTokens)} | ${formatTokens(u.cacheCreationInputTokens)} ` +
        `| ${formatCost(u.costUSD)} |`,
    );
  }
  lines.push('');
  return lines;
}

// Group denials by tool name so a tool blocked repeatedly shows as one row
// with a count, rather than N near-identical rows.
function groupDenials(denials) {
  const byTool = new Map();
  for (const denial of denials) {
    const entry = byTool.get(denial.tool_name) || { count: 0, sample: denial.tool_input };
    entry.count += 1;
    byTool.set(denial.tool_name, entry);
  }
  return [...byTool.entries()]
    .map(([tool, { count, sample }]) => ({ tool, count, sample }))
    .sort((a, b) => b.count - a.count);
}

function renderPermissionDenials(result) {
  const denials = result.permission_denials || [];
  const lines = [];
  lines.push('### Permission denials');
  lines.push('');
  if (denials.length === 0) {
    lines.push('None — Claude used only allowed tools.');
    lines.push('');
    return lines;
  }
  lines.push(`Claude was blocked ${denials.length} time(s). Consider adding these to \`--allowedTools\`:`);
  lines.push('');
  lines.push('| Count | Tool | Example input |');
  lines.push('|--:|---|---|');
  for (const { tool, count, sample } of groupDenials(denials)) {
    lines.push(`| ${count} | \`${tool}\` | \`${denialInput(sample)}\` |`);
  }
  lines.push('');
  return lines;
}

function main() {
  const executionFile = process.argv[2];
  if (!executionFile) {
    console.error('Usage: node .github/claude/summary.js <execution-file>');
    process.exit(2);
  }

  const result = readResult(executionFile);

  const markdown = [...renderSessionSummary(result), ...renderTokenUsage(result), ...renderPermissionDenials(result)];

  const output = markdown.join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${output}\n`);
  } else {
    console.log(output);
  }
}

main();
