---
name: stable-release-notes
description: Prepare GitHub release notes for a beta or stable web-components release. Adds a "Changes Since {previous}" block (breaking / behavior altering changes and new features only, since the previous minor) on top of the bot-generated "Changes Since" block in the draft.
argument-hint: <current-version>
disable-model-invocation: true
allowed-tools: Read, Write, Bash(node:*), Bash(gh:*), Bash(git:*)
---

Prepare the GitHub release notes draft for version `$0` (e.g. `25.2.0-beta1`, `25.2.0`, `v25.2.0-rc1`).

The goal is to insert a new "Changes Since {previous}" block — listing only breaking changes and new features accumulated since the previous minor — directly after the API documentation link, while preserving the existing bot-generated "Changes Since" block below it.

## Steps

1. **Normalize `{current}`**:
   - Treat `$0` as the version tag. Prepend `v` if missing (e.g. `25.2.0-beta1` → `v25.2.0-beta1`).
   - Extract `<major>.<minor>` (e.g. `v25.2.0-beta1` → `25.2`) for the alpha1 lookup in step 2.
   - Remember `<major>` (e.g. `25`) — used in step 5.

2. **Resolve `{previous}` from alpha1**:
   - Run `gh release view v<major>.<minor>.0-alpha1 --repo vaadin/web-components`.
   - In the body, find the line that starts with `### Changes Since [<tag>](...)`.
   - Take the `<major>.<minor>` portion of that `<tag>` and form `{previous} = v<major>.<minor>.0` — the stable of the previous minor/major (e.g. alpha1 referencing `v25.1.0-beta2` → `{previous} = v25.1.0`).

3. **Make sure both tags are available locally**:
   - Fetch each tag explicitly so a conflict on an unrelated tag can't silently skip them: `git fetch origin "refs/tags/{previous}:refs/tags/{previous}" "refs/tags/{current}:refs/tags/{current}"`.
   - Verify `git rev-parse {previous}` and `git rev-parse {current}` both resolve.

4. **Generate release notes**:
   - Run `node ./scripts/generateReleaseNotes.js --from {previous} --to {current}` from the repo root.
   - Capture the full stdout — this is the raw notes for the `{previous}..{current}` range.

5. **Filter the generated output**:
   - Keep the `### Changes Since [{previous}](...)` heading line.
   - Keep only the `####` sections whose heading text (ignoring the emoji) ends with `Breaking Changes` or `New Features`. Drop every other `####` section.
   - Drop the leading version line and the `[API Documentation →]` line — those already exist in the draft.
   - **If `{current}` and `{previous}` share the same major** (e.g. `25.2` vs `25.1` — both `25`), rename the kept `Breaking Changes` heading to `Behavior Altering Changes`, leaving the emoji intact. Keep `Breaking Changes` when the major differs (e.g. `26.0` vs `25.2`).

6. **Read the existing draft**:
   - Run `gh release view {current} --repo vaadin/web-components --json body,isDraft,url`.
   - If the release is not a draft, stop and ask before continuing.
   - Note the existing body — it contains an `[API Documentation →]` line followed (after a blank line) by an `### Changes Since [<alpha-or-rc-tag>]...` block. That existing block must remain intact below the new one.

7. **Build the new body**:
   - Locate the `[API Documentation →]` line in the existing body.
   - Insert the filtered block from step 5 right after that line, separated by one blank line above and one blank line below.
   - Keep the existing `### Changes Since ...` block (and everything beneath it) exactly as it was, immediately after the inserted block.
   - Result layout:
     ```
     [API Documentation →](...)

     ### Changes Since [{previous}](...)

     #### :boom:　Behavior Altering Changes   (or "Breaking Changes" when major bumps)
     - ...

     #### :rocket:　New Features
     - ...

     ### Changes Since [<existing-tag>](...)

     #### ... (existing sections untouched)
     ```

8. **Update the draft**:
   - Write the new body to a temporary file (e.g. `/tmp/release-notes-{current}.md`).
   - Run `gh release edit {current} --repo vaadin/web-components --notes-file <tmp-file>`.

9. **Report**:
   - Print the draft preview URL from `gh release view {current} --repo vaadin/web-components --json url -q .url` so the user can review before publishing.
   - Do **not** publish the release.

## Notes

- All GitHub operations go through the `gh` CLI.
- Run all commands from the repository root so `./scripts/generateReleaseNotes.js` resolves correctly.
- The `previous` tag is derived from alpha1's "Changes Since" — that anchors the new block to the previous minor's last release, regardless of how many alphas this minor has had.
- Only Breaking / Behavior Altering Changes and New Features go into the new block; the unfiltered detail still lives in the original block below.
- Use "Behavior Altering Changes" when `{current}` and `{previous}` share the same major; use "Breaking Changes" when the major bumps.
