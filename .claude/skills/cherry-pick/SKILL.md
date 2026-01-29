---
name: cherry-pick
description: Cherry-pick a PR to a target version branch
argument-hint: <pr-url> <target-branch>
disable-model-invocation: true
allowed-tools: Read, Edit, Bash(git:*), Bash(gh:*), Bash(yarn:*)
---

Cherry-pick the PR with the GitHub URL $0 to the $1 branch.
This command is only run when automated cherry-picking failed, so expect merge conflicts.

## Steps

1. **Gather PR information** using `gh pr view`:
   - The base branch the PR was merged into (source branch)
   - The merge commit SHA
   - The PR branch name
   - The PR title
   - The PR description
   - The PR labels

2. **Prepare branches**:
   - Fetch latest commits for the source branch: `git fetch origin <source-branch>`
   - Fetch latest commits for the target branch: `git fetch origin $1`
   - Create a new branch from the remote target branch using `--no-track`: `git checkout -b <branch-name> origin/$1 --no-track`
   - Name the branch using the PR branch name with the target branch as suffix (e.g., `fix/click-event-listener-$1`)

3. **Cherry-pick the merge commit**:
   - Run `git cherry-pick -m 1 <merge-commit-sha>`
   - Resolve any merge conflicts. If needed, read the conflicting files from both the source and target branches to understand the differences.

4. **Verify the changes**:
   - Run unit tests for the affected component package(s)
   - If tests fail, investigate and fix the issue before proceeding

5. **Commit the resolved cherry-pick**:
   - Stage only the files that were part of the original cherry-pick or that you had to fix after running tests (do not include untracked files)
   - Complete the cherry-pick commit using the PR title as the commit message, appending "(CP: $1)" to the subject line

6. **Push and create PR**:
   - Push the branch to origin
   - Create a new PR targeting the $1 branch using `gh pr create`
   - Start the description with "This PR cherry-picks changes from the original PR #<pr-number> to branch $1."
   - Then add a separator (`---`) surrounded by new lines
   - Then add the original PR description, wrapped in a Markdown blockquote (prefix each line with `> `)

7. **Update original PR**:
   - If the original PR has the label `need to pick manually $1`, remove it
   - Add the label `cherry-picked-$1` to the original PR
   - Ignore any errors if the labels do not exist

You can use the `gh` CLI tool for GitHub operations throughout these steps.
