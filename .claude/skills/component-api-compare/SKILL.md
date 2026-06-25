---
name: component-api-compare
description: Decision gate for choosing between two or more viable API shapes, driven by code-preview options, recorded as an ADR
argument-hint: <component>
disable-model-invocation: true
allowed-tools: Read(packages/*/spec/api-design/*), AskUserQuestion, Write(packages/*/spec/api-design/*), Bash(gh:*)
---

Drive the API-shape decision for component $0 to a recorded conclusion. This step compares the viable shapes surfaced by `/component-api-explore`, forces a concrete choice through a code-preview gate, and writes an ADR that captures both the choice and the rejected options.

This is the step that, in the original Grid session, killed the `i18n`-object option and settled fallback-vs-concatenate. Its value is the decision gate — do not turn it into prose the user has to interpret.

## Anti-ceremony guard (check this first)

Only run this skill when **two or more genuinely viable API shapes** exist. If `explore.md` surfaced **one obvious shape**, this step is pure ceremony — stop and tell the user to run `/component-api-contract` instead. Comparing a single obvious option is an anti-pattern.

## Steps

1. **Read the input.** Read `packages/{component}/spec/api-design/explore.md`. If it does not exist, stop and tell the user to run `/component-api-explore` first. Confirm there are ≥2 viable shapes; if not, apply the guard above.

2. **Assemble each shape across the four fixed dimensions.** For every candidate shape, fill in:
   - **Code shape** — the actual property/method signatures a developer writes (WC and Flow).
   - **Test ergonomics** — how easy the shape is to drive from a unit/snapshot test.
   - **Theming impact** — does it add parts/attributes/CSS surface, or none.
   - **Flow API impact** — how it maps to the Flow setter family and whether it forces a connector/JSON-key change.

3. **Drive the decision gate with code previews.** Call `AskUserQuestion` with one option per shape. Each option's `preview` MUST be a concrete code block (the developer-facing signatures), not a prose summary — the user picks a shape they can see, not a description. Keep the prose label short; put the substance in the preview.

4. **Record the decision.** Write `packages/{component}/spec/api-design/decision.md` in the ADR format below. Capture the chosen shape, the drivers, every alternative considered (as a table across the four dimensions), why the choice won, and the consequences. Record the rejected options explicitly so reviewers don't re-litigate them.

5. **Offer to post the decision.** Ask whether to post the decision summary to the tracking GitHub issue. If yes, use `gh issue comment <issue> --body-file packages/{component}/spec/api-design/decision.md` (or a trimmed body). Skip silently if the user declines or there is no issue.

## Output format — `decision.md`

```markdown
# API decision — {component}: {capability}

## Decision

{The chosen shape, in one or two sentences, with the concrete signatures.}

## Drivers

- {what mattered: matching the existing naming family, minimal Flow churn, test ergonomics, theming surface, ...}

## Alternatives considered

| Shape | Code shape | Test ergonomics | Theming impact | Flow API impact |
| --- | --- | --- | --- | --- |
| **{Chosen}** | ... | ... | ... | ... |
| {Rejected A} | ... | ... | ... | ... |
| {Rejected B} | ... | ... | ... | ... |

## Why chosen

{Why the chosen shape beat the alternatives, tied back to the drivers.}

## Consequences

- {What this commits us to: a 2-repo JSON-key contract, a new connector hop, a default value, ...}
- {Anything deferred or explicitly out of scope.}
```

## Next step

Run **`/component-api-contract`** to lock the chosen shape into the cross-repo contract table (WC property ↔ Flow method ↔ JSON key ↔ wiring ↔ default).
