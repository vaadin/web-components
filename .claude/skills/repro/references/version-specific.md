# Reproducing a version-specific bug

Use this when the bug is reported against an older line than the current checkout (e.g. "up to and including 24.10.1, fixed in 25.x" while you are on the 25.x line). A run on the current line only confirms the negative — to validate the report you must reproduce it on the affected line.

Both repos name maintenance branches `<major>.<minor>` (e.g. `24.10`, `25.1`). The branch for "up to 24.10.x" is `24.10`.

**Pick the newest line that still reproduces — not necessarily the exact reported minor.** A bug filed against, say, `24.5` almost always still reproduces up the `24.x` line, and a newer branch (e.g. `24.10`) builds cleanly with a modern JDK whereas the oldest branches (≲ 24.6) fail to compile under Java 17/21 (old `maven-compiler-plugin`; see [flow-component.md](flow-component.md)). Start at the latest line of the reported major and only drop to an older minor if the bug does not reproduce there (then you have also learned the upper bound). For Flow this means trying `24.10` before `24.5`.

## Which repo to switch

- **Flow bug** → switch only `<FLOW_ROOT>`. Its integration tests resolve the `@vaadin/*` web components from npm at the version pinned on that branch, so the local web-components checkout is not involved.
- **Web-component bug** → switch only `<WC_ROOT>`.

Switch the minimum needed; do not touch the other repo.

## Safety — never clobber the user's work

1. **Record the starting branch** so you can restore it:
   ```bash
   git -C <ROOT> rev-parse --abbrev-ref HEAD    # remember this value
   ```
2. **Require a clean tree.** If `git -C <ROOT> status --porcelain` is non-empty, stop and ask the user before switching — do not stash or discard their work on your own.
3. **Fetch and check out** the target branch:
   ```bash
   git -C <ROOT> fetch origin <major>.<minor>
   git -C <ROOT> checkout <major>.<minor>
   ```
4. **Reinstall dependencies** for that branch:
   - `<WC_ROOT>`: `yarn install` (run from the repo root).
   - `<FLOW_ROOT>`: the `mvn package jetty:run` build resolves Maven and frontend deps; no separate step.

## Validate both ends

A "version-specific" verdict needs evidence at both ends:
- Reproduce the bug on the affected branch (build, run, drive the browser as in the flavor reference).
- Confirm it does **not** reproduce on the current checkout (you are already there before switching, or switch back and re-check).

Report both observations. If it does not reproduce even on the affected branch, say so — the report may be wrong about the version, or missing context.

## Restore (cleanup)

Return each repo you touched to its starting state. The path depends on whether you pushed a `repro/<issue>` branch (Phase 6).

**If it reproduced and you pushed `repro/<issue>`** — the scaffold, summary, and any IT-pom edit were committed on that branch (created from the maintenance branch HEAD), so the affected branch is already clean. Just switch back:
```bash
git -C <ROOT> checkout <starting-branch>
git -C <ROOT> branch -D repro/<issue>     # optional; preserved on the remote
git -C <ROOT> branch -D <major>.<minor>   # drop the temp maintenance branch if you created one
# if you switched <WC_ROOT>, restore its deps:
#   yarn install   (run from <WC_ROOT>)
```

**If it did not reproduce (no branch pushed)** — order matters: a tracked edit (e.g. an IT `pom.xml` dependency) makes `git checkout <branch>` abort with "Please commit your changes or stash them", so discard tracked edits first, delete untracked scaffold, then switch back:
```bash
git -C <ROOT> checkout -- <path/to/edited/pom.xml>   # discard tracked edits (if any)
rm -f <path/to/scaffold/file>                          # delete untracked scaffold (View / dev page)
git -C <ROOT> checkout <starting-branch>
git -C <ROOT> branch -D <major>.<minor>                # drop the temp maintenance branch
```

Either way, confirm `git -C <ROOT> status --porcelain` is empty (ignoring unrelated pre-existing untracked files) and the repo is on the branch it started on.
