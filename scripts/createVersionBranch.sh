#!/bin/bash
set -e

# Usage: ./scripts/createVersionBranch.sh <base-branch> <version-branch> <bump-version>
#
# Scenarios:
#   Bump main to new minor:       ./scripts/createVersionBranch.sh main 25.1 25.2.0-alpha0
#   Bump main to new major:       ./scripts/createVersionBranch.sh main 25.1 26.0.0-alpha0
#   New minor in previous major:  ./scripts/createVersionBranch.sh 24.9 24.10 24.10.0-alpha0

BASE_BRANCH="$1"
VERSION_BRANCH="$2"
BUMP_VERSION="$3"

if [ -z "$BASE_BRANCH" ] || [ -z "$VERSION_BRANCH" ] || [ -z "$BUMP_VERSION" ]; then
  echo "Usage: $0 <base-branch> <version-branch> <bump-version>"
  exit 1
fi

# Step 1: Create the version branch from the base branch
echo "Creating version branch $VERSION_BRANCH from $BASE_BRANCH..."
git checkout "$BASE_BRANCH" && git pull
yarn install --frozen-lockfile > /dev/null
git checkout -b "$VERSION_BRANCH"
git push origin "$VERSION_BRANCH"

# Step 2: Create PR to update change detection in wtr-utils.js in the new version branch
echo "Creating PR to update change detection for $VERSION_BRANCH..."
git checkout -b "update-v${VERSION_BRANCH}"
sed -i '' "s|origin/${BASE_BRANCH}|origin/${VERSION_BRANCH}|g" wtr-utils.js
git add -u && git commit -m "chore: update change detection for ${VERSION_BRANCH}"
git push -u origin "update-v${VERSION_BRANCH}"
PR1=$(gh pr create --base "$VERSION_BRANCH" --head "update-v${VERSION_BRANCH}" --title "chore: update change detection for ${VERSION_BRANCH}" --body "")

# Step 3: Create PR to bump the version
# - From main: bump main
# - From version branch: bump the new version branch
if [ "$BASE_BRANCH" = "main" ]; then
  BUMP_BASE="main"
  git checkout main
else
  BUMP_BASE="$VERSION_BRANCH"
  git checkout "$VERSION_BRANCH"
fi

echo "Creating PR to bump version in $BUMP_BASE to $BUMP_VERSION..."

git checkout -b "bump-v${BUMP_VERSION}"
export npm_config_bump="$BUMP_VERSION"
node scripts/updateVersion.js > /dev/null
npx lerna version "$BUMP_VERSION" --no-push --no-git-tag-version --force-publish --exact --yes > /dev/null
git add -u && git commit -m "chore: bump to ${BUMP_VERSION}"
git push -u origin "bump-v${BUMP_VERSION}"
PR2=$(gh pr create --base "$BUMP_BASE" --head "bump-v${BUMP_VERSION}" --title "chore: bump to ${BUMP_VERSION}" --body "")

echo ""
echo "Created PRs:"
echo "  $PR1"
echo "  $PR2"
