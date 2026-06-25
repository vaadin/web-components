---
name: component-api-spike
description: Prototype the locked API contract on a proto branch, verify across WC and Flow toolchains, and decide graduate-or-teardown
argument-hint: <component>
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash(git:*), Bash(yarn:*), Bash(mvn:*), Bash(cd ../flow-components*)
---

Prototype the cross-repo contract for component $0 just enough to *feel* the API shape, verify it builds on both toolchains, and decide whether the proto **graduates** into the real change or gets **torn down**. This is the only skill in the set that mutates source — and all mutation stays on a `proto/*` branch.

## Branch safety (do this BEFORE any edit — non-negotiable)

1. Run `git rev-parse --abbrev-ref HEAD` to read the current branch.
2. **Refuse to run on `main`, `master`, or any version branch** (e.g. `24.8`, `v24.8`, anything matching a release line). If on such a branch, stop and tell the user to create or switch to a `proto/*` branch first — make no edits.
3. If the current branch is already a `proto/*` branch, proceed on it. Otherwise create one: `git checkout -b proto/<slug>` where `<slug>` describes the capability (e.g. `proto/grid-item-selectable`). Only then make any edit.

## Steps

1. **Read the input.** Read `packages/{component}/spec/api-design/contract.md` (and `decision.md` / `explore.md` for context). If `contract.md` does not exist, stop and tell the user to run `/component-api-contract` first.

2. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "The spike needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill."

3. **Stub the WC side.** Add the WC properties from the contract (stub bodies are fine), a minimal `dev/` playground entry that exercises the new API, and minimal tests under `packages/{component}/test/`.

4. **Stub the Flow side.** In the flow-components repo, add the Flow setters from the contract (signatures + minimal wiring). Use `cd ../flow-components && mvn ...` for Flow commands.

5. **Verify across both toolchains (capture every result in the report):**
   - **WC:**
     - `yarn lint:types`
     - `yarn test --group {component} --glob="<pattern>"`
     - `yarn test:snapshots --group {component}`
   - **Flow:** in the relevant `*-flow-parent` module, `mvn -o ... test-compile`.

   **Gotchas to encode:**
   - **`--glob` auto-suffix:** the test runner appends a suffix to the glob, so pass the stem only — `--glob="selection"` matches `selection*.test.js`; do **not** write the full filename or extension.
   - **Offline `mvn -o`:** run Maven offline (`-o`) to avoid slow/failed network resolution; if `-o` fails because an artifact isn't cached, run once online to populate `~/.m2`, then return to `-o`.

6. **Write the report.** Write `packages/{component}/spec/api-design/spike-report.md` in the format below: "works / awkward" notes, the verification results, and an explicit **graduate-or-teardown** decision.

## Proto hygiene checklist (apply before/with the commit)

- **Squash/amend** the proto into a clean commit history — don't leave a trail of WIP commits.
- **Force-push** the `proto/*` branch after amending (`git push --force-with-lease`).
- Add the **co-author footer** required by the repo commit rules to the commit message.
- **Leave unrelated untracked files alone** — stage only the spike's own files.
- **Commit + push only — never open a PR from a `proto/*` branch.** Proto branches are discovery scratch; the real PR comes later from the graduated change.

## Output format — `spike-report.md`

```markdown
# Spike report — {component}: {capability}

**Proto branch:** `proto/<slug>`

## Works

- {what felt right: the shape, the test ergonomics, the data-path reuse}

## Awkward

- {smells: e.g. the grid↔column placement split; connector-wiring/timing risk}

## Verification

| Check | Command | Result |
| --- | --- | --- |
| WC types | `yarn lint:types` | {pass/fail} |
| WC unit | `yarn test --group {component} --glob="<pattern>"` | {X passed, Y failed} |
| WC snapshots | `yarn test:snapshots --group {component}` | {pass/fail} |
| Flow compile | `mvn -o ... test-compile` | {pass/fail} |

## Decision

**Graduate** | **Teardown** — {one paragraph: why, and what to carry forward or revert}
```

## Next step

If the shape felt right, **graduate**: hand `explore.md` + `contract.md` + the `proto/*` branch to SDD's `create-component-web-component-api` / `create-component-flow-api` to turn the validated shape into the formal spec. If the shape felt awkward, iterate back to **`/component-api-compare`** with the spike's "awkward" notes as new input.
