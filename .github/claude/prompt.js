#!/usr/bin/env node
/**
 * Build the extra prompt passed to the Claude Code Action from the webhook
 * payload ($GITHUB_EVENT_NAME, $GITHUB_EVENT_PATH). Writes it to $GITHUB_OUTPUT
 * as `prompt` using a heredoc delimiter, so multi-line prompts pass through
 * unescaped; prints to stdout when run locally.
 *
 * Usage:
 *   node .github/claude/prompt.js
 */

import fs from 'node:fs';

// The action's tag-mode prompt only contains the trigger comment's body, with
// no link to the review thread it replies to — a reply like "@claude fix this"
// is ambiguous and Claude tends to fix ALL review comments. Anchor the run to
// the triggering thread (file/line/comment ids). The line and reply clauses are
// only added when present, so a thread-starting comment reads cleanly.
function buildReviewCommentPrompt(comment) {
  const line = comment.original_line ? ` (line ${comment.original_line})` : '';
  const reply = comment.in_reply_to_id ? `, in reply to comment id ${comment.in_reply_to_id}` : '';
  return `SCOPE: You were triggered by review comment id ${comment.id} in a single \
review thread on file \`${comment.path}\`${line}${reply}. Find that thread in the \
review comments above and address ONLY the issue discussed in it. All other review \
comments and threads are background context — do not address them unless the trigger \
comment explicitly asks you to.`;
}

// Returns the prompt string for the given event, or '' when is not specific
// prompt for that event.
function buildPrompt(eventName, payload) {
  if (eventName === 'pull_request_review_comment') {
    return buildReviewCommentPrompt(payload.comment);
  }
  return '';
}

// Write a (possibly multi-line) value to $GITHUB_OUTPUT under `name` using the
// heredoc form GitHub expects. The delimiter must not appear in the value; the
// prompt is fully controlled here and never contains it.
function writeOutput(name, value) {
  const delimiter = 'CLAUDE_PROMPT_EOF';
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

function main() {
  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventName || !eventPath) {
    console.error('GITHUB_EVENT_NAME and GITHUB_EVENT_PATH must be set');
    process.exit(2);
  }

  const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const prompt = buildPrompt(eventName, payload);

  if (process.env.GITHUB_OUTPUT) {
    writeOutput('prompt', prompt);
  } else {
    console.log(prompt);
  }
}

main();
