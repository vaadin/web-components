# Phases 4–6 — Report, share, cleanup

## 1. The report

Copy [`assets/summary-template.md`](../assets/summary-template.md) to `<ROOT>/repro-<issue>-summary.md` and fill **every** field: observed vs. expected behavior, minimal steps, the inline reproduction, any screenshot/video. Cite only bug-relevant console output — never dev-server noise.

**Chat reply is a digest, not a copy**: verdict + regression classification + branch (if pushed) + 3–5 bullets of what was observed, then point at the summary file. Don't restate the full summary in chat — the file is canonical and becomes the comment.

Not reproduced: say so plainly and name the likely reason — fixed on `main` (cite the fixing PR from fix archaeology), version-specific, obsolete API, missing context. Don't force a positive result.

## 2. End every run with a question — never prose

The outward action is the user's; present it as an `AskUserQuestion` (2–4 options, recommended first), never a prose "want me to post…?":

- **Reproduced:** `Push + post + label` · `Push branch only` · `Report only`.
- **Not reproduced / fixed / duplicate:** the first option cites everything fix archaeology found — `Post close comment "Duplicate of #N, fixed by #PR"` (or just the PR / duplicate when only one is known); only when nothing was found offer the generic `Post "Could not reproduce using the latest Vaadin version. Closing as stale."`. Always include `Report only`.
- **Reproduced but works-as-designed / already tracked by an enhancement:** `Report only` · `Push + post noting it`.

Posting the comment is yours on approval; **closing the issue stays the user's action** unless they explicitly ask.

## 3. Share the reproduction branch (reproduced only)

Push from `<ROOT>`, under the `repro/` prefix so branches sort together.

1. Note the starting branch: `git -C <ROOT> rev-parse --abbrev-ref HEAD`.
2. Branch from the exact HEAD you reproduced on (e.g. a maintenance branch): `git -C <ROOT> checkout -b repro/<issue>`.
3. **Stage only the files you created/edited** — scaffold, summary, demo screenshot/`*.webm` (copy from `/tmp` first). **Never `git add -A`.**
   ```bash
   git -C <ROOT> add dev/repro-<issue>.html repro-<issue>-summary.md repro-<issue>.png
   git -C <ROOT> commit -m "test: reproduce #<issue> (<component>)"
   ```
4. Push: `git -C <ROOT> push -u origin repro/<issue>`. If the remote branch exists, use a suffix (`repro/<issue>-2`) rather than force-pushing.

**Posting the comment** goes to a public upstream issue. **Show the rendered comment and get ONE explicit confirmation covering both the comment AND the `ai repro` label** — a separate label request after posting can be denied by permission tooling. Post via file input:

```bash
gh api repos/vaadin/web-components/issues/<issue>/comments -F body=@repro-<issue>-summary.md
```

Capture the returned `html_url`. Keep the `> [!WARNING]` disclaimer first. Then label (same confirmation): `gh issue edit <issue> --repo vaadin/web-components --add-label "ai repro"`.

**Duplicate:** state it in the comment and recommend closing as a duplicate of #N (link both; note if #N is fixed). Surface the close command and run it only on explicit approval — never close yourself:

```bash
gh issue close <issue> --repo vaadin/web-components --reason "not planned" --comment "Duplicate of #N"
```

## 4. Screenshot embedding + permalinks

Reference a committed screenshot by **commit SHA**, not branch name — a slashed branch name breaks raw URLs. Add to the summary before posting:

```markdown
![<caption>](https://raw.githubusercontent.com/vaadin/web-components/<commit-sha>/repro-<issue>.png)
```

where `<commit-sha>` is `git -C <ROOT> rev-parse HEAD`. A video can't embed via `gh` — surface the local `.webm` path so the approver can drag-drop it.

Point at a suspected root cause as a **permalink pinned to a commit SHA**, not a bare `file:line`. On its own line it renders as an inline snippet:

```
https://github.com/vaadin/web-components/blob/<SHA>/<path>#L<start>-L<end>
```

Anchor it to the commit you reproduced on (`git -C <ROOT> rev-parse HEAD`); your branch leaves `src/` untouched, so line numbers match.

## 5. Cleanup

Stop the background `yarn start` task.

**If it reproduced and you pushed `repro/<issue>`** — scaffold and summary are committed on that branch, so the working line is already clean. Just switch back:

```bash
git -C <ROOT> checkout <starting-branch>
git -C <ROOT> branch -D repro/<issue>      # optional; preserved on the remote
git -C <ROOT> branch -D <major>.<minor>    # drop any temp maintenance branch
```

**If it did not reproduce (no branch pushed)** — discard any tracked edits first, delete the untracked scaffold, then switch back:

```bash
rm -f <ROOT>/dev/repro-<issue>.html
git -C <ROOT> checkout <starting-branch>
git -C <ROOT> branch -D <major>.<minor>    # drop any temp maintenance branch
```

If you switched version lines during the session, run `yarn install` after switching back. Confirm `git -C <ROOT> status --porcelain` matches the Phase 0 baseline — your scaffold files gone, pre-existing entries untouched — and the repo is on the branch it started on. Delete any `/tmp` screenshot. Leave the pushed `repro/*` branches — they are the shared artifacts.
